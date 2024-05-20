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
    var Message                    = _global._L.Message;       
    var ExtendError                = _global._L.ExtendError;   
    var Type                       = _global._L.Type;          
    var Util                       = _global._L.Util;          
    var Observer                   = _global._L.Observer;      
    var MetaRegistry               = _global._L.MetaRegistry;  
    var MetaObject                 = _global._L.MetaObject;    
    var MetaTable                  = _global._L.MetaTable;     
    var IBind                      = _global._L.IBind;         
    //==============================================================
    // 3. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Type === 'undefined') throw new Error(Message.get('ES011', ['Type', 'type']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    if (typeof Observer === 'undefined') throw new Error(Message.get('ES011', ['Observer', 'observer']));
    if (typeof MetaRegistry === 'undefined') throw new Error(Message.get('ES011', ['MetaRegistry', 'meta-registry']));
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
                set: function(nVal) { 
                    if (!(nVal instanceof MetaTable)) throw new Error('Only [baseEntity] type "MetaTable" can be added');
                    _baseTable = nVal;
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
                    if (typeof p_fn !== 'function') throw new Error('Only [execute] type "function" can be added');
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
                    if (typeof p_fn !== 'function') throw new Error('Only [executed] type "function" can be added');
                    this.$event.subscribe(p_fn, 'executed');
                }
            });
            // 예약어 등록
            this.$KEYWORD = ['equal', 'instanceOf', 'getTypes'];            // IObject
            this.$KEYWORD = ['_guid', '_type', 'getObject', 'setObject'];   // IMarshal
            this.$KEYWORD = ['$event', '$KEYWORD', '_baseTable'];
            this.$KEYWORD = ['addColumn'];
            this.$KEYWORD = ['onExecute', 'onExecuted'];
            this.$KEYWORD = ['_onExecute', '_onExecuted'];
        }
        Util.inherits(BaseBind, _super);
        BaseBind._UNION = [IBind];
        BaseBind._NS = 'Meta.Bind';
        BaseBind._PARAMS = [];
        BaseBind._KIND = 'abstract';
        /**
         * 실행 전 이벤트 리스너
         * @param {*} p_command 바인드 커맨드
         * @param {*} [p_model] 바인드 모델
         * @listens _L.Meta.Bind.BaseBind#_onExecute
         */
        BaseBind.prototype._onExecute = function(p_model, p_command) {
            this.$event.publish('execute', p_model, p_command);
        };
        /**
         * 실행 후 이벤트 리스너
         * @param {*} p_command 바인드 커맨드
         * @param {*} [p_model] 바인드 모델
         * @listens _L.Meta.Bind.BaseBind#_onExecuted
         */
        BaseBind.prototype._onExecuted = function(p_model, p_command) {
            this.$event.publish('executed', p_model, p_command); 
        };
        /**
         * 현재 객체의 guid 타입의 객체를 가져옵니다.  
         * - 순환참조는 $ref 값으로 대체된다.
         * @param {number} p_vOpt 가져오기 옵션
         * - opt = 0 : 참조 구조의 객체 (_guid: Yes, $ref: Yes)  
         * - opt = 1 : 소유 구조의 객체 (_guid: Yes, $ref: Yes)  
         * - opt = 2 : 소유 구조의 객체 (_guid: No,  $ref: No)   
         * 객체 비교 : equal(a, b)  
         * a.getObject(2) == b.getObject(2)   
         * @param {object | array<object>} [p_owned] 현재 객체를 소유하는 상위 객체들
         * @returns {object}  
         */
        BaseBind.prototype.getObject = function(p_vOpt, p_owned) {
            var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
            var vOpt = p_vOpt || 0;
            var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);
            if (!Type.deepEqual(this.$event.$subscribers, this.$event._getInitObject())) {
                obj['$subscribers'] = this.$event.$subscribers;
            }
            return obj;                        
        };
        /**
         * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.   
         * @param {object} p_oGuid guid 타입의 객체
         * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
         * 기본값은 p_oGuid 객체와 동일
         */
        BaseBind.prototype.setObject  = function(p_oGuid, p_origin) {
            _super.prototype.setObject.call(this, p_oGuid, p_origin);
            var origin = p_origin ? p_origin : p_oGuid;
            var baseTable;
            if (p_oGuid['$subscribers']) {
                this.$event.$subscribers = p_oGuid['$subscribers'];
            }
        };
        /** 
         * 메타테이블에 컬럼을 추가합니다.
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