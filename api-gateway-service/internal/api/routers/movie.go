package routers

import (
	"net/http"
	"net/http/httputil"

	"github.com/go-chi/chi/v5"
)

func MovieRouter(r chi.Router, proxy *httputil.ReverseProxy) {
	r.Handle("/*", http.StripPrefix("/movie", http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		proxy.ServeHTTP(w, req)
	})))
}
