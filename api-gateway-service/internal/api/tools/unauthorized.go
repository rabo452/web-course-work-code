package tools

import (
	"encoding/json"
	"net/http"
)

func UnAuthorizedResponse(w http.ResponseWriter) {
	httpCode := 401
	w.WriteHeader(httpCode)
	w.Header().Set("Content-Type", "application/json")
	response := map[string]any{
		"code":    httpCode,
		"message": "Unauthorized",
	}
	json.NewEncoder(w).Encode(response)
}
