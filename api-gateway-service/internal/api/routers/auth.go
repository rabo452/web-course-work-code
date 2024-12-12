package routers

import (
	"net/http"
	"net/http/httputil"

	"github.com/go-chi/chi/v5"
)

func AuthRouter(r chi.Router, proxy *httputil.ReverseProxy) {
	r.Handle("/*", http.StripPrefix("/auth", http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		proxy.ServeHTTP(w, req)
	})))
}
