"""Main Flask application with Socket.IO support."""

import os
from flask import Flask, request
from flask_socketio import SocketIO
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'undercover-secret-key-change-in-production')

# Enable CORS
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000')
if cors_origins == '*':
    CORS(app, resources={r"/*": {"origins": "*"}})
    cors_allowed = "*"
else:
    CORS(app, resources={r"/*": {"origins": cors_origins.split(',')}})
    cors_allowed = cors_origins.split(',')

# Initialize Socket.IO
socketio = SocketIO(
    app,
    cors_allowed_origins=cors_allowed,
    async_mode='eventlet',
    logger=True,
    engineio_logger=True
)

# Register socket event handlers
from socket_handlers import register_socket_handlers
register_socket_handlers(socketio)


@app.route('/')
def index():
    """Health check endpoint."""
    return {
        'status': 'ok',
        'message': 'Undercover game server is running'
    }


@app.route('/health')
def health():
    """Health check for monitoring."""
    return {'status': 'healthy'}, 200


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f"🚀 Server starting on port {port}")
    print(f"📡 Socket.IO ready for connections")
    
    socketio.run(
        app,
        host='0.0.0.0',
        port=port,
        debug=os.getenv('FLASK_ENV') == 'development'
    )
