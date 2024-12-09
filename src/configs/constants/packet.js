import configs from '../constants/header.js';

const { PACKET_LENGTH, PACKET_TYPE_LENGTH } = configs;

const packet = {
  length: PACKET_LENGTH,
  typeLength: PACKET_TYPE_LENGTH,
};

export default packet;
