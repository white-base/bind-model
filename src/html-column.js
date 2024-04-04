/**** html-column.js | _L.Meta.Entity.HTMLColumn ****/

(function(_global) {
    'use strict';

    var isNode = typeof window !== 'undefined' ? false : true;

    //==============================================================
    // 1. namespace declaration
    _global._L               = _global._L || {};
    _global._L.Meta          = _global._L.Meta || {};
    _global._L.Meta.Entity   = _global._L.Meta.Entity || {};
    
    //==============================================================
    // 2. import module
    if (isNode) {  
        var _Message                    = require('logic-entity').Message;
        var _ExtendError                = require('logic-entity').ExtendError;
        var _Util                       = require('logic-entity').Util;
        var _MetaColumn                 = require('logic-entity').MetaColumn;
        var _jquery;
    } else {
        var $Message                    = _global._L.Message;
        var $ExtendError                = _global._L.ExtendError;
        var $Util                       = _global._L.Util;
        var $MetaColumn                 = _global._L.MetaColumn;
        var $jquery                     = _global.jQuery || _global.$;     // jquery 로딩 REVIEW:: 로딩 확인
    }
    var Message                 = _Message              || $Message;
    var ExtendError             = _ExtendError          || $ExtendError;
    var Util                    = _Util                 || $Util;
    var MetaColumn              = _MetaColumn           || $MetaColumn;
    var jquery                  = _jquery               || $jquery;

    //==============================================================
    // 3. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    if (typeof MetaColumn === 'undefined') throw new Error(Message.get('ES011', ['MetaColumn', 'observer']));
    
    //==============================================================
    // 4. module implementation
    //--------------------------------------------------------------
    // implementation
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
            var selector      = null;

            /**
             * 아이템 DOM 타입
             * @member {*} _L.Meta.Entity.HTMLColumn#domType
             */
            Object.defineProperty(this, 'domType', 
            {
                get: function() { return domType; },
                set: function(newValue) { 
                    // TODO:: 자료종류 {input: {type: 'text'...}} 만들어야함
                    if(typeof newValue !== 'object') throw new Error('Only [domType] type "object" can be added');
                    domType = newValue;
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
                set: function(newValue) { 
                    if(typeof newValue !== 'boolean') throw new Error('Only [isReadOnly] type "boolean" can be added');
                    isReadOnly = newValue;
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
                set: function(newValue) { 
                    if(typeof newValue !== 'boolean') throw new Error('Only [isHide] type "boolean" can be added');
                    isHide = newValue;
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
                set: function(newValue) { 
                    if(typeof newValue !== 'object') throw new Error('Only [element] type "object" can be added');
                    element = newValue;
                },
                configurable: true,
                enumerable: true
            });

            /**
             * 셀렉터
             * @member _L.Meta.Entity.HTMLColumn#selector
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
                set: function(newValue) { 
                    var selector = { key: '', type: 'value' };

                    if (typeof newValue === 'string') {
                        selector.key = newValue;
                    } else if (typeof newValue === 'object' && typeof newValue.key !== 'undefined') {
                        selector = newValue;
                    } else {
                        throw new Error('Only [selector] type "string | object.key" can be added');
                    }
                    selector = selector;
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
                     if(val !== null && typeof val !== 'function') throw new Error('Only [getFilter] type "function" can be added');
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
                      if(val !== null && typeof val !== 'function') throw new Error('Only [setFilter] type "function" can be added');
                      setFilter = val;
                  },
                  configurable: true,
                  enumerable: true
              });

            /**
             * 아이템 값 (오버라이딩)
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
                        if (this.__value !== null && this.__value !== __val) {
                            this._onChanged(__val, this.__value);
                            this.__value = __val;   // 내부에 저장
                        }

                    // 우선순위 : 2
                    // } else if (__selector !== null && __filter === null) {
                    } else if (selector !== null || typeof this.getFilter === 'function') {

                        // node 에서는 강제 종료함
                        if (typeof module !== 'object') {

                            key = this.selector.key;
                            type = this.selector.type;
                            option = type.indexOf('.') > -1 ? type.substr(type.indexOf('.') + 1) : '';
                            
                            if (type !== 'none' &&  type !== ''){
                                if (type === 'value' || type === 'val') {
                                    __val = jQuery(key).val();
                                } else if (type === 'text') {
                                    __val = jQuery(key).text();
                                } else if (type === 'html') {
                                    __val = jQuery(key).html();
                                } else if (type.indexOf('prop') > -1) {
                                    __val = jQuery(key).prop(option);
                                } else if (type.indexOf('attr') > -1) {
                                    __val = jQuery(key).attr(option);
                                } else if (type.indexOf('css') > -1) {
                                    __val = jQuery(key).css(option);
                                } else {
                                    console.warn('['+ key +'] selector의 type는[value, val, text, prop, attr, css, none] 이어야합니다. ');
                                }
                                
                                // selector 검사
                                if (typeof __val === 'undefined' || __val === null) {
                                    console.warn('['+ key +'] ['+ type +'] 일치하는 selector가 없습니다. ');                            
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
                        __val = this.__value;
                    }
                     
                    /**
                     * 분기 처리값 '__val' 없는경우 (null, undefined)
                     *  - this.__value 초기화 되지 않은 경우
                     *  - getter 리턴이 없는 경우
                     *  - node selector 를 사용한 경우
                     *  - selector 매칭값이 없는 경우
                     */
                    if (typeof __val === 'undefined' || __val === null) {
                        __val = this.__value || this.default;  
                    }

                    // Get값과 내부값이 다를경우 값 설정 (내부적으로 change 이벤트 발생함)
                    // if (__val !== this.__value) {
                    //     this.value = __val;
                    // }

                    return __val; 
                },
                set:  function(val) { 
                    var __val, _val, _fVal;
                    var key, type, option;
                    var _oldVal = this.__value;
                    // var _isSetFilter = true;   // selector 설정 여부

                    if (typeof this.setter === 'function' ) _val = this.setter.call(this, val);
                    
                    // settter 의 리턴이 여부
                    if (typeof _val !== 'undefined') __val = _val;
                    else __val = val; 

                    __val = __val === null ? '' : __val;  // null 등록 오류 처리
                    if(['number', 'string', 'boolean'].indexOf(typeof __val) < 0) {
                        throw new Error('Only [value] type "number, string, boolean" can be added');
                    }
                    this.__value = __val;   // 내부에 저장
           
                    if (selector !== null || typeof this.setFilter === 'function') {

                        if (typeof this.setFilter === 'function') {
                            _fVal = this.setFilter.call(this, __val);
                        }
                        
                        // 셀렉터 설정 값 1> 필터값, 2> __value
                        __val = _fVal || __val;

                        // node 에서는 강제 종료함
                        if (typeof module !== 'object') {

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
                            if (type !== 'none' && type !== ''){
                                if (type === 'value' || type === 'val') {
                                    jQuery(key).val(__val);
                                } else if (type === 'text') {
                                    jQuery(key).text(__val);
                                } else if (type === 'html') {
                                    jQuery(key).html(__val);
                                } else if (type.indexOf('prop') > -1) {
                                    jQuery(key).prop(option, __val);
                                } else if (type.indexOf('attr') > -1) {
                                    jQuery(key).attr(option, __val);
                                } else if (type.indexOf('css') > -1) {
                                    jQuery(key).css(option, __val);
                                } else {
                                    console.warn('['+ key +'] selector의 type는[value, val, text, prop, attr, css, none] 이어야합니다. ');
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
            



            //---------------------------------------------------
            // 아이템 옵션속성 추가
            if (typeof p_option === 'object' ) {
                for(var prop in p_option) {
                    if (p_option.hasOwnProperty(prop) && 
                        ['domType', 'isReadOnly', 'isHide', 'element', 'selector', 'getFilter', 'setFilter'].indexOf(prop) > -1) {
                        this[prop] = p_option[prop];
                    }
                }
            }
            // 기본값 설정
            this.default = this.default || '';
        }
        Util.inherits(HTMLColumn, _super);
    
        HTMLColumn._NS = 'Meta.Entity';                                 // namespace
        HTMLColumn._PARAMS = ['columnName', '_entity', '_property'];    // creator parameter        // REVIEW: 통일 시켜야함
        // HTMLColumn._VALUE_TYPE = [String, Number, Boolean];


        /** @override **/
        // HTMLColumn.prototype.getTypes  = function() {
                    
        //     var type = ['HTMLColumn'];
            
        //     return type.concat(typeof _super !== 'undefined' && _super.prototype && _super.prototype.getTypes ? _super.prototype.getTypes() : []);
        // };

        /**
         * 아이템 DOM을 복제한다. 
         * @returns {HTMLColumn}
         */
        HTMLColumn.prototype.clone  = function(p_entity) {
            var clone;
            var rObj = this.getObject();
            var entity = p_entity ? p_entity : this._entity;

            // var top = _super.prototype.clone.call(this);
            var clone = new HTMLColumn(this.columnName, entity);

            // for(var prop in top) {
            //     if (top.hasOwnProperty(prop)) {
            //         if (top[prop]) clone[prop] = top[prop];
            //     }
            // }
            if (rObj['default']) clone.default = rObj['default'];
            if (rObj['caption']) clone.caption = rObj['caption'];
            if (rObj['isNotNull']) clone.isNotNull = rObj['isNotNull'];
            if (rObj['isNullPass']) clone.isNullPass = rObj['isNullPass'];
            if (rObj['constraints']) clone.constraints = rObj['constraints'];
            if (rObj['getter']) clone.getter = rObj['getter'];
            if (rObj['setter']) clone.setter = rObj['setter'];
            if (rObj['alias']) clone.alias = rObj['alias'];
            if (rObj['value']) clone.value = rObj['value'];
            if (rObj['domType']) clone.domType = rObj['domType'];
            if (rObj['isReadOnly']) clone.isReadOnly = rObj['isReadOnly'];
            if (rObj['isHide']) clone.isHide = rObj['isHide'];
            if (rObj['element']) clone.element = rObj['element'];
            if (rObj['selector']) clone.selector = rObj['selector'];
            if (rObj['getFilter']) clone.getFilter = rObj['getFilter'];
            if (rObj['setFilter']) clone.setFilter = rObj['setFilter'];

            // if (this.selector) clone.__selector        = this.__selector.concat([]); // 배열 + 함수형
            
            return clone;
        };

        /**
         * 
         * @param {*} p_vOpt 
         * @param {*} p_owned 
         * @returns 
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
            // if (this.isNotNull !== false) obj['value'] = this.isNotNull; // 상위에서 설정함
            return obj;                        
        };

        HTMLColumn.prototype.setObject = function() {
            // TODO::
        };

        HTMLColumn.prototype.toEntityColumn = function() {
            // TODO::
        };

        return HTMLColumn;
    
    }(MetaColumn));

    //==============================================================
    // 5. module export
    if (isNode) {     
        exports.HTMLColumn                = HTMLColumn;
    } else {
        _global._L.HTMLColumn             = HTMLColumn;
        // namespace
        _global._L.Meta.Entity.HTMLColumn   = HTMLColumn;
    }

}(typeof window !== 'undefined' ? window : global));