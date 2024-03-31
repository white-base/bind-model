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
            this.items = Object;

            /**
             * 지역 함수
             * @member {object} _L.Interface.IBindModel#fn
             */
            this.fn = Object;

            /**
             * 바인드 명령
             * @member {IBindCommand} _L.Interface.IBindModel#commnad
             */
            this.commnad = IBindCommand;
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