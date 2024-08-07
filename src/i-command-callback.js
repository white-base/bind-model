/**** i-command-callback.js | _L.Interface.ICommandCallback ****/
(function(_global) {
    'use strict';

    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    if (isNode) {                                                               // strip:
        var _Message                    = require('./message-wrap').Message;    // strip:
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
    var ICommandCallback  = (function () {
        /**
         * 내보내기 제어 인터페이스 입니다.
         * @constructs _L.Interface.ICommandCallback
         * @interface
         */
        function ICommandCallback() {

            /**
             * 시작 콜백
             * @member {function} _L.Interface.ICommandCallback#cbBegin
             */
            this.cbBegin = [[Function]];

            /**
             * 유효성 콜백
             * @member {function} _L.Interface.ICommandCallback#cbValid
             */
            this.cbValid = [[Function]];

            /**
             * 바인드 콜백
             * @member {function} _L.Interface.ICommandCallback#cbBind
             */
            this.cbBind = [[Function]];

            /**
             * 결과 콜백
             * @member {function} _L.Interface.ICommandCallback#cbResult
             */
            this.cbResult = [[Function]];

            /**
             * 출력 콜백
             * @member {function} _L.Interface.ICommandCallback#cbOutput
             */
            this.cbOutput = [[Function]];

            /**
             * 실행 종료 콜백
             * @member {function} _L.Interface.ICommandCallback#cbEnd
             */
            this.cbEnd = [[Function]];

        }
        ICommandCallback._NS = 'Interface';    // namespace
        ICommandCallback._KIND = 'interface';
    
        return ICommandCallback;
        
    }());

    //==============================================================
    // 4. module export
    if (isNode) exports.ICommandCallback    = ICommandCallback;    // strip:

    // create namespace
    _global._L.Interface                    = _global._L.Interface || {};    

    _global._L.ICommandCallback = ICommandCallback;
    _global._L.Interface.ICommandCallback = ICommandCallback;

}(typeof window !== 'undefined' ? window : global));