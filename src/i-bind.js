/**** i-bind.js | _L.Interface.IBind ****/
(function(_global) {
    'use strict';

    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    if (isNode) {                                                               // strip:
        var _Message                    = require('logic-entity').Message;      // strip:
        var _ExtendError                = require('logic-entity').ExtendError;  // strip:
    }                                                                           // strip:
    var $Message                    = _global._L.Message;       // modify:
    var $ExtendError                = _global._L.ExtendError;   // modify:

    var Message                 = _Message              || $Message;            // strip:
    var ExtendError             = _ExtendError          || $ExtendError;        // strip:

    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));

    //==============================================================
    // 3. module implementation   
    var IBind  = (function () {
        /**
         * 내보내기 제어 인터페이스 입니다.
         * @constructs _L.Interface.IBind
         * @interface
         */
        function IBind() {

            /**
             * 실행 전 이벤트
             * @member {MetaTable} _L.Interface.IBind#_baseTable
             */
            this._baseTable = [['_any_']];
        }
    
        IBind._NS = 'Interface';    // namespace
        IBind._KIND = 'interface';
    
        /**
         * 대상을 내보냅니다. (쓰기)
         * @returns {any}
         * @abstract
         */
        IBind.prototype.addColumn  = function() {
            throw new ExtendError(/EL02311/, null, ['IBind']);
        };

        return IBind;
        
    }());

    //==============================================================
    // 4. module export
    if (isNode) exports.IBind = IBind;      // strip:

    _global._L                      = _global._L || {};
    _global._L.Interface            = _global._L.Interface || {};    
        
    _global._L.IBind = IBind;
    _global._L.Interface.IBind = IBind;

}(typeof window !== 'undefined' ? window : global));