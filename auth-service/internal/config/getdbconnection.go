package config

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// GetDBConnection establishes MongoDB connection
func GetDBConnection(serverURI string) *mongo.Client {
	// Configure client options
	clientOptions := options.Client().ApplyURI("mongodb://" + serverURI)

	// Establish a new connection
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(clientOptions)
	if err != nil {
		panic(err)
	}

	// Verify connection
	if err = client.Ping(ctx, nil); err != nil {
		panic(err)
	}

	return client
}
