import io from 'socket.io-client';

const socket = io('https://app-gest-stock-api.vercel.app');

export default socket;
