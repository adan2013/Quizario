export const server = (process.env.NODE_ENV === 'development' ? 'http://localhost:4001' : 'http://localhost:4001');

export const createNewRoom = 'CREATE_NEW_ROOW';
export const roomCreated = 'ROOM_CREATED';

export const addToRoom = 'ADD_TO_ROOM';
export const joinedToRoom = 'JOINED_TO_ROOM';
export const roomNotFound = 'ROOM_NOT_FOUND';