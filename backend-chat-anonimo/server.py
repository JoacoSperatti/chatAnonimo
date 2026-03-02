from flask import Flask
from flask_socketio import SocketIO, join_room, leave_room, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('connect')
def handle_connect():
    print("Se Conectó un nuevo usuario!")

@socketio.on('connect_channel')
def on_join(data):
    room_code = data['code']
    join_room(room_code)
    print(f"Usuario se unió al canal: {room_code}")

@socketio.on('send_message')
def handle_message(data):
    room_code = data['code']

    emit('new_message', data, to=room_code)

@socketio.on('mark_seen')
def handle_seen(data):
    room_code = data['code']

    emit('message_seen', {'msg_id': data['msg_id']}, to=room_code)

@socketio.on('leave_channel')
def on_leave(data):
    room_code = data['code']
    leave_room(room_code)
    print(f"Usuario salió del canal: {room_code}")

if __name__ == '__main__':
    print("iniciando servidor en http://localhost:5000")
    socketio.run(app, debug=True, port=5000)