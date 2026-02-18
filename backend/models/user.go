package models

import (
	"gorm.io/gorm"
)

type Role string

const (
	RolePrivate  Role = "private"
	RoleBusiness Role = "business"
)

type User struct {
	gorm.Model
	AppleID string  `gorm:"uniqueIndex;not null" json:"apple_id"`
	Role    Role    `gorm:"not null" json:"role"`
	Rating  float64 `gorm:"not null;default:5.0" json:"rating"`
}
