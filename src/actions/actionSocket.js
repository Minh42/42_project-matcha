import io from 'socket.io-client';
import {messageTypes} from '../constants/websockets';

const socket = io('http://0.0.0.0:8080');
// const socket = io('http://localhost:8080', { transports: ['websocket'] });

// initialising listeners
export const init = (store) => {
	Object.keys(messageTypes).forEach(type => socket.on(type, (payload) => 
		store.dispatch({type, payload})
	));
};

// sending messages
export const emit = (type, payload) => socket.emit(type, payload);

export function disconnectSocket() {
    return (dispatch, getState, {emit}) => {
		emit('manual-disconnection', socket.id);
		socket.close();
		console.log("Socket Closed. ");
    };
}

export function connectSocket() {
    return (dispatch, getState, {emit}) => {
		emit('manual-connection', socket.id);
		socket.open();
		console.log("Socket Opened. ");
    };
}
