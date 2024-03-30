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
    // 3. 모듈 의존성 검사
    if (typeof Util === 'undefined') throw new Error('[Util] module load fail...');
    if (typeof MetaObject === 'undefined') throw new Error('[MetaObject] module load fail...');
    if (typeof Observer === 'undefined') throw new Error('[Observer] module load fail...');
    if (typeof BaseEntity === 'undefined') throw new Error('[BaseEntity] module load fail...');

    //==============================================================
    // 4. 모듈 구현    
    var BaseBind  = (function (_super) {
        /**
         * 기본 바인드 (최상위)
         * @constructs _L.Meta.Bind.BaseBind
         * @abstract
         * @extends _L.Meta.MetaObject
         */
        function BaseBind() {
            _super.call(this);

            var __baseTable;
            // var __propagation   = true;
            
            /** 
             * 이벤트 (옵서버)
             * @private 
             */
            this.__event    = new Observer(this, this);

            // Protected
            /**
             * 심볼 (내부 심볼 등록)
             * @protected
             */
            this._symbol        = [];

            /**
             * 기본 엔티티
             * @member _L.Meta.Bind.BaseBind#_baseTable
             * @protected
             */
            Object.defineProperty(this, '_baseTable', 
            {
                get: function() { return __baseTable; },
                set: function(newValue) { 
                    if (!(newValue instanceof BaseEntity)) throw new Error('Only [baseEntity] type "BaseEntity" can be added');
                    __baseTable = newValue;
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

            // 예약어 등록
            this._symbol = this._symbol.concat(['__event', '_symbol', '_baseTable']);
            this._symbol = this._symbol.concat(['onExecute', 'onExecuted']);
            this._symbol = this._symbol.concat(['getTypes', '_onExecute', '_onExecuted']);
        }
        Util.inherits(BaseBind, _super);


        /** 
         * 상속 클래스에서 오버라이딩 필요!!
         * @override
         */
        // BaseBind.prototype.getTypes  = function() {
                    
        //     var type = ['BaseBind'];
            
        //     return type.concat(typeof _super !== 'undefined' && _super.prototype && _super.prototype.getTypes ? _super.prototype.getTypes() : []);
        // };
        
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