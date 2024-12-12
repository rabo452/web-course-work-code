package middlewares

import (
	"context"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"

	contextKeys "github.com/rabo452/auth/internal/config/ContextKeys"
	userRepositoryPackage "github.com/rabo452/auth/internal/db/user"
)

// set required context for every income request like database or repositories definition
func ContextInjectionMiddleware(next http.Handler, DBClient *mongo.Client,
	JWTKey string, hashKey string, serviceName string, JWTLifespan time.Duration) http.Handler {
	userRepository := userRepositoryPackage.UserRepository{DBConnection: DBClient}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), contextKeys.DBClientKey, DBClient)
		ctx = context.WithValue(ctx, contextKeys.UserRepositoryKey, userRepository)
		ctx = context.WithValue(ctx, contextKeys.ContextHashKey, hashKey)
		ctx = context.WithValue(ctx, contextKeys.ContextJWTKey, JWTKey)
		ctx = context.WithValue(ctx, contextKeys.ContextJWTLifespanKey, JWTLifespan)
		ctx = context.WithValue(ctx, contextKeys.ContextServiceNameKey, serviceName)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
