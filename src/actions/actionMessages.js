export const ADD_FLASH_MESSAGE = 'ADD_FLASH_MESSAGE';
export const DELETE_FLASH_MESSAGE = 'DELETE_FLASH_MESSAGE';

export function addFlashMessage(message, style) {
	return {
		type: ADD_FLASH_MESSAGE,
		payload: {
			message,
			style
		}
	};
}