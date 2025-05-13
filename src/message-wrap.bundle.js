/**** message-wrap-bundle.js | Message cjs ****/
//==============================================================
import { Message }          from 'logic-core';
import defaultCode          from './locales/default.js';

const isNode = typeof globalThis.isDOM === 'boolean' ? !globalThis.isDOM :  typeof process !== 'undefined' && process.versions !== null && process.versions.node !== null;
const localesPath = './locales';

function absolutePath(localPath) {
    try {
        const path = require('path');
        return path.resolve(__dirname, localPath);
    } catch (error) {
        return localPath;  // Fallback to the original path
    }
}

if (isNode) {
    localesPath = absolutePath(localesPath);
}

Message.importMessage(defaultCode, localesPath);

(async () => {
    await Message.autoDetect();
})();

export default Message;
export { Message };