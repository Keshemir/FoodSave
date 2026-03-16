package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"foodsave/controllers"
	"foodsave/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		// Fallback for local development without Docker
		dsn = "host=localhost user=vapor_username password=vapor_password dbname=vapor_database port=5432 sslmode=disable TimeZone=Asia/Almaty"
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto Migrate (including Message)
	err = db.AutoMigrate(&models.User{}, &models.Offer{}, &models.Message{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Seed default user (id=1) for development
	var defaultUser models.User
	if result := db.First(&defaultUser, 1); result.Error != nil {
		seedUser := models.User{
			AppleID: "dev-user-001",
			Role:    models.RoleBusiness,
			Rating:  5.0,
		}
		if err := db.Create(&seedUser).Error; err != nil {
			log.Println("Warning: could not seed default user:", err)
		} else {
			log.Println("Seeded default user with id:", seedUser.ID)
		}
	}

	// Initialize Controllers
	userCtrl := &controllers.UserController{DB: db}
	offerCtrl := &controllers.OfferController{DB: db}
	chatCtrl := &controllers.ChatController{DB: db}

	// Setup Router
	r := gin.Default()

	// CORS Config
	allowedOrigin := os.Getenv("ALLOWED_ORIGINS")
	r.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			// Если задан конкретный ALLOWED_ORIGINS — проверяем его, иначе разрешаем всё
			if allowedOrigin != "" {
				return origin == allowedOrigin || origin == "http://localhost:3000"
			}
			return true
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Routes
	r.POST("/users", userCtrl.CreateUser)
	r.POST("/offers", offerCtrl.CreateOffer)
	r.GET("/offers", offerCtrl.GetOffers)

	// Chat
	r.GET("/ws/chat", chatCtrl.ChatWebSocket)
	r.GET("/messages", chatCtrl.GetMessages)

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	fmt.Println("Server running on port 8080")
	r.Run(":8080")
}
