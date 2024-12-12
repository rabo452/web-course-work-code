package user

import (
	userDomain "github.com/rabo452/shared-golang/domain/user"
)

// creates a new user
func CreateNewUser(
	email string, username string,
	password string, role string,
	repository interface {
		CreateNewUser(email string, username string, password string, role string) (string, error)
	}) (userDomain.User, error) {
	userId, err := repository.CreateNewUser(email, username, password, role)

	if err != nil {
		return userDomain.User{}, err
	}

	return userDomain.User{
		Id:       userId,
		Username: username,
		Email:    email,
		Password: password,
		Role:     role,
	}, err
}

// checks whether a user exists by filter properties
func DoesUserExist(properties map[string]any, repository interface {
	DoesUserExist(properties map[string]any) (bool, error)
}) (bool, error) {
	return repository.DoesUserExist(properties)
}

func GetUser(properties map[string]any, repository interface {
	GetUser(properties map[string]any) (userDomain.User, error)
}) (userDomain.User, error) {
	return repository.GetUser(properties)
}

func GetUserById(userId string, repository interface {
	GetUserById(userId string) (userDomain.User, error)
}) (userDomain.User, error) {
	return repository.GetUserById(userId)
}
