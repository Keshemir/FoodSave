package controllers

import (
	"foodsave/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type OfferController struct {
	DB *gorm.DB
}

func (ctrl *OfferController) CreateOffer(c *gin.Context) {
	var input struct {
		OwnerID    uint               `json:"owner_id"` // Will be ignored in favor of context
		Type       models.OfferType   `json:"type"`
		Category   string             `json:"category"`
		Title      string             `json:"title"`
		Address    string             `json:"address"`
		ImageURL   string             `json:"image_url"`
		Price      float64            `json:"price"`
		ExpiryDate string             `json:"expiry_date"` // Simplify parsing
		Latitude   float64            `json:"latitude"`
		Longitude  float64            `json:"longitude"`
		Status     models.OfferStatus `json:"status"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse ExpiryDate
	expiry, _ := time.Parse(time.RFC3339, input.ExpiryDate)
	if expiry.IsZero() {
		expiry = time.Now().Add(24 * time.Hour)
	}

	// ALWAYS USE THE AUTHENTICATED USER FROM MIDDLEWARE
	var ownerID uint
	if userObj, exists := c.Get("db_user"); exists {
		ownerID = userObj.(models.User).ID
	} else {
		// Fallback for testing if middleware is skipped, though it shouldn't be
		ownerID = input.OwnerID
	}

	offer := models.Offer{
		OwnerID:    ownerID,
		Type:       input.Type,
		Category:   input.Category,
		Title:      input.Title,
		Address:    input.Address,
		ImageURL:   input.ImageURL,
		Price:      input.Price,
		ExpiryDate: expiry,
		Latitude:   input.Latitude,
		Longitude:  input.Longitude,
		Status:     input.Status,
	}

	if result := ctrl.DB.Create(&offer); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, offer)
}

func (ctrl *OfferController) GetOffers(c *gin.Context) {
	var offers []models.Offer
	// Eager load Owner to check role
	if result := ctrl.DB.Preload("Owner").Find(&offers); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	publicOffers := []models.PublicOffer{}
	for _, offer := range offers {
		// Use the ToPublic method which applies blur based on owner role
		publicOffers = append(publicOffers, offer.ToPublic(offer.Owner.Role))
	}

	c.JSON(http.StatusOK, publicOffers)
}
