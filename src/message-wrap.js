/**** message.js | _L.Common.Message ****/
(function(_global) {
    'use strict';

    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    if (isNode) {                                                           // strip:
        var _Message            = require('logic-core').Message;            // strip:
        var _messageCode        = require('./message-code').messageCode;    // strip:
    }                                                                       // strip:
    var $Message                = _global._L.Message;                   // modify:
    var $messageCode            = _global._L.messageCode;               // modify:

    var Message                 = _Message              || $Message;        // strip:
    var messageCode             = _messageCode          || $messageCode;    // strip:

    //==============================================================
    // 2. module dependency check
    //==============================================================
    // 3. module implementation       
    Message.storage = messageCode;

    //==============================================================
    // 4. module export
    if (isNode) exports.Message = Message;      // strip:

}(typeof window !== 'undefined' ? window : global));