package tools

import (
	"encoding/json"
	"net/http"
)

func Forbidden(w http.ResponseWriter) {
	httpCode := 403
	w.WriteHeader(httpCode)
	w.Header().Set("Content-Type", "application/json")
	response := map[string]any{
		"code":    httpCode,
		"message": "restricted to resource",
	}
	json.NewEncoder(w).Encode(response)
}
