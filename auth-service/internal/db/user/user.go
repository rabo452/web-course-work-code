package user

import (
	"context"
	"errors"
	"fmt"
	"time"

	userDomain "github.com/rabo452/shared-golang/domain/user"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

var dbName = "movie_db"
var userCollectionName = "user"

type UserRepository struct {
	DBConnection *mongo.Client
}

// creates new user in the db and returns their id
func (u UserRepository) CreateNewUser(email string, username string, password string, role string) (string, error) {
	client := u.DBConnection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Create the user document
	userDocument := bson.D{
		{Key: "email", Value: email},
		{Key: "username", Value: username},
		{Key: "password", Value: password},
		{Key: "role", Value: role},
	}

	collection := client.Database(dbName).Collection(userCollectionName)

	// Insert the document into the collection
	res, err := collection.InsertOne(ctx, userDocument)
	if err != nil {
		return "", err
	}

	obj := res.InsertedID.(bson.ObjectID)
	return obj.Hex(), nil
}

// get whether a user exists by specified properties
func (u UserRepository) DoesUserExist(properties map[string]any) (bool, error) {
	client := u.DBConnection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Build the filter from the properties map
	filter := bson.M{}
	for key, val := range properties {
		filter[key] = val
	}

	collection := client.Database(dbName).Collection(userCollectionName)

	// Check if the user exists by attempting to find a matching document
	err := collection.FindOne(ctx, filter).Err()

	if err != nil {
		if err == mongo.ErrNoDocuments {
			// No user found with the given email
			return false, nil
		}
		// An error occurred while querying the database
		return false, err
	}

	// User exists
	return true, nil
}

func (u UserRepository) GetUser(properties map[string]any) (userDomain.User, error) {
	client := u.DBConnection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Build the filter from the properties map
	filter := bson.M{}
	for key, val := range properties {
		filter[key] = val
	}

	collection := client.Database(dbName).Collection(userCollectionName)

	// Find a document matching the filter
	var result bson.M
	err := collection.FindOne(ctx, filter).Decode(&result)
	// user is not found
	if err != nil {
		return userDomain.User{}, err
	}

	// Return the ID as a string
	return userDomain.User{
		Id:       result["_id"].(bson.ObjectID).Hex(),
		Username: result["username"].(string),
		Email:    result["email"].(string),
		Password: result["password"].(string),
		Role:     result["role"].(string),
	}, nil
}

func (u UserRepository) GetUserById(userId string) (userDomain.User, error) {
	client := u.DBConnection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := client.Database(dbName).Collection(userCollectionName)

	// Convert the string userId to ObjectID
	ObjectID, err := bson.ObjectIDFromHex(userId)
	if err != nil {
		return userDomain.User{}, errors.New("passed invalid userId: " + userId)
	}
	// Find the document
	var result bson.M
	err = collection.FindOne(ctx, bson.M{
		"_id": ObjectID,
	}).Decode(&result)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return userDomain.User{}, errors.New("no user found with the specified ID: " + userId)
		}
		return userDomain.User{}, fmt.Errorf("error finding user: %v", err)
	}

	// Extract fields with type assertions
	username, _ := result["username"].(string)
	email, _ := result["email"].(string)
	password, _ := result["password"].(string)
	role, _ := result["role"].(string)

	// Return the user
	return userDomain.User{
		Id:       userId,
		Username: username,
		Email:    email,
		Password: password,
		Role:     role,
	}, nil
}
