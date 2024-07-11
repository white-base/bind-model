/**** base-bind.js | _L.Meta.Bind.BaseBind ****/
(function(_global) {
    'use strict';

    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    if (isNode) {                                                               // strip:
        var _Message                    = require('./message-wrap').Message;    // strip:
        var _ExtendError                = require('logic-entity').ExtendError;  // strip:
        var _Type                       = require('logic-entity').Type;         // strip:
        var _Util                       = require('./util-wrap').Util;          // strip:
        var _Observer                   = require('logic-entity').Observer;     // strip:
        var _MetaRegistry               = require('logic-entity').MetaRegistry; // strip:
        var _MetaObject                 = require('logic-entity').MetaObject;   // strip:
        var _MetaTable                  = require('logic-entity').MetaTable;    // strip:
        var _IBind                      = require('./i-bind').IBind;            // strip:
    }                                                                           // strip:
    var $Message                    = _global._L.Message;               // modify:
    var $ExtendError                = _global._L.ExtendError;           // modify:
    var $Type                       = _global._L.Type;                  // modify:
    var $Util                       = _global._L.Util;                  // modify:
    var $Observer                   = _global._L.Observer;              // modify:
    var $MetaRegistry               = _global._L.MetaRegistry;          // modify:
    var $MetaObject                 = _global._L.MetaObject;            // modify:
    var $MetaTable                  = _global._L.MetaTable;             // modify:
    var $IBind                      = _global._L.IBind;                 // modify:

    var Message                 = _Message              || $Message;            // strip:
    var ExtendError             = _ExtendError          || $ExtendError;        // strip:
    var Type                    = _Type                 || $Type;               // strip:
    var Util                    = _Util                 || $Util;               // strip:
    var Observer                = _Observer             || $Observer;           // strip:
    var MetaRegistry            = _MetaRegistry         || $MetaRegistry;       // strip:
    var MetaObject              = _MetaObject           || $MetaObject;         // strip:
    var MetaTable               = _MetaTable            || $MetaTable;          // strip:
    var IBind                   = _IBind                || $IBind;              // strip:

    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Type) throw new Error(Message.get('ES011', ['Type', 'type']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    if (!Observer) throw new Error(Message.get('ES011', ['Observer', 'observer']));
    if (!MetaRegistry) throw new Error(Message.get('ES011', ['MetaRegistry', 'meta-registry']));
    if (!MetaObject) throw new Error(Message.get('ES011', ['MetaObject', 'meta-object']));
    if (!MetaTable) throw new Error(Message.get('ES011', ['MetaTable', 'base-entity']));
    if (!IBind) throw new Error(Message.get('ES011', ['IBind', 'i-bind']));
    
    //==============================================================
    // 3. module implementation
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
                    if (!(nVal instanceof MetaTable)) throw new ExtendError(/EL06111/, null, [this.constructor.name]);
                    _baseTable = nVal;
                },
                configurable: true,
                enumerable: true
            });  

            /**
             * 실행 전 이벤트
             * @event _L.Meta.Bind.BaseBind#onExecute
             */
            Object.defineProperty(this, 'onExecute', {
                enumerable: true,
                configurable: true,
                set: function(p_fn) {
                    if (typeof p_fn !== 'function') throw new ExtendError(/EL06112/, null, [this.constructor.name]);
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
                    if (typeof p_fn !== 'function') throw new ExtendError(/EL06113/, null, [this.constructor.name]);
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

            Util.implements(BaseBind, this);        // strip:
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
            throw new ExtendError(/EL06114/, null, [this.constructor.name]);
        };

        return BaseBind;
    
    }(MetaObject));

    //==============================================================
    // 4. module export
    if (isNode) exports.BaseBind = BaseBind;    // strip:

    _global._L               = _global._L || {};
    _global._L.Meta          = _global._L.Meta || {};
    _global._L.Meta.Bind     = _global._L.Meta.Bind || {};

    _global._L.BaseBind = BaseBind;
    _global._L.Meta.Bind.BaseBind = BaseBind;

}(typeof window !== 'undefined' ? window : global));