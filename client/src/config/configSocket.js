import io from 'socket.io-client';
const socket = io.connect('http://192.168.8.102:1010');

export {
    socket
}