const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// In-memory store for rooms. In a production app, you'd use a database.
// Map<string, { clients: Set<WebSocket>, messages: Array<any> }>
const rooms = new Map();

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (rawMessage) => {
    let message;
    try {
      message = JSON.parse(rawMessage);
    } catch (e) {
      console.error('Invalid JSON received:', rawMessage);
      return;
    }

    const { type, payload } = message;

    switch (type) {
      case 'join': {
        const { name, pin } = payload;
        ws.name = name;
        ws.pin = pin;

        if (!rooms.has(pin)) {
          rooms.set(pin, { clients: new Set(), messages: [] });
        }
        const room = rooms.get(pin);
        room.clients.add(ws);

        // Send message history to the newly connected client
        ws.send(JSON.stringify({ type: 'history', payload: room.messages }));

        console.log(`${name} joined room ${pin}`);
        break;
      }
      case 'message': {
        const { pin } = ws;
        const room = rooms.get(pin);
        if (room) {
          // Store message and broadcast to all clients in the room
          room.messages.push(payload);
          room.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: 'message', payload }));
            }
          });
        }
        break;
      }
      default:
        console.log(`Unknown message type: ${type}`);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    const { pin } = ws;
    if (pin && rooms.has(pin)) {
      const room = rooms.get(pin);
      room.clients.delete(ws);
      // If room is empty, we could clean it up
      if (room.clients.size === 0) {
        rooms.delete(pin);
        console.log(`Room ${pin} is empty and has been closed.`);
      }
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
