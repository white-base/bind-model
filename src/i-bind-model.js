/**** i-bind-model.js | _L.Interface.IBindModel ****/

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
        // var _IBindCommand               = require('./i-bind-command').IBindCommand;
    } else {
        var $Message                    = _global._L.Message;
        var $ExtendError                = _global._L.ExtendError;
        // var $IBindCommand               = _global._L.IBindCommand;
    }
    var Message                 = _Message              || $Message;
    var ExtendError             = _ExtendError          || $ExtendError;
    // var IBindCommand            = _IBindCommand         || $IBindCommand;

    //==============================================================
    // 3. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    // if (typeof IBindCommand === 'undefined') throw new Error(Message.get('ES011', ['IBindCommand', 'i-bind-command']));

    //==============================================================
    // 4. module implementation   
    var IBindModel  = (function () {
        /**
         * 내보내기 제어 인터페이스 입니다.
         * @constructs _L.Interface.IBindModel
         * @interface
         */
        function IBindModel() {
            
            /**
             * 아이템
             * @member {object} _L.Interface.IBindModel#items
             */
            this.items = [[{}]];

            /**
             * 지역 함수
             * @member {object} _L.Interface.IBindModel#fn
             */
            this.fn = [[{}]];

            /**
             * 바인드 명령
             * @member {object} _L.Interface.IBindModel#command
             */
            this.command = [[{}]];

            /**
             * 초기화 이전 등록
             * @member {Function} _L.Interface.IBindModel#preRegister
             */
            this.preRegister = [[Function]];

            /**
             * 초기화 이전 검사
             * @member {Function} _L.Interface.IBindModel#preCheck
             */
            this.preCheck = [[Function]];

            /**
             * 초기화 이전 준비완료
             * @member {Function} _L.Interface.IBindModel#preReady
             */
            this.preReady = [[Function]];
        }
    
        IBindModel._NS = 'Interface';    // namespace
        IBindModel._KIND = 'interface';
    
        return IBindModel;
        
    }());

    //==============================================================
    // 5. module export
    if (isNode) {     
        exports.IBindModel = IBindModel;
    } else {
        _global._L.IBindModel = IBindModel;
        _global._L.Interface.IBindModel = IBindModel;   // namespace
    }

}(typeof window !== 'undefined' ? window : global));