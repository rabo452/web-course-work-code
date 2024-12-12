import os

import debugpy
from fastapi import FastAPI

from .admin.router import router

# if it's a debug mode, listen for the debug connections
if os.getenv('DEBUG') == 'true' and str(os.getenv('DEBUGGER_PORT')).isdigit():
    debuggerPort = int(os.getenv('DEBUGGER_PORT'))
    debugpy.listen(("0.0.0.0", debuggerPort))

app = FastAPI()

app.include_router(router, prefix='/api')