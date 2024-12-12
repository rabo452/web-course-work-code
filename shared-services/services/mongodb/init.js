db = db.getSiblingDB("movie_db"); 

// Create initial collections
db.createCollection("user");
db.createCollection("movie");
db.createCollection('user_liked_movie')