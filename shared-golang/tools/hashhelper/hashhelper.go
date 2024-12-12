package hashhelper

import (
	"crypto/sha256"
	"encoding/hex"
)

// generateHash generates a SHA-256 hash from the input text and cryptKey.
func GenerateHash(text string, cryptKey string) string {
	data := text + cryptKey
	hash := sha256.New()
	hash.Write([]byte(data))
	hashSum := hash.Sum(nil)
	hashString := hex.EncodeToString(hashSum)
	return hashString
}
