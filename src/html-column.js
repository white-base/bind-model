/**** html-column.js | _L.Meta.Entity.HTMLColumn ****/
(function(_global) {
    'use strict';

    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    if (isNode) {                                                               // strip:
        var _Message                    = require('./message-wrap').Message;    // strip:
        var _ExtendError                = require('logic-entity').ExtendError;  // strip:
        var _Type                       = require('logic-core').Type;           // strip:
        var _Util                       = require('./util-wrap').Util;          // strip:
        var _MetaColumn                 = require('logic-entity').MetaColumn;   // strip:
        var _jquery                     = require('jquery');                    // strip:
    }                                                                           // strip:
    var $Message                    = _global._L.Message;       // modify:
    var $ExtendError                = _global._L.ExtendError;   // modify:
    var $Type                      = _global._L.Type;           // modify:
    var $Util                       = _global._L.Util;          // modify:
    var $MetaColumn                 = _global._L.MetaColumn;    // modify:
    var $jquery                     = _global.jQuery;           // modify:
    // jquery 로딩// Branch:

    var Message                 = _Message              || $Message;            // strip:
    var ExtendError             = _ExtendError          || $ExtendError;        // strip:
    var Type                    = _Type                 || $Type;               // strip:
    var Util                    = _Util                 || $Util;               // strip:
    var MetaColumn              = _MetaColumn           || $MetaColumn;         // strip:
    var jquery                  = _jquery               || $jquery;             // strip:

    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Type === 'undefined') throw new Error(Message.get('ES011', ['Type', 'type']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    if (!MetaColumn) throw new Error(Message.get('ES011', ['MetaColumn', 'meta-column']));
    
    //==============================================================
    // 3. module implementation
    var HTMLColumn  = (function (_super) {
        /**
         * HTML 컬럼
         * @constructs _L.Meta.Entity.HTMLColumn
         * @extends _L.Meta.Entity.MetaColumn
         */
        function HTMLColumn(p_name, p_entity, p_option) {
            _super.call(this, p_name, p_entity, p_option);

            var domType       = null;
            var isReadOnly    = false;
            var isHide        = false;
            var element       = null;
            var getFilter     = null;
            var setFilter     = null;
            // var selector      = { key: '', type: 'none' };
            var selector      = null;

            /**
             * 아이템 DOM 타입
             * @member {*} _L.Meta.Entity.HTMLColumn#domType
             */
            Object.defineProperty(this, 'domType', 
            {
                get: function() { return domType; },
                set: function(nVal) { 
                    // TODO:: 자료종류 {input: {type: 'text'...}} 만들어야함 => 필요성 검토해야함
                    // TODO: DOM 인스턴스 여부로 검사해야함
                    if(typeof nVal !== 'object') throw new ExtendError(/EL054601/, null, [this.constructor.name]);
                    domType = nVal;
                },
                configurable: true,
                enumerable: true
            });
            
            /**
             * 읽기전용 여부
             * @member {*} _L.Meta.Entity.HTMLColumn#isReadOnly
             */
            Object.defineProperty(this, 'isReadOnly', 
            {
                get: function() { return isReadOnly; },
                set: function(nVal) { 
                    if(typeof nVal !== 'boolean') throw new ExtendError(/EL054602/, null, [this.constructor.name]);
                    isReadOnly = nVal;
                },
                configurable: true,
                enumerable: true
            });
            
            /**
             * 숨김 여부
             * @member {*} _L.Meta.Entity.HTMLColumn#isHide
             */
            Object.defineProperty(this, 'isHide', 
            {
                get: function() { return isHide; },
                set: function(nVal) { 
                    if(typeof nVal !== 'boolean') throw new ExtendError(/EL054603/, null, [this.constructor.name]);
                    isHide = nVal;
                },
                configurable: true,
                enumerable: true
            });
            
            /**
             * DOM 요소
             * @member {*} _L.Meta.Entity.HTMLColumn#element
             */
            Object.defineProperty(this, 'element', 
            {
                get: function() { return element; },
                set: function(nVal) {       // TODO: DOM 인스턴스 여부로 검사해야함
                    if(typeof nVal !== 'object') throw new ExtendError(/EL054604/, null, [this.constructor.name]);
                    element = nVal;
                },
                configurable: true,
                enumerable: true
            });

            /**
             * 셀렉터
             * @member {*} _L.Meta.Entity.HTMLColumn#selector
             * @example
             * type
             *  - val | value   : 요소의 value 속성값
             *  - text          : 요소의 텍스트값
             *  - html          : 요소의 html값
             *  - css.속성명    : css 의 속성값 (객체)
             *  - prop.속성명   : 요소의 속성명값 (초기상태기준)
             *  - attr.속성명   : 요소의 속성명값 (현재상태)
             *  - none         : 아무일도 하지 않음, 표현의 목적
             */
            Object.defineProperty(this, 'selector', 
            {
                get: function() { return selector; },
                // set: function(nVal) { 
                //     var newSelector = { key: '', type: 'value' };

                //     if (typeof nVal === 'string') {
                //         // selector.key = nVal;
                //         selector = newSelector;
                //         selector.key = nVal;
                //     } else if (typeof nVal === 'object' && typeof nVal.key !== 'undefined') {
                //         selector = nVal;
                //     } else {
                //         throw new Error('Only [selector] type "string | object.key" can be added');
                //     }
                //     // selector = selector;
                // },
                set: function(nVal) { 
                    var newSelector = { key: '', type: 'none' };
                    if (typeof nVal === 'string' ) {
                        newSelector['key'] = nVal;
                    } else if (typeof nVal === 'object') {
                        if (typeof nVal['key'] === 'string') newSelector['key'] = nVal['key'];
                        if (typeof nVal['type'] === 'string') newSelector['type'] = nVal['type'].toLowerCase();
                    } else throw new ExtendError(/EL054605/, null, [this.constructor.name]);
                    selector = newSelector;
                },
                configurable: true,
                enumerable: true
            });

            /**
             * value 값 필터
             * @member {Function} _L.Meta.Entity.HTMLColumn#getFilter
             */
             Object.defineProperty(this, 'getFilter', 
             {
                 get: function() { return getFilter; },
                 set: function(val) { 
                     if(typeof val !== 'function') throw new ExtendError(/EL054606/, null, [this.constructor.name]);
                     getFilter = val;
                 },
                 configurable: true,
                 enumerable: true
             });
                      
             /**
             * value 값 필터
             * @member {Function} _L.Meta.Entity.HTMLColumn#setFilter
             */
              Object.defineProperty(this, 'setFilter', 
              {
                  get: function() { return setFilter; },
                  set: function(val) { 
                      if(typeof val !== 'function') throw new ExtendError(/EL054607/, null, [this.constructor.name]);
                      setFilter = val;
                  },
                  configurable: true,
                  enumerable: true
              });

            /**
             * 아이템 값 (오버라이딩)
             * @override
             * @member {*} _L.Meta.Entity.HTMLColumn#value
             */
            Object.defineProperty(this, 'value', 
            {
                get: function() { 
                    var __val;
                    var key, type, option;

                    // 우선순위 : 1
                    if (typeof this.getter === 'function' ) {
                        
                        __val = this.getter.call(this);
                        
                        // 검사 및 이벤트 발생
                        if (this.$value !== null && this.$value !== __val) {
                            this._onChanged(__val, this.$value);
                            this.$value = __val;   // 내부에 저장
                        }

                    // 우선순위 : 2
                    // } else if (__selector !== null && __filter === null) {
                    } else if (selector !== null || typeof this.getFilter === 'function') {

                        // node 에서는 강제 종료함
                        if (!isNode) {

                            key = this.selector.key;
                            type = this.selector.type;
                            option = type.indexOf('.') > -1 ? type.substr(type.indexOf('.') + 1) : '';
                            
                            if (type !== 'none'){
                                if (type === 'value' || type === 'val') {
                                    __val = jquery(key).val();
                                } else if (type === 'text') {
                                    __val = jquery(key).text();
                                } else if (type === 'html') {
                                    __val = jquery(key).html();
                                } else if (type.indexOf('prop') > -1) {
                                    if (option === '') throw new ExtendError(/EL054608/, null, [this.constructor.name, key]);
                                    else __val = jquery(key).prop(option);
                                } else if (type.indexOf('attr') > -1) {
                                    if (option === '') throw new ExtendError(/EL054609/, null, [this.constructor.name, key]);
                                    else __val = jquery(key).attr(option);
                                } else if (type.indexOf('css') > -1) {
                                    if (option === '') throw new ExtendError(/EL054610/, null, [this.constructor.name, key]);
                                    else __val = jquery(key).css(option);
                                } else {
                                    throw new ExtendError(/EL054611/, null, [this.constructor.name]);
                                }
                                
                                // selector 검사
                                if (typeof __val === 'undefined' || __val === null) {
                                    console.warn('selector key = '+ key +', type = '+ type +'에 일치하는 값이 없습니다. ');                    
                                } 

                                // 검사 및 이벤트 발생
                                if (this.__sValue !== null && this.__sValue !== __val && __val) {
                                    this._onChanged(__val, this.__sValue);
                                    this.__sValue = String(__val);  // sValue 저장
                                }

                            }
                        }

                        // 필터 적용 : get
                        if (typeof this.getFilter === 'function') __val = this.getFilter.call(this, __val);
                    
                    // 우선순위 : 3        
                    } else {
                        __val = this.$value;
                    }
                     
                    /**
                     * 분기 처리값 '__val' 없는경우 (null, undefined)
                     *  - this.$value 초기화 되지 않은 경우
                     *  - getter 리턴이 없는 경우
                     *  - node selector 를 사용한 경우
                     *  - selector 매칭값이 없는 경우
                     */
                    if (typeof __val === 'undefined' || __val === null) {
                        // __val = this.$value || this.default;  REVIEW: 제거대상
                        __val = this.$value;
                    }

                    // Get값과 내부값이 다를경우 값 설정 (내부적으로 change 이벤트 발생함)
                    // if (__val !== this.$value) {
                    //     this.value = __val;
                    // }

                    return __val; 
                },
                set:  function(val) { 
                    var __val, _val, _fVal;
                    var key, type, option;
                    var _oldVal = this.$value;
                    // var _isSetFilter = true;   // selector 설정 여부

                    // if (typeof this.setter === 'function' ) _val = this.setter.call(this, val);
                    
                    // // settter 의 리턴이 여부
                    // if (typeof _val !== 'undefined') __val = _val;
                    // else __val = val;
                    if (typeof this.setter === 'function') __val = this.setter.call(this, val) || val;
                    else __val = val;

                    __val = __val === null ? '' : __val;  // null 등록 오류 처리
                    
                    if (this._valueTypes.length > 0) Type.matchType([this._valueTypes], __val);
                    // if(['number', 'string', 'boolean'].indexOf(typeof __val) < 0) {
                    //     throw new ExtendError(/EL054612/, null, [this.constructor.name]);   // TODO: EL054612 에러 코드 제거됨
                    // }
                    this.$value = __val;   // 내부에 저장
           
                    if (selector !== null || typeof this.setFilter === 'function') {

                        if (typeof this.setFilter === 'function') {
                            _fVal = this.setFilter.call(this, __val);
                        }
                        
                        // 셀렉터 설정 값 1> 필터값, 2> __value
                        __val = _fVal || __val;

                        // node 에서는 강제 종료함
                        if (!isNode) {

                            // 필터 적용 : set
                            // if (typeof this.setFilter === 'function') {
                            //     __val = this.setFilter.call(this, __val);
                            //     _isSetFilter = __val ? true : false;
                            // }

                            // if (typeof this.setFilter === 'function') {
                            //     _fVal = this.setFilter.call(this, __val);
                            // }
                            
                            // // 셀렉터 설정 값 1> 필터값, 2> __value
                            // __val = _fVal || __val;

                            // 셀렉터 내부값 저장
                            this.__sValue = String(__val);

                            key = this.selector.key;
                            type = this.selector.type;
                            option = type.indexOf('.') > -1 ? type.substr(type.indexOf('.') + 1) : '';

                            // 유효한 셀렉터 이면서, 설정할 ....
                            // if (type !== 'none' && type !== '' && _isSetFilter){
                            if (type !== 'none'){
                                if (type === 'value' || type === 'val') {
                                    jquery(key).val(__val);
                                } else if (type === 'text') {
                                    jquery(key).text(__val);
                                } else if (type === 'html') {
                                    jquery(key).html(__val);
                                } else if (type.indexOf('prop') > -1) {
                                    if (option === '') throw new ExtendError(/EL054613/, null, [this.constructor.name, key]);
                                    else jquery(key).prop(option, __val);
                                } else if (type.indexOf('attr') > -1) {
                                    if (option === '') throw new ExtendError(/EL054614/, null, [this.constructor.name, key]);
                                    else jquery(key).attr(option, __val);
                                } else if (type.indexOf('css') > -1) {
                                    if (option === '') throw new ExtendError(/EL054615/, null, [this.constructor.name, key]);
                                    else jquery(key).css(option, __val);
                                } else {
                                    throw new ExtendError(/EL054616/, null, [this.constructor.name]);
                                }
                            }
                        }
                    }

                    // 검사 및 이벤트 발생 : 타입간 호환성
                    if (_oldVal !== __val && __val) this._onChanged(__val, _oldVal);

                    // // 이벤트 발생
                    // this._onChanged();
                },
                configurable: true,
                enumerable: true
            });

            // 아이템 옵션속성 추가
            if (typeof p_option === 'object' ) {
                for(var prop in p_option) {
                    // POINT: get/setFilter 는 후처리해야함
                    if (p_option.hasOwnProperty(prop) && 
                        ['domType', 'isReadOnly', 'isHide', 'element', 'selector', 'getFilter', 'setFilter'].indexOf(prop) > -1) {
                        this[prop] = p_option[prop];
                    }
                }
            }
            // 기본값 설정
            // this.default = this.default || '';
        }
        Util.inherits(HTMLColumn, _super);
        
        HTMLColumn._UNION = [];
        HTMLColumn._NS = 'Meta.Entity';                                 // namespace
        HTMLColumn._PARAMS = ['columnName', '_entity'];                 // creator parameter        // REVIEW: 통일 시켜야함
        HTMLColumn._VALUE_TYPE = [null, String, Number, Boolean];

        /**
         * HTMLColumn 을 복제합니다.
         * @returns {HTMLColumn}
         */
        HTMLColumn.prototype.clone  = function(p_entity) {
            var clone;
            // var rObj = this.getObject();
            var entity = p_entity ? p_entity : this._entity;

            // var top = _super.prototype.clone.call(this);
            var clone = new HTMLColumn(this.columnName, entity);

            // for(var prop in top) {
            //     if (top.hasOwnProperty(prop)) {
            //         if (top[prop]) clone[prop] = top[prop];
            //     }
            // }
            if (this['default'] !== '') clone.default = this['default'];
            if (this['caption'] !== '') clone.caption = this['caption'];
            if (this['required']) clone.required = this['required'];
            // if (this['optional']) clone.isNullPass = this['optional'];
            if (this['constraints']) clone.constraints = this['constraints'];
            if (this['getter']) clone.getter = this['getter'];
            if (this['setter']) clone.setter = this['setter'];
            if (this['$alias'] !== null) clone.$alias = this['$alias'];
            if (this['$value'] !== null) clone.$value = this['$value'];
            if (this['domType']) clone.domType = this['domType'];
            if (this['isReadOnly']) clone.isReadOnly = this['isReadOnly'];
            if (this['isHide']) clone.isHide = this['isHide'];
            if (this['element']) clone.element = this['element'];
            if (this['selector']) clone.selector = this['selector'];
            if (this['getFilter']) clone.getFilter = this['getFilter'];
            if (this['setFilter']) clone.setFilter = this['setFilter'];

            // if (this.selector) clone.__selector        = this.__selector.concat([]); // 배열 + 함수형
            
            return clone;
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
        HTMLColumn.prototype.getObject = function(p_vOpt, p_owned) {
            var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
            var vOpt = p_vOpt || 0;
            var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

            if (this.domType !== null) obj['domType'] = this.domType;
            if (this.isReadOnly !== false) obj['isReadOnly'] = this.isReadOnly;
            if (this.isHide !== false) obj['isHide'] = this.isHide;
            if (this.element !== null) obj['element'] = this.element;
            if (this.selector !== null) obj['selector'] = this.selector;
            if (this.getFilter !== null) obj['getFilter'] = this.getFilter;
            if (this.setFilter !== null) obj['setFilter'] = this.setFilter;
            // if (this.value !== null) obj['value'] = this.value; // 상위에서 설정함
            return obj;                        
        };

        /**
         * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.   
         * @param {object} p_oGuid guid 타입의 객체
         * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
         * 기본값은 p_oGuid 객체와 동일
         */
        HTMLColumn.prototype.setObject = function(p_oGuid, p_origin) {
            _super.prototype.setObject.call(this, p_oGuid, p_origin);
            
            var origin = p_origin ? p_origin : p_oGuid;
            var entity;

            if (p_oGuid['domType']) this.domType = p_oGuid['domType'];
            if (typeof p_oGuid['isReadOnly'] !== 'undefined') this.isReadOnly = p_oGuid['isReadOnly'];
            if (typeof p_oGuid['isHide'] !== 'undefined') this.isHide = p_oGuid['isHide'];
            if (p_oGuid['element']) this.element = p_oGuid['element'];
            if (p_oGuid['selector']) this.selector = p_oGuid['selector'];
            if (p_oGuid['getFilter']) this.getFilter = p_oGuid['getFilter'];
            if (p_oGuid['setFilter']) this.setFilter = p_oGuid['setFilter'];
        };

        // TODO: 컬럼간 변환 기능
        // HTMLColumn.prototype.toEntityColumn = function() {
        // };

        return HTMLColumn;
    
    }(MetaColumn));

    //==============================================================
    // 4. module export
    if (isNode) exports.HTMLColumn  = HTMLColumn;        // strip:

    // create namespace
    _global._L.Meta                 = _global._L.Meta || {};
    _global._L.Meta.Entity          = _global._L.Meta.Entity || {};
    
    _global._L.HTMLColumn = HTMLColumn;
    _global._L.Meta.Entity.HTMLColumn = HTMLColumn;

}(typeof window !== 'undefined' ? window : global));