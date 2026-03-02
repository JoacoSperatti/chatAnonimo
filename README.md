# 💬 Anonymous Real-Time Chat 

A lightweight, anonymous chat application built to demonstrate real-time, bidirectional communication using WebSockets. Users can join private rooms using a 6-digit code without the need for an account, registration, or persistent data storage.

## ✨ Features

- **Anonymous Access:** No sign-up or login required. Your identity is ephemeral and tied to your current session ID.
- **Private Channels:** Messaging is strictly isolated within specific 6-digit room codes.
- **Real-Time Communication:** Instant message delivery powered by Socket.IO.
- **Read Receipts:** Visual feedback for sent messages (displays "Sent" vs. "Seen").
- **Responsive Interface:** Clean and simple UI that works across different screen sizes.
- **Room Management:** Ability to join and leave channels dynamically with a "Return to Home" feature.

## 🚀 Tech Stack

### Frontend
- **React + Vite:** For a fast, modern, and reactive User Interface.
- **Socket.io-client:** To establish and maintain the WebSocket connection with the backend.

### Backend
- **Python:** Core server-side logic and event handling.
- **Flask:** A minimalist web framework for Python.
- **Flask-SocketIO:** Manages WebSocket events, room broadcasting, and client socket IDs.

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- **Python 3.x** installed.
- **Node.js** and **npm** installed.

### 2. Backend Setup
Navigate to your backend directory and run:
```bash
# Create a virtual environment
python -m venv venv

# Activate it (Linux/Arch)
source venv/bin/activate

# Install dependencies
pip install Flask Flask-SocketIO

# Start the server
python server.py

### 3. Frontend Setup

Navigate to your frontend directory and run:

```bash
# Install all necessary dependencies (React, Vite, etc.)
npm install

# Install the Socket.IO client library specifically
npm install socket.io-client

# Start the development server
npm run dev

---

## 🧠 How It Works (Architecture)

1. **Connection**: When the React app mounts, it establishes a persistent connection to the Flask server at `http://localhost:5000`.
2. **Room Logic**: The server utilizes the `join_room()` function. This creates a virtual "room" based on the 6-digit code, ensuring messages don't leak to other active channels.
3. **Event Flow**:
   - **`connect_channel`**: The client sends the room code; the server joins the socket to that specific room.
   - **`send_message`**: The client emits an object containing the text, a unique `msg_id`, and their `sender_id`. The server broadcasts this to everyone in the room.
   - **`mark_seen`**: When a user receives a message that isn't their own, their client emits a `mark_seen` event. The server relays this to the room, and the original sender's UI updates the checkmarks to blue.

## 📌 Future Improvements

- [ ] Support for image and file sharing.
- [ ] "User is typing..." real-time indicator.
- [ ] Dark mode support for the UI.
- [ ] Persistent message history using a lightweight database (e.g., SQLite).

---
*Developed as a technical project.*
