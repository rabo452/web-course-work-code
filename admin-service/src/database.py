from redis import Redis
import pymongo

from src.config import REDIS_HOST, REDIS_PORT, DB_HOST, DB_PORT

redisClient: Redis = Redis(host=REDIS_HOST, port=REDIS_PORT)
dbClient: pymongo.MongoClient = pymongo.MongoClient(f"mongodb://{DB_HOST}:{DB_PORT}")
db = dbClient["movie_db"]