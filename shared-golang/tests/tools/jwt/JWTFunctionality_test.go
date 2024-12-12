package jwttest

import (
	"testing"
	"time"

	jwt "github.com/rabo452/shared-golang/tools/jwthelper"
)

// test overall JWT package functionality
func TestJWTFunctionality(t *testing.T) {
	userId := "some-user-id-hash"
	payload := map[string]any{
		"role": "admin",
	}
	signKey := "secret-key"
	issuerService := "my-service"
	issuedAt := time.Now()
	expiredAt := issuedAt.Add(time.Minute * 10)

	token, err := jwt.GenerateJWT(signKey, issuerService, issuedAt, expiredAt, userId, payload)

	if err != nil {
		t.Errorf("unable to create JWT due to error: %s", err.Error())
	}

	isTokenValid := jwt.IsJWTValid(signKey, token)

	if !isTokenValid {
		t.Errorf("token should be valid but it is not valid")
	}

	parsedPayload, err := jwt.GetJWTPayload(token, signKey)

	if err != nil {
		t.Errorf("unable to parse JWT token (%s) payload due to error: %s", token, err.Error())
	}

	if parsedPayload["sub"] != userId {
		t.Errorf("JWT user id (sub field) %s != %s", parsedPayload["sub"], userId)
	}

	for key, val := range payload {
		if val != parsedPayload[key] {
			t.Errorf("JWT payload attribute is incorrect, %v should be equal to %v", parsedPayload[key], val)
		}
	}
}
