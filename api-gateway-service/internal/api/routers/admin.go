package routers

import (
	"net/http"
	"net/http/httputil"

	"github.com/go-chi/chi/v5"
	customMiddleware "github.com/rabo452/api-gateway-service/internal/api/middlewares"
)

func AdminRouter(r chi.Router, proxy *httputil.ReverseProxy) {
	allowedRoles := []string{"admin"}

	r.Use(customMiddleware.JWTMiddleware)
	r.Use(func(next http.Handler) http.Handler {
		return customMiddleware.RoleMiddleware(next, allowedRoles)
	})

	// Define routes
	r.Handle("/*", http.StripPrefix("/admin", http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		proxy.ServeHTTP(w, req)
	})))
}
