package middlewares

import (
	"context"
	"net/http"
	"regexp"

	apiTools "github.com/rabo452/api-gateway-service/internal/api/tools"
	contextKeys "github.com/rabo452/api-gateway-service/internal/config/contextkeys"
	"github.com/rabo452/shared-golang/tools/jwthelper"
)

// checks whether the valid JWT exists
// NOTE: should be before context middleware
func JWTMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Extract the token from the Authorization header
		tokenString := r.Header.Get("Authorization")
		regex, _ := regexp.Compile(`Bearer (.+)`)

		match := regex.FindStringSubmatch(tokenString)
		if len(match) < 2 {
			apiTools.UnAuthorizedResponse(w)
			return
		}
		parsedJWT := match[1]

		JWTKey := r.Context().Value(contextKeys.JWTKey).(string)

		payload, err := jwthelper.GetJWTPayload(parsedJWT, JWTKey)

		if err != nil {
			apiTools.UnAuthorizedResponse(w)
			return
		}

		// If the token is valid, add the claims to the request context
		// Check if the specific fields are in the claims
		userID, user_ok := payload["iss"].(string)    // Check if exists
		userRole, role_ok := payload["role"].(string) // Check if role exists

		if !user_ok || !role_ok {
			apiTools.UnAuthorizedResponse(w)
			return
		}

		// Add user data to the request context
		ctx := context.WithValue(r.Context(), contextKeys.UserIdKey, userID)
		ctx = context.WithValue(ctx, contextKeys.UserRoleKey, userRole)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
