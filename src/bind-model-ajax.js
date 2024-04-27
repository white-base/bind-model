/**** bind-model-ajax.js | _L.Meta.Bind.BindModelAjax ****/

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
        var _Type                       = require('logic-entity').Type;
        var _Util                       = require('logic-entity').Util;
        var _PropertyCollection         = require('logic-entity').PropertyCollection;
        // var _MetaView                   = require('logic-entity').MetaView;
        var _IAjaxService               = require('./i-service-ajax').IAjaxService;
        var _BindModel                  = require('./bind-model').BindModel;
        var _HTMLColumn                 = require('./html-column').HTMLColumn;
        var _BindCommandAjax            = require('./bind-command-ajax').BindCommandAjax;
    } else {
        var $Message                    = _global._L.Message;
        var $ExtendError                = _global._L.ExtendError;
        var $Type                       = _global._L.Type;
        var $Util                       = _global._L.Util;
        var $PropertyCollection         = _global._L.PropertyCollection;
        var $IAjaxService               = _global._L.IAjaxService;
        // var $MetaView                   = _global._L.MetaView;
        var $BindModel                  = _global._L.BindModel;
        var $HTMLColumn                 = _global._L.HTMLColumn;
        var $BindCommandAjax            = _global._L.BindCommandAjax;
    }
    var Message                 = _Message              || $Message;
    var ExtendError             = _ExtendError          || $ExtendError;
    var Type                    = _Type                 || $Type;
    var Util                    = _Util                 || $Util;
    var PropertyCollection      = _PropertyCollection   || $PropertyCollection;
    // var MetaView                = _MetaView             || $MetaView;
    var IAjaxService            = _IAjaxService         || $IAjaxService;
    var BindModel               = _BindModel            || $BindModel;
    var HTMLColumn              = _HTMLColumn           || $HTMLColumn;
    var BindCommandAjax         = _BindCommandAjax      || $BindCommandAjax;

    //==============================================================
    // 3. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Type === 'undefined') throw new Error(Message.get('ES011', ['Type', 'type']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    if (typeof PropertyCollection === 'undefined') throw new Error(Message.get('ES011', ['PropertyCollection', 'collection-property']));
    // if (typeof MetaView === 'undefined') throw new Error(Message.get('ES011', ['MetaView', 'meta-view']));    
    if (typeof IAjaxService === 'undefined') throw new Error(Message.get('ES011', ['IAjaxService', 'i-service-ajax']));
    if (typeof BindModel === 'undefined') throw new Error(Message.get('ES011', ['BindModel', 'base-entity']));
    if (typeof HTMLColumn === 'undefined') throw new Error(Message.get('ES011', ['HTMLColumn', 'html-column']));
    if (typeof BindCommandAjax === 'undefined') throw new Error(Message.get('ES011', ['BindCommandAjax', 'bind-command-ajax']));
    
    //==============================================================
    // 4. module implementation
    //--------------------------------------------------------------
    // implementation
    var BindModelAjax  = (function (_super) {
        /**
         * 바인드모델 Ajax
         * @constructs _L.Meta.Bind.BindModelAjax
         * @extends _L.Meta.Bind.BindModel
         * @param {IBindModel} [p_service] 서비스 객체
         */
        function BindModelAjax(p_service) {
            _super.call(this);

            var $service;
            var baseAjaxSetup = {
                url: '',
                type: 'GET',
                dataType: 'json',
                async: true,
                crossDomain: false,
                complete: null      // 완료 콜백
            };

            /**
             * 별칭 내부값
             * @member {string | number | boolean} _L.Meta.Bind.BindModelAjax#$service
             * @readonly
             * @private
             */
            Object.defineProperty(this, '$service',
            {
                get: function() { return $service; },
                set: function(nVal) { $service = nVal; },
                configurable: false,
                enumerable: false,
            });

            /**
             * 바인딩 기본 ajaxSetup 을 설정한다.
             * @member {Object} _L.Meta.Bind.BindModelAjax#baseAjaxSetup
             */
            Object.defineProperty(this, 'baseAjaxSetup', 
            {
                get: function() { return baseAjaxSetup; },
                set: function(nVal) { 
                    if (typeof nVal === 'object') {
                        if (typeof nVal['url'] === 'string')            baseAjaxSetup['url'] = nVal['url'];
                        if (typeof nVal['type'] === 'string')           baseAjaxSetup['type'] = nVal['type'];
                        if (typeof nVal['dataType'] === 'string')       baseAjaxSetup['dataType'] = nVal['dataType'];
                        if (typeof nVal['async'] === 'boolean')         baseAjaxSetup['async'] = nVal['async'];
                        if (typeof nVal['crossDomain'] === 'boolean')   baseAjaxSetup['crossDomain'] = nVal['crossDomain'];
                        if (typeof nVal['complete'] === 'function')     ajaxSetup['complete'] = nVal['complete'];
                    } else throw new Error('Only [baseAjaxSetup] type "number | object {....}" can be added');
                },
                configurable: true,
                enumerable: true
            });

            /**
             * 바인딩 기본 ajaxSetup.url 을 설정한다.
             * @member {String} _L.Meta.Bind.BindModelAjax#baseUrl
             */
            Object.defineProperty(this, 'baseUrl', 
            {
                get: function() { return baseAjaxSetup.url; },
                set: function(nVal) { 
                    if (!(_isString(nVal))) throw new Error('Only [baseUrl] type "string" , 공백문자 금지 can be added');
                    baseAjaxSetup.url = nVal;
                },
                configurable: true,
                enumerable: true
            });

            // default set
            this._columnType                    = HTMLColumn;                           // 기본 아이템 타입 변경

            // 객체 등록
            if (_isObject(p_service)) {
                // 서비스 설정
                this.$service = p_service;
                this.setService(p_service);
            }

            // 예약어 등록
            this.$KEYWORD = ['$service', 'baseAjaxSetup', 'baseUrl'];
            this.$KEYWORD = ['getSelector', 'checkSelector'];
        }
        Util.inherits(BindModelAjax, _super);
    
        BindModelAjax._UNION = [];
        BindModelAjax._NS = 'Meta.Bind';
        BindModelAjax._PARAMS = ['$service'];

        // local function
        function _isString(obj) {    // 공백아닌 문자 여부
            if (typeof obj === 'string' && obj.length > 0) return true;
            return false;
        }

        function _isObject(obj) {
            if (obj !== null && typeof obj === 'object') return true;
            return false;
        }

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
        BindModelAjax.prototype.getObject = function(p_vOpt, p_owned) {
            var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
            var vOpt = p_vOpt || 0;
            var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

            obj['$service']         = this.$service;
            obj['baseAjaxSetup']    = this.baseAjaxSetup;

            return obj;                        
        };

        /**
         * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.   
         * @param {object} p_oGuid guid 타입의 객체
         * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
         * 기본값은 p_oGuid 객체와 동일
         */
        BindModelAjax.prototype.setObject  = function(p_oGuid, p_origin) {
            _super.prototype.setObject.call(this, p_oGuid, p_origin);
            
            var origin = p_origin ? p_origin : p_oGuid;

            this.$service       = p_oGuid['$service'];
            this.baseAjaxSetup  = p_oGuid['baseAjaxSetup'];
        };     
        
        /**
         * 셀렉터 검사
         * @param {PropertyCollection} [p_collection] 공백시 items.selector 검사
         * @returns {string[]} 빈 배열이면 성공
         */
        BindModelAjax.prototype.checkSelector  = function(p_collection, p_viewLog) {
            var collection = p_collection || this.items;
            var arrFail = [];
            var key;
            // var selectors = [];

            // 유효성 검사
            if (!(collection instanceof PropertyCollection)) throw new Error('Only [p_collection] type "PropertyCollection" can be added');

            // 검사         
            for (var i = 0; collection.count > i; i++) {
                if (_isObject(collection[i].selector)) {
                    key = collection[i].selector.key;

                    if (!_isString(key) || !Util.validSelector(key)) {
                        arrFail.push(key);
                        if (p_viewLog) console.warn('selector 검사 실패 : %s ', key);
                    }
                }
            }
            return arrFail;
        };

        /**
         * 셀렉터 검사
         * @param {PropertyCollection} [p_collection] 공백시 items.selector 검사
         * @returns {string[]} 전체 selector 
         */
        BindModelAjax.prototype.getSelector  = function(p_collection) {
            var collection = p_collection || this.items;
            var arrSelector = [];
            var key;

            // 유효성 검사
            if (!(collection instanceof PropertyCollection)) throw new Error('Only [p_collection] type "PropertyCollection" can be added'); 

            // 검사         
            for (var i = 0; collection.count > i; i++) {
                if (_isObject(collection[i].selector)) {    
                    arrSelector.push(collection[i].selector);
                }
            }
            return arrSelector;
        };

        /**
         * 명령 추가
         * @param {*} p_name 
         * @param {*} p_option 
         * @param {*} p_bEntity 기본엔테티
         */
        BindModelAjax.prototype.addCommand  = function(p_name, p_option, p_bEntity) {
            var bindCommand;
            
            // 유효성 검사
            if (!_isString(p_name)) throw new Error('Only [p_name] type "string" can be added');

            bindCommand = new BindCommandAjax(this, p_option, p_bEntity);
            this.command.add(p_name, bindCommand);

            return bindCommand;
        };

        /**
         * 서비스를 설정한다.
         * @param {IBindModel} p_service 서비스객체
         * @param {boolean} [p_passTypeChk=false] 서비스객체 type 검사 통과 유무
         */
         BindModelAjax.prototype.setService  = function(p_service, p_passTypeChk) {
             try {
                _super.prototype.setService.call(this, p_service, true);    // 부모 호출

                var InterfaceTypeCheck = 1;
                 
                if (!p_passTypeChk) Type.matchType(IAjaxService, p_service, InterfaceTypeCheck);

                // base
                if (typeof p_service['baseUrl'] === 'string') {
                    this.baseUrl = p_service['baseUrl'];
                }
                if (typeof p_service['baseAjaxSetup'] === 'object') {
                    this.baseAjaxSetup = p_service['baseAjaxSetup'];
                }

                // 사용자 서비스 객체 설정
                for (var prop in p_service) {
                    if (p_service.hasOwnProperty(prop) && this.$KEYWORD.indexOf(prop) < 0) {
                        // console.log(prop);
                        this[prop] = p_service[prop];
                    }
                }

            // TODO: ExtendError 로 교체
            } catch (error) {
                throw new Error('서비스 객체 실패 '+ error)
            }               
        };

        return BindModelAjax;
    
    }(BindModel));
    
    //==============================================================
    // 5. module export
    if (isNode) {     
        exports.BindModelAjax               = BindModelAjax;
    } else {
        _global._L.BindModelAjax            = BindModelAjax;
        // namespace
        _global._L.Meta.Bind.BindModelAjax  = BindModelAjax;
    }

}(typeof window !== 'undefined' ? window : global));