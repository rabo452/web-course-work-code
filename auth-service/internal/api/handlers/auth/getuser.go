package auth

import (
	"encoding/json"
	"net/http"
	"regexp"

	apiTools "github.com/rabo452/auth/internal/api/tools"
	contextKeys "github.com/rabo452/auth/internal/config/ContextKeys"
	userRepositoryPackage "github.com/rabo452/auth/internal/db/user"
	userService "github.com/rabo452/shared-golang/services/user"
	jwthelper "github.com/rabo452/shared-golang/tools/jwthelper"
)

func GetUserHandler(w http.ResponseWriter, r *http.Request) {
	// Extract the token from the Authorization header
	tokenString := r.Header.Get("Authorization")
	regex, _ := regexp.Compile(`Bearer (.+)`)

	match := regex.FindStringSubmatch(tokenString)
	if len(match) < 2 {
		apiTools.BadRequest(apiTools.BadRequestParams{W: w})
		return
	}
	parsedJWT := match[1]

	JWTKey := r.Context().Value(contextKeys.ContextJWTKey).(string)
	userRepository := r.Context().Value(contextKeys.UserRepositoryKey).(userRepositoryPackage.UserRepository)
	payload, err := jwthelper.GetJWTPayload(parsedJWT, JWTKey)

	if err != nil {
		apiTools.BadRequest(apiTools.BadRequestParams{W: w})
		return
	}

	// get user id from the JWT payload
	userID, ok := payload["sub"].(string)

	if !ok {
		apiTools.BadRequest(apiTools.BadRequestParams{W: w})
		return
	}

	// get user information from the db
	user, err := userService.GetUserById(userID, userRepository)
	if err != nil {
		apiTools.BadRequest(apiTools.BadRequestParams{W: w})
		return
	}

	// return the requested user's information
	json.NewEncoder(w).Encode(user)
}
