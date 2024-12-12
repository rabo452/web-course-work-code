package auth

import (
	"encoding/json"
	"log"
	"net/http"
	"net/mail"
	"time"
	"unicode/utf8"

	apiTools "github.com/rabo452/auth/internal/api/tools"
	contextKeys "github.com/rabo452/auth/internal/config/ContextKeys"
	userRepositoryPackage "github.com/rabo452/auth/internal/db/user"
	userService "github.com/rabo452/shared-golang/services/user"
	hashhelper "github.com/rabo452/shared-golang/tools/hashhelper"
	jwthelper "github.com/rabo452/shared-golang/tools/jwthelper"
)

func SigninHandler(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		apiTools.BadRequest(apiTools.BadRequestParams{W: w})
		return
	}

	// get passed parameters
	email := r.FormValue("email")
	username := r.FormValue("username")
	password := r.FormValue("password")

	usernameLength := utf8.RuneCountInString(username)
	passwordLength := utf8.RuneCountInString(password)
	_, err := mail.ParseAddress(email)

	// check whether the passed parameters is valid
	if usernameLength < 8 || usernameLength > 255 || passwordLength < 8 || passwordLength > 255 || err != nil {
		apiTools.BadRequest(apiTools.BadRequestParams{W: w})
		return
	}

	userRepository := r.Context().Value(contextKeys.UserRepositoryKey).(userRepositoryPackage.UserRepository)
	hashKey := r.Context().Value(contextKeys.ContextHashKey).(string)
	JWTKey := r.Context().Value(contextKeys.ContextJWTKey).(string)
	issuerService := r.Context().Value(contextKeys.ContextServiceNameKey).(string)
	JWTLifespan := r.Context().Value(contextKeys.ContextJWTLifespanKey).(time.Duration)

	filterProps := map[string]any{
		"email": email,
	}
	doesUserExist, err := userService.DoesUserExist(filterProps, userRepository)

	if err != nil {
		log.Println("ERROR: critical error occurred on DoesUserExist: " + err.Error())
		apiTools.BadRequest(apiTools.BadRequestParams{W: w})
		return
	}

	if doesUserExist {
		apiTools.BadRequest(apiTools.BadRequestParams{W: w, Message: "user with " + email + " email already exists"})
		return
	}

	password = hashhelper.GenerateHash(password, hashKey)
	defaultRole := "viewer"

	userStruct, err := userService.CreateNewUser(email, username, password, defaultRole, userRepository)

	if err != nil {
		log.Println("ERROR: critical error occurred when tried to insert a new user:s " + err.Error())
		apiTools.BadRequest(apiTools.BadRequestParams{W: w})
		return
	}

	JWTIssueDate := time.Now()
	JWTExpiredDate := time.Now().Add(JWTLifespan)
	payload := map[string]any{
		"role": defaultRole,
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
		"id":  userStruct.Id,
	}

	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(responseObj); err != nil {
		panic(err)
	}
}
