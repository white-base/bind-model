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
        var _MetaTable                = require('logic-entity').MetaTable;
    } else {
        var $Message                    = _global._L.Message;
        var $ExtendError                = _global._L.ExtendError;
        var $MetaTable                  = _global._L.MetaTable;
    }
    var Message                 = _Message              || $Message;
    var ExtendError             = _ExtendError          || $ExtendError;
    var MetaTable               = _MetaTable          || $MetaTable;

    //==============================================================
    // 3. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof MetaTable === 'undefined') throw new Error(Message.get('ES011', ['MetaTable', 'meta-table']));

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
    // 5. module export
    if (isNode) {     
        exports.IBind = IBind;
    } else {
        _global._L.IBind = IBind;
        _global._L.Interface.IBind = IBind;   // namespace
    }

}(typeof window !== 'undefined' ? window : global));