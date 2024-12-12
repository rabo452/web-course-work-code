package middlewares

import (
	"context"
	"net/http"
	"time"

	contextKeys "github.com/rabo452/api-gateway-service/internal/config/contextkeys"
)

// add context variables to each request
func ContextMiddleware(next http.Handler, JWTKey string, timeLimit time.Duration) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), contextKeys.JWTKey, JWTKey)
		ctx = context.WithValue(ctx, contextKeys.TimeLimitKey, timeLimit)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
