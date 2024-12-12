package routers

import (
	"github.com/go-chi/chi/v5"

	authHandlers "github.com/rabo452/auth/internal/api/handlers/auth"
)

func AddAuthRouter(r *chi.Mux) {
	r.Post("/sign-in", authHandlers.SigninHandler)
	r.Post("/login", authHandlers.Login)
	r.Get("/get-user", authHandlers.GetUserHandler)
}
