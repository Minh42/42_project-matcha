import io from 'socket.io-client';

const socket = io('http://localhost:8080', { transports: ['websocket'] });


export function setSocket(dispatch) {

	dispatch({ 
		type: SOCKET_ON,
		payload: socket
	});
}