package middleware

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"sort"
	"strings"

	"foodsave/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ValidateTelegramData implements Telegram's crypto algorithm to verify data integrity
func ValidateTelegramData(initData, token string) (bool, error) {
	parsed, err := url.ParseQuery(initData)
	if err != nil {
		return false, err
	}

	hash := parsed.Get("hash")
	if hash == "" {
		return false, fmt.Errorf("no hash found")
	}

	var dataCheckArr []string
	for k, v := range parsed {
		if k != "hash" {
			dataCheckArr = append(dataCheckArr, fmt.Sprintf("%s=%s", k, v[0]))
		}
	}

	sort.Strings(dataCheckArr)
	dataCheckString := strings.Join(dataCheckArr, "\n")

	secretKeyStore := hmac.New(sha256.New, []byte("WebAppData"))
	secretKeyStore.Write([]byte(token))
	secretKey := secretKeyStore.Sum(nil)

	h := hmac.New(sha256.New, secretKey)
	h.Write([]byte(dataCheckString))
	calculatedHash := hex.EncodeToString(h.Sum(nil))

	// Constant time compare to avoid timing attacks
	return hmac.Equal([]byte(calculatedHash), []byte(hash)), nil
}

type TelegramUser struct {
	ID        int64  `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Username  string `json:"username"`
}

func TelegramAuth(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		initData := ""

		if strings.HasPrefix(authHeader, "tma ") {
			initData = strings.TrimPrefix(authHeader, "tma ")
		} else {
			// fallback to query param for websockets
			initData = c.Query("initData")
		}

		if initData == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing Telegram initData"})
			return
		}

		token := os.Getenv("TELEGRAM_BOT_TOKEN")
		if token == "" {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "TELEGRAM_BOT_TOKEN not configured"})
			return
		}

		valid, err := ValidateTelegramData(initData, token)
		if err != nil || !valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid Telegram data signature"})
			return
		}

		// Parse user and inject to context
		parsed, _ := url.ParseQuery(initData)
		userJSON := parsed.Get("user")
		if userJSON != "" {
			var tgUser TelegramUser
			if err := json.Unmarshal([]byte(userJSON), &tgUser); err == nil {
				// Find or create the user in the database
				var dbUser models.User
				if result := db.Where("telegram_id = ?", tgUser.ID).First(&dbUser); result.Error != nil {
					dbUser = models.User{
						TelegramID: tgUser.ID,
						Role:       models.RolePrivate,
						Rating:     5.0,
					}
					db.Create(&dbUser)
				}
				
				c.Set("tg_user", tgUser)
				c.Set("db_user", dbUser)
			}
		}

		c.Next()
	}
}
