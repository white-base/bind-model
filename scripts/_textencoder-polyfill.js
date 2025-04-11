// import 'whatwg-fetch';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// import { BroadcastChannel } from 'broadcast-channel';

// global.BroadcastChannel = BroadcastChannel;