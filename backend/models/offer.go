package models

import (
	"math/rand"
	"time"

	"gorm.io/gorm"
)

type OfferType string

const (
	OfferTypeSale OfferType = "sale"
	OfferTypeFree OfferType = "free"
)

type OfferStatus string

const (
	OfferStatusActive OfferStatus = "active"
	OfferStatusBooked OfferStatus = "booked"
	OfferStatusClosed OfferStatus = "closed"
)

type Offer struct {
	gorm.Model
	OwnerID    uint        `json:"owner_id"`
	Owner      User        `gorm:"foreignKey:OwnerID" json:"-"`
	Type       OfferType   `gorm:"not null" json:"type"`
	Category   string      `json:"category"` // bakery, hot, cold
	Title      string      `gorm:"not null" json:"title"`
	Address    string      `json:"address"`
	ImageURL   string      `json:"image_url"`
	Price      float64     `gorm:"not null" json:"price"`
	ExpiryDate time.Time   `gorm:"not null" json:"expiry_date"`
	Latitude   float64     `gorm:"not null" json:"latitude"`
	Longitude  float64     `gorm:"not null" json:"longitude"`
	Status     OfferStatus `gorm:"not null;default:'active'" json:"status"`
}

// PublicOffer is the DTO for API responses
type PublicOffer struct {
	ID         uint        `json:"id"`
	OwnerID    uint        `json:"owner_id"`
	Type       OfferType   `json:"type"`
	Category   string      `json:"category"`
	Title      string      `json:"title"`
	Address    string      `json:"address"`
	ImageURL   string      `json:"image_url"`
	Price      float64     `json:"price"`
	ExpiryDate time.Time   `json:"expiry_date"`
	Latitude   float64     `json:"latitude"`
	Longitude  float64     `json:"longitude"`
	Status     OfferStatus `json:"status"`
}

// ToPublic converts an Offer to PublicOffer, applying Privacy Blur if needed
func (o *Offer) ToPublic(ownerRole Role) PublicOffer {
	lat := o.Latitude
	lon := o.Longitude

	if ownerRole == RolePrivate {
		// Privacy Blur: Random shift 200-500m
		// 1 degree lat ~ 111km
		// 500m ~ 0.0045 degrees

		// Simple random fuzzing for MVP
		// Valid range 0.002 - 0.005 approx
		shiftLat := (rand.Float64()*0.003 + 0.002) * (1.0 - 2.0*float64(rand.Intn(2))) // +/-
		shiftLon := (rand.Float64()*0.003 + 0.002) * (1.0 - 2.0*float64(rand.Intn(2))) // +/-

		lat += shiftLat
		lon += shiftLon
	}

	return PublicOffer{
		ID:         o.ID,
		OwnerID:    o.OwnerID,
		Type:       o.Type,
		Category:   o.Category,
		Title:      o.Title,
		Address:    o.Address,
		ImageURL:   o.ImageURL,
		Price:      o.Price,
		ExpiryDate: o.ExpiryDate,
		Latitude:   lat,
		Longitude:  lon,
		Status:     o.Status,
	}
}
