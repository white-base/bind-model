/**** i-bind.js | _L.Interface.IBind ****/

(function(_global) {
    'use strict';

    var isNode = typeof window !== 'undefined' ? false : true;

    //==============================================================
    // 1. namespace declaration
    _global._L                      = _global._L || {};
    _global._L.Interface            = _global._L.Interface || {};    
    
    //==============================================================
    // 2. import module
    if (isNode) {     
        var _Message                    = require('logic-entity').Message;
        var _ExtendError                = require('logic-entity').ExtendError;
    } else {
        var $Message                    = _global._L.Message;
        var $ExtendError                = _global._L.ExtendError;
    }
    var Message                 = _Message              || $Message;
    var ExtendError             = _ExtendError          || $ExtendError;

    //==============================================================
    // 3. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));

    //==============================================================
    // 4. module implementation   
    var IBind  = (function () {
        /**
         * 내보내기 제어 인터페이스 입니다.
         * @constructs _L.Interface.IBind
         * @interface
         */
        function IBind() {

            /**
             * 실행 전 이벤트
             * @member {Funciton} _L.Interface.IBind#onExecute
             */
            this.onExecute = Function;

            /**
             * 실행 후 이벤트
             * @member {Funciton} _L.Interface.IBind#onExecuted
             */
            this.onExecuted = Function;
        }
    
        IBind._NS = 'Interface';    // namespace
        IBind._KIND = 'interface';
    
        return IBind;
        
    }());

    //==============================================================
    // 5. module export
    if (isNode) {     
        exports.IBind = IBind;
    } else {
        _global._L.IBind = IBind;
        _global._L.Interface.IBind = IBind;   // namespace
    }

}(typeof window !== 'undefined' ? window : global));