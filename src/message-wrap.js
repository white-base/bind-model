/**** message-wrap.js | Message ****/
//==============================================================
import { Message }          from 'logic-core';
import defaultCode          from './locales/default.json';

import { fileURLToPath }    from 'url';
import { dirname, resolve } from 'path';

const isNode = typeof process !== 'undefined' && process.versions !== null && process.versions.node !== null && globalThis.isDOM !== true;
const isESM = isNode && (typeof require === 'undefined' || globalThis.isESM === true);   // REVIEW: test hack

let localesPath = './locales';    // 상대 경로

if (isNode && isESM) {  // REVIEW: esm module & node
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    localesPath = resolve(__dirname, localesPath);
}

Message.importMessage(defaultCode, localesPath);

export default Message;
export { Message };