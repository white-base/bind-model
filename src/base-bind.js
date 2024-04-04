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
        var _MetaTable                  = require('logic-entity').MetaTable;
        var _IBind                      = require('./i-bind').IBind;
    } else {
        var $Message                    = _global._L.Message;
        var $ExtendError                = _global._L.ExtendError;
        var $Util                       = _global._L.Util;
        var $Observer                   = _global._L.Observer;
        var $MetaObject                 = _global._L.MetaObject;
        var $MetaTable                  = _global._L.MetaTable;
        var $IBind                      = _global._L.IBind;
    }
    var Message                 = _Message              || $Message;
    var ExtendError             = _ExtendError          || $ExtendError;
    var Util                    = _Util                 || $Util;
    var Observer                = _Observer             || $Observer;
    var MetaObject              = _MetaObject           || $MetaObject;
    var MetaTable               = _MetaTable            || $MetaTable;
    var IBind                   = _IBind                || $IBind;

    //==============================================================
    // 3. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    if (typeof Observer === 'undefined') throw new Error(Message.get('ES011', ['Observer', 'observer']));
    if (typeof MetaObject === 'undefined') throw new Error(Message.get('ES011', ['MetaObject', 'meta-object']));
    if (typeof MetaTable === 'undefined') throw new Error(Message.get('ES011', ['MetaTable', 'base-entity']));
    if (typeof IBind === 'undefined') throw new Error(Message.get('ES011', ['IBind', 'i-bind']));
    
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

            var $event = new Observer(this, this);
            var $KEYWORD = [];
            var _baseTable = null;

            /** 
             * 이벤트 객체
             * @private 
             * @member {Observer} _L.Meta.Bind.BaseBind#$event  
             */
            Object.defineProperty(this, '$event', 
            {
                get: function() { return $event; },
                configurable: false,
                enumerable: false,
            });
            
            /** 
             * 컬렉션 예약어
             * @private
             * @member {array<string>}  _L.Collection.BaseCollection#$KEYWORD  
             */
            Object.defineProperty(this, '$KEYWORD', 
            {
                get: function() { return $KEYWORD; },
                set: function(newVal) { $KEYWORD = $KEYWORD.concat(newVal); },
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
                    if (!(newValue instanceof MetaTable)) throw new Error('Only [baseEntity] type "MetaTable" can be added');
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
                    this.$event.subscribe(p_fn, 'execute');
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
                    this.$event.subscribe(p_fn, 'executed');
                }
            });

            // 예약어 등록
            this.$KEYWORD = ['equal', 'instanceOf', 'getTypes'];            // IObject
            this.$KEYWORD = ['_guid', '_type', 'getObject', 'setObject'];   // IMarshal
            this.$KEYWORD = ['$event', '$KEYWORD', '_baseTable'];
            this.$KEYWORD = ['onExecute', 'onExecuted'];
            this.$KEYWORD = ['_onExecute', '_onExecuted'];

            Util.implements(BaseBind, this);
        }
        Util.inherits(BaseBind, _super);

        BaseBind._UNION = [IBind];
        BaseBind._NS = 'Meta.Bind';
        BaseBind._PARAMS = [];
        BaseBind._KIND = 'abstract';

        /**
         * 
         * 
         */
        /**
         * 실행전 이벤트 리스너
         * @param {*} p_bindCommand 바인드 커맨드
         * @listens _L.Meta.Bind.BaseBind#_onExecute
         */
        BaseBind.prototype._onExecute = function(p_bindCommand) {
            this.$event.publish('execute', p_bindCommand);
        };

        /**
         * 실행후 이벤트 리스너
         * @param {*} p_bindCommand 바인드 커맨드
         * @param {*} p_result 결과 
         * @listens _L.Meta.Bind.BaseBind#_onExecuted
         */
        BaseBind.prototype._onExecuted = function(p_bindCommand, p_result) {
            this.$event.publish('executed', p_bindCommand, p_result); 
        };

        /** 
         * 컬럼 추가
         * @abstract
         */
        BaseBind.prototype.addColumn = function() {
            throw new Error('[ addColumn() ] Abstract method definition, fail...');
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