package controllers

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"sync"

	"foodsave/models"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type ChatController struct {
	DB *gorm.DB
}

type wsClient struct {
	conn   *websocket.Conn
	userID string
}

var (
	chatClients = make(map[string]*wsClient)
	chatMu      sync.Mutex
)

// GET /ws/chat?user_id=1&peer_id=2
func (cc *ChatController) ChatWebSocket(c *gin.Context) {
	userID := c.Query("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id required"})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}
	defer conn.Close()

	cl := &wsClient{conn: conn, userID: userID}
	chatMu.Lock()
	chatClients[userID] = cl
	chatMu.Unlock()

	defer func() {
		chatMu.Lock()
		delete(chatClients, userID)
		chatMu.Unlock()
	}()

	for {
		var msg map[string]interface{}
		if err := conn.ReadJSON(&msg); err != nil {
			break
		}

		senderID, _ := strconv.ParseUint(userID, 10, 64)
		receiverIDFloat, _ := msg["receiver_id"].(float64)
		receiverID := uint(receiverIDFloat)
		content, _ := msg["content"].(string)

		// Save to database
		dbMsg := models.Message{
			SenderID:   uint(senderID),
			ReceiverID: receiverID,
			Content:    content,
		}
		cc.DB.Create(&dbMsg)

		// Add created_at for frontend
		msg["id"] = dbMsg.ID
		msg["created_at"] = dbMsg.CreatedAt

		// Forward to receiver if online
		receiverKey := fmt.Sprintf("%.0f", receiverIDFloat)
		chatMu.Lock()
		recv, exists := chatClients[receiverKey]
		chatMu.Unlock()
		if exists {
			recv.conn.WriteJSON(msg)
		}
	}
}

// GET /messages?user_id=1&peer_id=2
func (cc *ChatController) GetMessages(c *gin.Context) {
	userIDStr := c.Query("user_id")
	peerIDStr := c.Query("peer_id")

	userID, _ := strconv.ParseUint(userIDStr, 10, 64)
	peerID, _ := strconv.ParseUint(peerIDStr, 10, 64)

	var messages []models.Message
	cc.DB.Where(
		"(sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)",
		userID, peerID, peerID, userID,
	).Order("created_at asc").Find(&messages)

	c.JSON(http.StatusOK, messages)
}
