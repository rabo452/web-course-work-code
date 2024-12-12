package config

import (
	"os"
	"strconv"
)

// Config holds the configuration values
type Config struct {
	AppPort    int
	AuthJwtKey string
	HashKey    string
}

// LoadConfig reads environment variables and returns a Config struct
func LoadConfig() Config {
	// Load AppPort from environment variable or set default
	appPort := 80 // Default port
	parsedPort, err := strconv.Atoi(os.Getenv("APP_PORT"))
	if err == nil {
		appPort = parsedPort
	}

	authJwtKey := "my-secret-key"
	parsedAuthJwtKey := os.Getenv("AUTH_JWT_KEY")
	if parsedAuthJwtKey != "" {
		authJwtKey = parsedAuthJwtKey
	}

	hashKey := "secret hash key"
	parsedHashKey := os.Getenv("HASH_KEY")
	if parsedHashKey != "" {
		hashKey = parsedHashKey
	}

	// Return the config object with the values
	return Config{
		AppPort:    appPort,
		AuthJwtKey: authJwtKey,
		HashKey:    hashKey,
	}
}
