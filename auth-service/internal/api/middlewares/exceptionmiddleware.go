package middlewares

import (
	"encoding/json"
	"log"
	"net/http"
)

func ExceptionMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			// catch the error in goroutine stack
			err := recover()
			if err == nil {
				return
			}
			// log the error
			log.Print("error occurred: ", err)

			// return the json response with the server error
			w.Header().Set("Content-Type", "application/json")
			httpCode := 500
			w.WriteHeader(httpCode)
			response := map[string]any{
				"code":    httpCode,
				"message": "Server error",
			}
			json.NewEncoder(w).Encode(response)
		}()

		next.ServeHTTP(w, r)
	})
}
