package jwthelper

import (
	"strconv"
	"testing"
	"time"
)

var signKey = "secret-key"
var issuerService = "my-service"
var payload = map[string]any{
	"role": "admin",
}
var userId = 1

// positive case
func TestValidateJWT(t *testing.T) {
	issuedAt := time.Now()
	expiredAt := issuedAt.Add(time.Hour * 1)

	JWT, _ := GenerateJWT(signKey, issuerService, issuedAt, expiredAt, strconv.Itoa(userId), payload)

	isValidJWT := IsJWTValid(signKey, JWT)

	if !isValidJWT {
		t.Error("JWT should be valid")
	}

	JWT += "some-unknown-value"
}

// fail case
func TestValidateJWTFailure(t *testing.T) {
	JWT := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzM2Nzk0MjcsImlhdCI6MTczMzU5MzAyNywiaXNzIjoibXktc2VydmljZSIsInJvbGUiOiJhZG1pbiIsInN1YiI6MX0.JZDqNtkOHmMkzWZDA6nHD50TrY1e0SXVzE0aarFUucw"
	JWT += "some additional value"

	isValidJWT := IsJWTValid(signKey, JWT)

	if isValidJWT {
		t.Error("JWT should be invalid, but it doesn't")
	}
}

// test whether the payload is correctly taken
func TestGetJWTPayload(t *testing.T) {
	issuedAt := time.Now()
	expiredAt := issuedAt.Add(time.Hour * 1)

	JWT, err := GenerateJWT(signKey, issuerService, issuedAt, expiredAt, strconv.Itoa(userId), payload)
	parsedPayload, err := GetJWTPayload(JWT, signKey)

	if err != nil {
		t.Errorf("Cannot fetch JWT payload due to error: %s", err.Error())
	}

	if sub, ok := parsedPayload["sub"].(int); (ok && int(sub) != userId) || parsedPayload["iss"] != issuerService || parsedPayload["exp"] == nil || parsedPayload["iat"] == nil {
		t.Errorf("The values of the JWT is modified/absent/violated, the parsed payload: %v", parsedPayload)
	}

	for key, val := range payload {
		if parsedPayload[key] != val {
			t.Errorf("The values of the JWT is modified/absent/violated, the parsed payload: %v", parsedPayload)
		}
	}
}

// check whether the jwt payload persists
func TestJWTPayload(t *testing.T) {
	userId := "some-user-id-hash"

	issuerService := "my-service"
	issuedAt := time.Now()
	expiredAt := issuedAt.Add(time.Hour * 1)

	_, err := GenerateJWT(signKey, issuerService, issuedAt, expiredAt, userId, payload)

	if err != nil {
		t.Errorf("unable to create JWT due to error: %s", err.Error())
	}
}

// check whether the expired JWT is handled correct
func TestJWTExpiredJWT(t *testing.T) {
	userId := "some-user-id-hash"
	payload := map[string]any{
		"role": "admin",
	}

	issuerService := "my-service"
	issuedAt := time.Now()
	expiredAt := issuedAt.Add(time.Second)
	generatedJWT, err := GenerateJWT(signKey, issuerService, issuedAt, expiredAt, userId, payload)

	if err != nil {
		t.Errorf("unable to create JWT due to error: %s", err.Error())
	}

	time.Sleep(time.Second * 2)

	// after 1 second check whether the JWT expired
	payload, err = GetJWTPayload(generatedJWT, signKey)
	if err == nil || len(payload) > 0 {
		t.Errorf("JWT token should be expired")
	}
}
