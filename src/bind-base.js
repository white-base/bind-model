/**
 * namespace _L.Meta.Bind.BaseBind
 */
(function(global) {
    
    'use strict';

    //==============================================================
    // 1. 모듈 네임스페이스 선언
    global._L               = global._L || {};
    global._L.Meta          = global._L.Meta || {};
    global._L.Meta.Bind     = global._L.Meta.Bind || {};
    
    //==============================================================
    // 2. 모듈 가져오기 (node | web)
    var Util;
    var Observer;
    var MetaObject;
    var MetaEntity;     // TODO: 제거 검토

    if (typeof module === 'object' && typeof module.exports === 'object') {     
        Util                = require('logic-core').Util;
        Observer            = require('logic-core').Observer;
        MetaObject          = require('logic-core').MetaObject;
        MetaEntity              = require('logic-core').MetaEntity;
    } else {
        Util                = global._L.Common.Util;
        Observer            = global._L.Common.Observer;
        MetaObject          = global._L.Meta.MetaObject;
        MetaEntity              = global._L.Meta.Entity.MetaEntity;
    }

    //==============================================================
    // 3. 모듈 의존성 검사
    if (typeof Util === 'undefined') throw new Error('[Util] module load fail...');
    if (typeof MetaObject === 'undefined') throw new Error('[MetaObject] module load fail...');
    if (typeof Observer === 'undefined') throw new Error('[Observer] module load fail...');
    if (typeof MetaEntity === 'undefined') throw new Error('[MetaEntity] module load fail...');

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

            var __baseEntity;
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
             * @member _L.Meta.Bind.BaseBind#_baseEntity
             * @protected
             */
            Object.defineProperty(this, '_baseEntity', 
            {
                get: function() { return __baseEntity; },
                set: function(newValue) { 
                    if (!(newValue instanceof MetaEntity)) throw new Error('Only [baseEntity] type "MetaEntity" can be added');
                    __baseEntity = newValue;
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
            this._symbol = this._symbol.concat(['__event', '_symbol', '_baseEntity']);
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
    // 5. 모듈 내보내기 (node | web)
    if (typeof module === 'object' && typeof module.exports === 'object') {     
        module.exports = BaseBind;
    } else {
        global._L.Meta.Bind.BaseBind = BaseBind;
    }

}(typeof module === 'object' && typeof module.exports === 'object' ? global : window));