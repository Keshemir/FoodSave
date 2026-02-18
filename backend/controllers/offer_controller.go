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
		OwnerID    uint               `json:"owner_id"`
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

	offer := models.Offer{
		OwnerID:    input.OwnerID,
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

	// Fetch owner to know role for response (optional) or just return what we have
	// For API consistency let's return PublicOffer
	// We need to fetch the owner to know the role for ToPublic, or just default to raw for the creator.
	// Let's assume creator sees raw.
	// But to simplify, we will just return the created object.

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
