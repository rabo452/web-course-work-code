package main

import (
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/httprate"

	customMiddleware "github.com/rabo452/api-gateway-service/internal/api/middlewares"
	routers "github.com/rabo452/api-gateway-service/internal/api/routers"
	configPackage "github.com/rabo452/api-gateway-service/internal/config"
	tools "github.com/rabo452/api-gateway-service/internal/tools"
)

func main() {
	// load app config
	config := configPackage.LoadConfig()
	timeout := config.Timeout
	JWTKey := config.AuthJwtKey

	// create an initial router and set the most basic middlewares
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.StripSlashes)
	r.Use(middleware.Timeout(config.Timeout))
	r.Use(httprate.LimitByIP(config.RequestsPerSecondLimit, time.Second))

	// CORS setup
	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:3001"}, // Allow only the origin making the request
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},        // Allow specific HTTP methods
		AllowedHeaders:   []string{"Content-Type", "Authorization"},                  // Allow specific headers
		AllowCredentials: true,                                                       // Allow cookies or other credentials
		MaxAge:           300,                                                        // Cache the preflight response for 5 minutes
	})
	r.Use(corsMiddleware.Handler)

	// set context variables for every incoming request
	r.Use(func(next http.Handler) http.Handler {
		return customMiddleware.ContextMiddleware(next, JWTKey, timeout)
	})

	// add reverse proxy to the internal services
	r.Route("/auth", func(r chi.Router) {
		routers.AuthRouter(r, tools.CreateReverseProxy("http://auth-service/", timeout))
	})
	r.Route("/admin", func(r chi.Router) {
		routers.AdminRouter(r, tools.CreateReverseProxy("http://admin-service/", timeout))
	})
	r.Route("/movie", func(r chi.Router) {
		routers.MovieRouter(r, tools.CreateReverseProxy("http://movie-search-service/", timeout))
	})

	// run the server in the specified port
	http.ListenAndServe(":"+strconv.Itoa(config.AppPort), r)
}
