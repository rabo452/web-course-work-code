import os

REDIS_PORT = int(os.environ.get('REDIS_PORT', 6379)) 
REDIS_HOST = 'redis'
DB_PORT = int(os.environ.get('DB_PORT', 27017)) 
DB_HOST = 'mongodb'
JWT_KEY = os.environ.get('JWT_KEY', 'secret-key')