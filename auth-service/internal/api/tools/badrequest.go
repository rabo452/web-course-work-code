package tools

import (
	"encoding/json"
	"net/http"
)

type BadRequestParams struct {
	W       http.ResponseWriter
	Message string
}

func BadRequest(params BadRequestParams) {
	w := params.W
	message := params.Message

	if message == "" {
		message = "Bad request"
	}

	httpCode := 400
	w.WriteHeader(httpCode)
	w.Header().Set("Content-Type", "application/json")
	response := map[string]any{
		"code":    httpCode,
		"message": message,
	}
	json.NewEncoder(w).Encode(response)
}
