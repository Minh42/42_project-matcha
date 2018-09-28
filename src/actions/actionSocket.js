import io from 'socket.io-client';
export const SOCKET_ON = 'SOCKET_ON';

export function setSocket(dispatch) {
	const socket = io('http://localhost:8080', { transports: ['websocket'] });
	// const JSON = require('circular-json');
	// console.log(socket)
	// const test = JSON.stringify(socket);
	// console.log(test);
	dispatch({ 
		type: SOCKET_ON,
		payload: socket
	});
}