package jwthelper

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

// generates signed JWT string for the specified user
func GenerateJWT(
	JWT_SIGN_KEY string, issuerService string,
	issuedAt time.Time, expiredAt time.Time,
	userId string, payload map[string]any) (string, error) {
	// define default claims
	claims := jwt.MapClaims{
		"sub": userId,
		"iat": issuedAt.Unix(),
		"exp": expiredAt.Unix(),
		"iss": issuerService,
	}

	// adding additional keys into the JWT payload
	for key, val := range payload {
		claims[key] = val
	}

	// Create the token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with the secret key
	signedToken, err := token.SignedString([]byte(JWT_SIGN_KEY))
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

// GetJWTPayload extracts the payload from the JWT token and returns it as a hash map structur
func GetJWTPayload(passedJWT string, JWT_SIGN_KEY string) (map[string]any, error) {
	// Parse the JWT token and verify its signature
	token, err := jwt.Parse(passedJWT, func(token *jwt.Token) (interface{}, error) {
		// Ensure the signing method is HMAC (HS256)
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		// Return the key used to sign the token
		return []byte(JWT_SIGN_KEY), nil
	})

	// Check for errors in parsing or invalid token
	if err != nil || !token.Valid {
		return nil, errors.New("invalid token")
	}

	// Extract the claims as a map[string]any
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("failed to parse claims from the JWT: " + passedJWT)
	}

	// Return the claims as a map
	return claims, nil
}

// check whether JWT is valid (signed by the same key)
func IsJWTValid(JWT_SIGN_KEY string, passedJWT string) bool {
	_, err := jwt.Parse(passedJWT, func(token *jwt.Token) (interface{}, error) {
		// Ensure the signing method is HMAC (same as used to sign)
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unknown signing method")
		}
		return []byte(JWT_SIGN_KEY), nil
	})

	// if the jwt is invalid, then err != null
	return err == nil
}
