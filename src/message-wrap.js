/**** message-wrap.js | Message esm ****/
//==============================================================
import { Message }          from 'logic-core';
import defaultCode          from './locales/default.js';

const isNode = typeof globalThis.isDOM === 'boolean' ? !globalThis.isDOM :  typeof process !== 'undefined' && process.versions !== null && process.versions.node !== null;
let localesPath = './locales';

async function absolutePath(localPath) {
    try {
        const { fileURLToPath } = await import('url');
        const path = await import('path');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        return path.resolve(__dirname, localesPath);
    } catch (error) {
        return localPath;  // Fallback to the original path
    }
}

if (isNode) {
    localesPath = await absolutePath(localesPath);
}

Message.importMessage(defaultCode, localesPath);

await Message.autoDetect();

export default Message;
export { Message };