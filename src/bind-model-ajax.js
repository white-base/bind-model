/**** bind-model-ajax.js | _L.Meta.Bind.BindModelAjax ****/
(function(_global) {
    'use strict';

    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    if (isNode) {                                                                           // strip:
        var _Message                    = require('./message-wrap').Message;                // strip:
        var _ExtendError                = require('logic-entity').ExtendError;              // strip:
        var _Type                       = require('logic-entity').Type;                     // strip:
        var _Util                       = require('./util-wrap').Util;                      // strip:
        var _PropertyCollection         = require('logic-entity').PropertyCollection;       // strip:
        var _IAjaxService               = require('./i-service-ajax').IAjaxService;         // strip:
        var _BindModel                  = require('./bind-model').BindModel;                // strip:
        var _HTMLColumn                 = require('./html-column').HTMLColumn;              // strip:
        var _BindCommandAjax            = require('./bind-command-ajax').BindCommandAjax;   // strip:
    }                                                                                       // strip:
    var $Message                    = _global._L.Message;               // modify:
    var $ExtendError                = _global._L.ExtendError;           // modify:
    var $Type                       = _global._L.Type;                  // modify:
    var $Util                       = _global._L.Util;                  // modify:
    var $PropertyCollection         = _global._L.PropertyCollection;    // modify:
    var $IAjaxService               = _global._L.IAjaxService;          // modify:
    var $BindModel                  = _global._L.BindModel;             // modify:
    var $HTMLColumn                 = _global._L.HTMLColumn;            // modify:
    var $BindCommandAjax            = _global._L.BindCommandAjax;       // modify:

    var Message                 = _Message              || $Message;                        // strip:
    var ExtendError             = _ExtendError          || $ExtendError;                    // strip:
    var Type                    = _Type                 || $Type;                           // strip:
    var Util                    = _Util                 || $Util;                           // strip:
    var PropertyCollection      = _PropertyCollection   || $PropertyCollection;             // strip:
    var IAjaxService            = _IAjaxService         || $IAjaxService;                   // strip:
    var BindModel               = _BindModel            || $BindModel;                      // strip:
    var HTMLColumn              = _HTMLColumn           || $HTMLColumn;                     // strip:
    var BindCommandAjax         = _BindCommandAjax      || $BindCommandAjax;                // strip:

    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Type) throw new Error(Message.get('ES011', ['Type', 'type']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    if (!PropertyCollection) throw new Error(Message.get('ES011', ['PropertyCollection', 'collection-property']));
    if (!IAjaxService) throw new Error(Message.get('ES011', ['IAjaxService', 'i-service-ajax']));
    if (!BindModel) throw new Error(Message.get('ES011', ['BindModel', 'base-entity']));
    if (!HTMLColumn) throw new Error(Message.get('ES011', ['HTMLColumn', 'html-column']));
    if (!BindCommandAjax) throw new Error(Message.get('ES011', ['BindCommandAjax', 'bind-command-ajax']));
    
    //==============================================================
    // 3. module implementation
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
            var baseConfig = {
                url: '',
                method: 'GET',
                responseType: 'json'
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
             * 바인딩 기본 config 을 설정한다.
             * @member {Object} _L.Meta.Bind.BindModelAjax#baseConfig
             */
            Object.defineProperty(this, 'baseConfig', 
            {
                get: function() { return baseConfig; },
                set: function(nVal) { 
                    if (typeof nVal === 'object') {
                        if (typeof nVal['url'] === 'string') baseConfig['url'] = nVal['url'];
                        if (typeof nVal['baseURL'] === 'string') baseConfig['baseURL'] = nVal['baseURL'];
                        if (typeof nVal['method'] === 'string') baseConfig['method'] = nVal['method'];
                        if (typeof nVal['responseType'] === 'string') baseConfig['responseType'] = nVal['responseType'];
                        for (var prop in nVal) {
                            if (prop === 'url' || prop === 'method' || prop === 'responseType') continue;
                            baseConfig[prop] = nVal[prop];
                        }
                    } else throw new ExtendError(/EL06151/, null, [this.constructor.name]);
                },
                configurable: true,
                enumerable: true
            });

            /**
             * 바인딩 기본 config.url 을 설정한다.
             * @member {String} _L.Meta.Bind.BindModelAjax#url
             */
            Object.defineProperty(this, 'url', 
            {
                get: function() { return baseConfig.url; },
                set: function(nVal) { 
                    if (!(_isString(nVal))) throw new ExtendError(/EL06152/, null, [this.constructor.name]);
                    baseConfig.url = nVal;
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
            this.$KEYWORD = ['$service', 'baseConfig', 'url'];
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
            obj['baseConfig']    = this.baseConfig;

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
            this.baseConfig  = p_oGuid['baseConfig'];
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

            // 유효성 검사
            if (!(collection instanceof PropertyCollection)) throw new ExtendError(/EL06153/, null, []);

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
         * 셀렉터 목록
         * @param {PropertyCollection} [p_collection] 공백시 items.selector 검사
         * @returns {string[]} 전체 selector 
         */
        BindModelAjax.prototype.getSelector  = function(p_collection) {
            var collection = p_collection || this.items;
            var arrSelector = [];

            // 유효성 검사
            if (!(collection instanceof PropertyCollection)) throw new ExtendError(/EL06154/, null, []);

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
         * @param {string} p_name 
         * @param {number} [p_option] 
         * @param {string | MetaTable} [p_bTable] 기본테이블
         */
        BindModelAjax.prototype.addCommand  = function(p_name, p_option, p_bTable) {
            var bindCommand;
            var table;
            
            try {
                // 유효성 검사
                if (!_isString(p_name)) throw new ExtendError(/EL06155/, null, [typeof p_name]);

                if (_isString(p_bTable)) table = this._tables[p_bTable];
                else table = p_bTable || this._baseTable;

                bindCommand = new BindCommandAjax(this, p_option, table);
                this.command.add(p_name, bindCommand);

                return bindCommand;
            } catch (error) {
                throw new ExtendError(/EL06156/, error, []);
            }
        };

        /**
         * 서비스를 설정한다.
         * @param {IBindModel} p_service 서비스객체
         * @param {boolean} [p_passTypeChk=false] 서비스객체 type 검사 통과 유무
         */
         BindModelAjax.prototype.setService  = function(p_service, p_passTypeChk) {
             var InterfaceTypeCheck = 1;

             try {

                _super.prototype.setService.call(this, p_service, true);    // 부모 호출
                 
                if (!p_passTypeChk) Type.matchType(IAjaxService, p_service, InterfaceTypeCheck);

                // base
                if (typeof p_service['baseConfig'] === 'object') {
                    this.baseConfig = p_service['baseConfig'];
                }
                if (typeof p_service['url'] === 'string') {
                    this.url = p_service['url'];
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
                throw new ExtendError(/EL06157/, error, []);
            }               
        };

        return BindModelAjax;
    
    }(BindModel));
    
    //==============================================================
    // 4. module export
    if (isNode) exports.BindModelAjax   = BindModelAjax;      // strip:

    // create namespace
    _global._L.Meta                     = _global._L.Meta || {};
    _global._L.Meta.Bind                = _global._L.Meta.Bind || {};

    _global._L.BindModelAjax = BindModelAjax;
    _global._L.Meta.Bind.BindModelAjax = BindModelAjax;

}(typeof window !== 'undefined' ? window : global));