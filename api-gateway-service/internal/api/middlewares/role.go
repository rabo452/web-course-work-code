package middlewares

import (
	"net/http"

	apiTools "github.com/rabo452/api-gateway-service/internal/api/tools"
	contextKeys "github.com/rabo452/api-gateway-service/internal/config/contextkeys"
)

// determines whether the user can access to specific resource determined by their roles
// NOTE: should go after the JWT middleware as it takes user role
func RoleMiddleware(next http.Handler, roles []string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userRole := r.Context().Value(contextKeys.UserRoleKey).(string)
		isAllowed := false

		// check if the role matches with allowed roles for the resource
		for _, role := range roles {
			if userRole == role {
				isAllowed = true
			}
		}

		if !isAllowed {
			apiTools.Forbidden(w)
			return
		}

		// If the role matches, call the next handler
		next.ServeHTTP(w, r)
	})
}
