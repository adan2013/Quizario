const roomItem = 'reconnect-room';
const playerItem = 'reconnect-player';

export const reconnectModeIsAvailable = () => {
    return window.localStorage.get(roomItem) !== null && window.localStorage.get(playerItem) !== null;
};

export const getReconnectRoom = () => {
    return localStorage.get(roomItem);
};

export const getReconnectPlayer = () => {
    return localStorage.get(playerItem);
};

export const enableReconnectMode = (room, player) => {
    localStorage.setItem(roomItem, room);
    localStorage.setItem(playerItem, player);
};

export const disableReconnectMode = () => {
    localStorage.removeItem(roomItem);
    localStorage.removeItem(playerItem);
};