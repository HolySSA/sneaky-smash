import { customAlphabet } from 'nanoid';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const makeUUID = customAlphabet(ALPHABET, 10);
export default makeUUID;
