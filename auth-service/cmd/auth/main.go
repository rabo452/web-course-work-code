package main

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	handlers "github.com/rabo452/auth/internal/api/handlers"
	"github.com/rabo452/auth/internal/api/middlewares"
	routers "github.com/rabo452/auth/internal/api/routers"
	configPackage "github.com/rabo452/auth/internal/config"
)

func main() {
	// load app config
	config := configPackage.LoadConfig()
	dbURI := "mongodb:27017"      // path to connect to database
	JWTKey := config.AuthJwtKey   // the key for generating JWT
	hashKey := config.HashKey     // hash key for use in crypto-functions
	serviceName := "auth-service" // service name which issues JWT
	JWTLifespan := time.Hour * 10 // how much time JWT will be active

	// initialize a database connection instance
	DBclient := configPackage.GetDBConnection(dbURI)
	// once the service is done, close the db connection
	defer DBclient.Disconnect(context.TODO())

	// create a initial router and set the most basic middlewares
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.StripSlashes)

	// set json response header
	r.Use(middlewares.JSONMiddleware)
	// set exception handler
	r.Use(middlewares.ExceptionMiddleware)
	// set the context for every request (make dependency injection)
	r.Use(func(next http.Handler) http.Handler {
		return middlewares.ContextInjectionMiddleware(next, DBclient, JWTKey, hashKey, serviceName, JWTLifespan)
	})
	// set 404 response template
	r.NotFound(handlers.NotFoundHandler)

	routers.AddAuthRouter(r)

	// run the server in the specified port
	http.ListenAndServe(":"+strconv.Itoa(config.AppPort), r)
}
