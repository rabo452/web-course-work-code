package config

import (
	"os"
	"strconv"
	"time"
)

// Config holds the configuration values
type Config struct {
	AppPort                int
	Timeout                time.Duration
	RequestsPerSecondLimit int
	AuthJwtKey             string
}

// LoadConfig reads environment variables and returns a Config struct
func LoadConfig() Config {
	// Load AppPort from environment variable or set default
	appPort := 8000 // Default port
	parsedPort, err := strconv.Atoi(os.Getenv("APP_PORT"))
	if err == nil {
		appPort = parsedPort
	}

	// Load Timeout from environment variable or set default
	timeout := 3 // Default timeout (in seconds)
	parsedTimeout, err := strconv.Atoi(os.Getenv("APP_TIMEOUT"))
	if err == nil {
		timeout = parsedTimeout
	}

	requestPerSecond := 10
	parsedRequestPerSecond, err := strconv.Atoi(os.Getenv("REQUESTS_PER_SECOND_LIMIT"))
	if err == nil {
		requestPerSecond = parsedRequestPerSecond
	}

	authJwtKey := "my-secret-key"
	parsedAuthJwtKey := os.Getenv("AUTH_JWT_KEY")
	if parsedAuthJwtKey != "" {
		authJwtKey = parsedAuthJwtKey
	}

	// Return the config object with the values
	return Config{
		AppPort:                appPort,
		Timeout:                time.Duration(timeout) * time.Second,
		RequestsPerSecondLimit: requestPerSecond,
		AuthJwtKey:             authJwtKey,
	}
}
