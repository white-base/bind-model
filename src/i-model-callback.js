/**** i-model-callback.js | _L.Interface.IModelCallback ****/
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
    var IModelCallback  = (function () {
        /**
         * 내보내기 제어 인터페이스 입니다.
         * @constructs _L.Interface.IModelCallback
         * @interface
         */
        function IModelCallback() {

            /**
             * 실패 콜백
             * @member {function} _L.Interface.IModelCallback#cbFail
             */
            this.cbFail = [[Function]];

            /**
             * 오류 콜백
             * @member {function} _L.Interface.IModelCallback#cbError
             */
            this.cbError = [[Function]];

            /**
             * 기본 시작 콜백
             * @member {function} _L.Interface.IModelCallback#cbBaseBegin
             */
            this.cbBaseBegin = [[Function]];

            /**
             * 기본 유효성 콜백
             * @member {function} _L.Interface.IModelCallback#cbBaseValid
             */
            this.cbBaseValid = [[Function]];

            /**
             * 기본 바인드 콜백
             * @member {function} _L.Interface.IModelCallback#cbBaseBind
             */
            this.cbBaseBind = [[Function]];

            /**
             * 기본 결과 콜백
             * @member {function} _L.Interface.IModelCallback#cbBaseResult
             */
            this.cbBaseResult = [[Function]];

            /**
             * 기본 출력 콜백
             * @member {function} _L.Interface.IModelCallback#cbBaseOutput
             */
            this.cbBaseOutput = [[Function]];

            /**
             * 기본 실행 종료 콜백
             * @member {function} _L.Interface.IModelCallback#cbBaseEnd
             */
            this.cbBaseEnd = [[Function]];

        }
    
        IModelCallback._NS = 'Interface';    // namespace
        IModelCallback._KIND = 'interface';
    
        return IModelCallback;
        
    }());

    //==============================================================
    // 4. module export
    if (isNode) exports.IModelCallback = IModelCallback;    // strip:

    _global._L.Interface            = _global._L.Interface || {};  

    _global._L.IModelCallback = IModelCallback;
    _global._L.Interface.IModelCallback = IModelCallback;

}(typeof window !== 'undefined' ? window : global));