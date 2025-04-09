/**** message-wrap-bundle.js | Message ****/
//==============================================================
import { Message }          from 'logic-core';
import defaultCode          from './locales/default.json';

const localesPath = './locales';

Message.importMessage(defaultCode, localesPath);

export default Message;
export { Message };