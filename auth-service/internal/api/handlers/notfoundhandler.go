package handlers

import (
	"encoding/json"
	"net/http"
)

func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
	httpCode := 404
	w.WriteHeader(httpCode)
	w.Header().Set("Content-Type", "application/json")
	response := map[string]any{
		"code":    httpCode,
		"message": "resource not found",
	}
	json.NewEncoder(w).Encode(response)
}
