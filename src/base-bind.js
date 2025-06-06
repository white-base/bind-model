/**** base-bind.js | BaseBind ****/
//==============================================================
import { ExtendError }                  from 'logic-entity';
import { Type }                         from 'logic-entity';
import { EventEmitter }                 from 'logic-entity';
import { MetaObject }                   from 'logic-entity';
import { MetaTable }                    from 'logic-entity';
import { Util }                         from './util-wrap.js';
import { IBind }                        from './i-bind.js';


var BaseBind = (function (_super) {
    /**
     * 기본 바인드 (최상위)
     * 
     * @constructs BaseBind
     * @abstract
     * @extends MetaObject
     */
    function BaseBind() {
        _super.call(this);

        var $event = new EventEmitter(this, this);
        var $KEYWORD = [];
        var _baseTable = null;

        /** 
         * 이벤트 객체
         * 
         * @private 
         * @member {EventEmitter} BaseBind#$event  
         */
        Object.defineProperty(this, '$event', {
            get: function() { return $event; },
            configurable: false,
            enumerable: false,
        });
        
        /** 
         * 컬렉션 예약어
         * 
         * @private
         * @member {array<string>}  BaseCollection#$KEYWORD  
         */
        Object.defineProperty(this, '$KEYWORD', {
            get: function() { return $KEYWORD; },
            set: function(newVal) { $KEYWORD = $KEYWORD.concat(newVal); },
            configurable: false,
            enumerable: false,
        });

        /**
         * 기본 엔티티
         * 
         * @member BaseBind#_baseTable
         * @protected
         */
        Object.defineProperty(this, '_baseTable', {
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
         * 
         * @event BaseBind#onExecute
         */
        Object.defineProperty(this, 'onExecute', {
            enumerable: true,
            configurable: true,
            set: function(p_fn) {
                if (typeof p_fn !== 'function') throw new ExtendError(/EL06112/, null, [this.constructor.name]);
                this.$event.on('execute', p_fn);
            }
        });

        /**
         * 실행후 이벤트
         * 
         * @event BaseBind#onExecuted
         */
        Object.defineProperty(this, 'onExecuted', {
            enumerable: true,
            configurable: true,
            set: function(p_fn) {
                if (typeof p_fn !== 'function') throw new ExtendError(/EL06113/, null, [this.constructor.name]);
                this.$event.on('executed', p_fn);
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
     * 
     * @param {*} p_command 바인드 커맨드
     * @param {*} [p_model] 바인드 모델
     * @listens BaseBind#_onExecute
     */
    BaseBind.prototype._onExecute = function(p_model, p_command) {
        this.$event.emit('execute', p_model, p_command, this);
    };

    /**
     * 실행 후 이벤트 리스너
     * 
     * @param {*} p_command 바인드 커맨드
     * @param {*} [p_model] 바인드 모델
     * @listens BaseBind#_onExecuted
     */
    BaseBind.prototype._onExecuted = function(p_model, p_command) {
        this.$event.emit('executed', p_model, p_command, this); 
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
        // var vOpt = p_vOpt || 0;
        // var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

        if (!Type.deepEqual(this.$event.$storage, {})) {
            obj['$storage'] = this.$event.$storage;
        }
        return obj;                        
    };

    /**
     * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.
     * 
     * @param {object} p_oGuid guid 타입의 객체
     * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
     * 기본값은 p_oGuid 객체와 동일
     */
    BaseBind.prototype.setObject  = function(p_oGuid, p_origin) {
        _super.prototype.setObject.call(this, p_oGuid, p_origin);
        
        // var origin = p_origin ? p_origin : p_oGuid;
        // var baseTable;
        
        if (p_oGuid['$storage']) {
            this.$event.$storage = p_oGuid['$storage'];
        }
    };

    /** 
     * 메타테이블에 컬럼을 추가합니다.
     * 
     * @abstract
     */
    BaseBind.prototype.addColumn = function() {
        throw new ExtendError(/EL06114/, null, [this.constructor.name]);
    };

    return BaseBind;

}(MetaObject));

export default BaseBind;
export { BaseBind };