/**** base-bind.js | _L.Meta.Bind.BaseBind ****/

(function(_global) {
    'use strict';

    var isNode = typeof window !== 'undefined' ? false : true;

    //==============================================================
    // 1. namespace declaration
    _global._L               = _global._L || {};
    _global._L.Meta          = _global._L.Meta || {};
    _global._L.Meta.Bind     = _global._L.Meta.Bind || {};
    
    //==============================================================
    // 2. import module
    if (isNode) {  
        var _Message                    = require('logic-entity').Message;
        var _ExtendError                = require('logic-entity').ExtendError;
        var _Util                       = require('logic-entity').Util;
        var _Observer                   = require('logic-entity').Observer;
        var _MetaObject                 = require('logic-entity').MetaObject;
        var _BaseEntity                 = require('logic-entity').BaseEntity;
    } else {
        var $Message                    = _global._L.Message;
        var $ExtendError                = _global._L.ExtendError;
        var $Util                       = _global._L.Util;
        var $Observer                   = _global._L.Observer;
        var $MetaObject                 = _global._L.MetaObject;
        var $BaseEntity                 = _global._L.BaseEntity;
    }
    var Message                 = _Message              || $Message;
    var ExtendError             = _ExtendError          || $ExtendError;
    var Util                    = _Util                 || $Util;
    var Observer                = _Observer             || $Observer;
    var MetaObject              = _MetaObject           || $MetaObject;
    var BaseEntity              = _BaseEntity           || $BaseEntity;

    //==============================================================
    // 3. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    if (typeof Observer === 'undefined') throw new Error(Message.get('ES011', ['Observer', 'observer']));
    if (typeof MetaObject === 'undefined') throw new Error(Message.get('ES011', ['MetaObject', 'meta-object']));
    if (typeof BaseEntity === 'undefined') throw new Error(Message.get('ES011', ['BaseEntity', 'base-entity']));
    
    //==============================================================
    // 4. module implementation
    //--------------------------------------------------------------
    // implementation
    var BaseBind  = (function (_super) {
        /**
         * 기본 바인드 (최상위)
         * @constructs _L.Meta.Bind.BaseBind
         * @abstract
         * @extends _L.Meta.MetaObject
         */
        function BaseBind() {
            _super.call(this);

            var __event = new Observer(this, this);
            var __KEYWORD = [];
            var _baseTable;

            /** 
             * 이벤트 객체
             * @private 
             * @member {Observer} _L.Meta.Bind.BaseBind#__event  
             */
            Object.defineProperty(this, '__event', 
            {
                get: function() { return __event; },
                configurable: false,
                enumerable: false,
            });

            /**
             * 기본 엔티티
             * @member _L.Meta.Bind.BaseBind#_baseTable
             * @protected
             */
            Object.defineProperty(this, '_baseTable', 
            {
                get: function() { return _baseTable; },
                set: function(newValue) { 
                    if (!(newValue instanceof BaseEntity)) throw new Error('Only [baseEntity] type "BaseEntity" can be added');
                    _baseTable = newValue;
                },
                configurable: true,
                enumerable: true
            });  

            /**
             * 실행전 이벤트
             * @event _L.Meta.Bind.BaseBind#onExecute
             */
            Object.defineProperty(this, 'onExecute', {
                enumerable: true,
                configurable: true,
                set: function(p_fn) {
                    this.__event.subscribe(p_fn, 'execute');
                }
            });

            /**
             * 실행후 이벤트
             * @event _L.Meta.Bind.BaseBind#onExecuted
             */
            Object.defineProperty(this, 'onExecuted', {
                enumerable: true,
                configurable: true,
                set: function(p_fn) {
                    this.__event.subscribe(p_fn, 'executed');
                }
            });

            /** 
             * 컬렉션 예약어
             * @private
             * @member {array<string>}  _L.Collection.BaseCollection#__KEYWORD  
             */
            Object.defineProperty(this, '__KEYWORD', 
            {
                get: function() { return __KEYWORD; },
                set: function(p_val) { __KEYWORD = p_val; },
                configurable: false,
                enumerable: false,
            });

            // 예약어 등록
            this.__KEYWORD = this.__KEYWORD.concat(['equal', 'instanceOf', 'getTypes']);            // IObject
            this.__KEYWORD = this.__KEYWORD.concat(['_guid', '_type', 'getObject', 'setObject']);   // IMarshal
            this.__KEYWORD = this.__KEYWORD.concat(['__event', '__KEYWORD', '_baseTable']);
            this.__KEYWORD = this.__KEYWORD.concat(['onExecute', 'onExecuted']);
            this.__KEYWORD = this.__KEYWORD.concat(['_onExecute', '_onExecuted']);
        }
        Util.inherits(BaseBind, _super);

        BaseBind._UNION = [];
        BaseBind._NS = 'Meta.Bind';
        BaseBind._PARAMS = [];
        BaseBind._KIND = 'abstract';

        /**
         * 실행전 이벤트
         * @listens _L.Meta.Bind.BaseBind#_onExecute
         */
        BaseBind.prototype._onExecute = function(p_bindCommand) {
            this.__event.publish('execute', p_bindCommand);
        };

        /**
         * 실행후 이벤트
         * @listens _L.Meta.Bind.BaseBind#_onExecuted
         */
        BaseBind.prototype._onExecuted = function(p_bindCommand, p_result) {
            this.__event.publish('executed', p_bindCommand, p_result); 
        };

        return BaseBind;
    
    }(MetaObject));

    //==============================================================
    // 5. module export
    if (isNode) {     
        exports.BaseBind                = BaseBind;
    } else {
        _global._L.BaseBind             = BaseBind;
        // namespace
        _global._L.Meta.Bind.BaseBind   = BaseBind;
    }

}(typeof window !== 'undefined' ? window : global));