package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"foodsave/controllers"
	"foodsave/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	dsn := "host=localhost user=vapor_username password=vapor_password dbname=vapor_database port=5432 sslmode=disable TimeZone=Asia/Almaty"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto Migrate (including Message)
	err = db.AutoMigrate(&models.User{}, &models.Offer{}, &models.Message{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Initialize Controllers
	userCtrl := &controllers.UserController{DB: db}
	offerCtrl := &controllers.OfferController{DB: db}
	chatCtrl := &controllers.ChatController{DB: db}

	// Setup Router
	r := gin.Default()

	// CORS Config
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
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
