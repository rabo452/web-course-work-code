package auth

import (
	"encoding/json"
	"net/http"
	"time"
	"unicode/utf8"

	apiTools "github.com/rabo452/auth/internal/api/tools"
	contextKeys "github.com/rabo452/auth/internal/config/ContextKeys"
	userRepositoryPackage "github.com/rabo452/auth/internal/db/user"
	userService "github.com/rabo452/shared-golang/services/user"
	hashhelper "github.com/rabo452/shared-golang/tools/hashhelper"
	jwthelper "github.com/rabo452/shared-golang/tools/jwthelper"
)

func Login(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		apiTools.BadRequest(apiTools.BadRequestParams{W: w})
		return
	}

	// get passed parameters
	username := r.FormValue("username")
	password := r.FormValue("password")

	usernameLength := utf8.RuneCountInString(username)
	passwordLength := utf8.RuneCountInString(password)

	// check whether the passed parameters is valid
	if usernameLength < 8 || usernameLength > 255 || passwordLength < 8 || passwordLength > 255 {
		apiTools.BadRequest(apiTools.BadRequestParams{W: w})
		return
	}

	hashKey := r.Context().Value(contextKeys.ContextHashKey).(string)
	userRepository := r.Context().Value(contextKeys.UserRepositoryKey).(userRepositoryPackage.UserRepository)
	JWTKey := r.Context().Value(contextKeys.ContextJWTKey).(string)
	issuerService := r.Context().Value(contextKeys.ContextServiceNameKey).(string)
	JWTLifespan := r.Context().Value(contextKeys.ContextJWTLifespanKey).(time.Duration)

	password = hashhelper.GenerateHash(password, hashKey)

	filterProps := map[string]any{
		"username": username,
		"password": password,
	}
	userStruct, err := userService.GetUser(filterProps, userRepository)

	if err != nil {
		apiTools.BadRequest(apiTools.BadRequestParams{W: w, Message: "invalid credentials"})
		return
	}

	JWTIssueDate := time.Now()
	JWTExpiredDate := time.Now().Add(JWTLifespan)
	payload := map[string]any{
		"role": userStruct.Role,
	}

	createdJWT, err := jwthelper.GenerateJWT(
		JWTKey, issuerService,
		JWTIssueDate, JWTExpiredDate,
		userStruct.Id, payload,
	)

	if err != nil {
		panic(err)
	}

	responseObj := map[string]any{
		"JWT": createdJWT,
	}

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(responseObj); err != nil {
		panic(err)
	}
}
