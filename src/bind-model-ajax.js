/**** bind-model-ajax.js | _L.Meta.Bind.BindModelAjax ****/

const { PropertyCollection } = require('logic-entity');

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
        var _PropertyCollection         = require('logic-entity').PropertyCollection;
        var _MetaView                   = require('logic-entity').MetaView;
        var _BindModel                  = require('./bind-model').BindModel;
        var _HTMLColumn                 = require('./html-column').HTMLColumn;
        var _BindCommandAjax            = require('./bind-command-ajax').BindCommandAjax;
    } else {
        var $Message                    = _global._L.Message;
        var $ExtendError                = _global._L.ExtendError;
        var $Util                       = _global._L.Util;
        var $PropertyCollection         = _global._L.PropertyCollection;
        var $MetaView                   = _global._L.MetaView;
        var $BindModel                  = _global._L.BindModel;
        var $HTMLColumn                 = _global._L.HTMLColumn;
        var $BindCommandAjax            = _global._L.BindCommandAjax;
    }
    var Message                 = _Message              || $Message;
    var ExtendError             = _ExtendError          || $ExtendError;
    var Util                    = _Util                 || $Util;
    var PropertyCollection      = _PropertyCollection   || $PropertyCollection;
    var MetaView                = _MetaView             || $MetaView;
    var BindModel               = _BindModel            || $BindModel;
    var HTMLColumn              = _HTMLColumn           || $HTMLColumn;
    var BindCommandAjax         = _BindCommandAjax      || $BindCommandAjax;

    //==============================================================
    // 3. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    if (typeof PropertyCollection === 'undefined') throw new Error(Message.get('ES011', ['PropertyCollection', 'collection-property']));
    if (typeof MetaView === 'undefined') throw new Error(Message.get('ES011', ['MetaView', 'meta-view']));    
    if (typeof BindModel === 'undefined') throw new Error(Message.get('ES011', ['BaseEntity', 'base-entity']));
    if (typeof HTMLColumn === 'undefined') throw new Error(Message.get('ES011', ['HTMLColumn', 'html-column']));
    if (typeof BindCommandAjax === 'undefined') throw new Error(Message.get('ES011', ['BindCommandAjax', 'bind-command-ajax']));
    
    //==============================================================
    // 4. module implementation
    //--------------------------------------------------------------
    // implementation
    var BindModelAjax  = (function (_super) {
        /**
         * 바인드모델 Ajax
         * - aaa
         * - bbb
         * @constructs _L.Meta.Bind.BindModelAjax
         * @extends _L.Meta.Bind.BindModel
         * @param {IBindModel} p_service 
         * @param {Object} p_service.baseAjaxSetup Ajax 설정 
         * @param {String} p_service.baseAjaxSetup.url Ajax 설정 
         * @param {String} p_service.baseAjaxSetup.type GET, POST
         * @param {String} p_service.baseUrl 바인딩 경로 
         * @param {Object} p_service.command 명령들
         * @param {Object} p_service.command.name 사용자명령어
         * @param {Function} p_service.command.name.onExecute 실행전 이벤트
         * @param {Object}  p_service.command.name.onExecuted 실행후 이벤트 
         * @example
         * // returns 2
         * _globalNS.method1(5, 10);
         */
        function BindModelAjax(p_service) {
            _super.call(this);

            var baseAjaxSetup = {
                url: '',
                type: 'GET',
                dataType: 'json',
                async: true,
                crossDomain: false,
            };

            /**
             * 바인딩 기본 ajaxSetup 을 설정한다.
             * @member {Object} _L.Meta.Bind.BindModelAjax#baseAjaxSetup
             */
            Object.defineProperty(this, 'baseAjaxSetup', 
            {
                get: function() { return baseAjaxSetup; },
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
                set: function(newValue) { 
                    if (!(_isString(newValue))) throw new Error('Only [baseUrl] type "string" , 공백문자 금지 can be added');
                    baseAjaxSetup.url = newValue;
                },
                configurable: true,
                enumerable: true
            });

            // default set
            this._columnType                    = HTMLColumn;                           // 기본 아이템 타입 변경

            // 객체 등록
            if (_isObject(p_service)) {
                // 서비스 설정
                this.setService(p_service);
            }

            // 예약어 등록
            this.$KEYWORD = ['columns', 'baseAjaxSetup', 'baseUrl'];
            this.$KEYWORD = ['getTypes', 'checkSelector', 'setService'];
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
         * 셀렉터 검사
         * @param {PropertyCollection} [p_collection] 
         */
        BindModelAjax.prototype.checkSelector  = function(p_collection) {
            
            var collection = p_collection || this.items;
            var failSelector = null;
            // var selectors = [];
            var key = '';

            // 유효성 검사
            if (!(collection instanceof PropertyCollection)) throw new Error('Only [p_collection] type "PropertyCollection" can be added');

            // 검사         
            for (var i = 0; collection.count > i; i++) {
                if (_isObject(collection[i].selector)) {
                    key = collection[i].selector.key;

                        if (_isString(key)) failSelector = Util.validSelector(key, true);
                        
                        if (failSelector !== null) {
                            console.warn('selector 검사 실패 : %s ', failSelector);
                            return false;
                        }
                }
            }
            return true;
        };

        /**
         * 셀렉터 검사 결과 얻기
         * @param {?(String | Arrary<String>)} p_cmdNames command 명칭들
         * @param {?Boolean} p_isLog 기본값 true
         * @param {?MetaColumnCollection} p_collection 지정된 컬렉션에서 검사한다.
         * @return {Arrary<Selector>}
         * @example
         * var bm = new BindModelAjax();
         * ...
         * bm.validSelector();           // 전체 셀렉터 목록 리턴
         * bm.validSelector([], true);   // 전체 셀렉터 목록 리턴 및 로그 출력
         * bm.validSelector('list');     // 지정한 단일 command 셀렉터 검사
         * bm.validSelector(['list', 'read'], true);         // 지정한 복수 command 셀렉터 검사
         * bm.validSelector([], true, secondCollection);     // 검사 대상 컬렉션 변경 (this.items)
         * 
         */
         BindModelAjax.prototype.validSelector  = function(p_cmdNames, p_isLog, p_collection) {
            
            p_isLog = typeof p_isLog === 'undefined' || true;

            var collection = p_collection || this.columns;    // TODO: import 및 검사 추가
            var obj;
            var selector;
            var selectors = [];
            var cmds = [];
            var cmdName = '';
            var bindCommand = null;
            var columns = [];
            var item;

            // 초기화
            if (Array.isArray(p_cmdNames)) cmds = p_cmdNames;
            else if (typeof p_cmdNames === 'string') cmds.push(p_cmdNames);
            
            // command의 valid, bind, output item 검색하여 중복 제거후 삽입
            for (var i = 0; cmds.length > i; i++) {
                
                cmdName = cmds[i];              // cmd 이름 얻기
                bindCommand = this[cmdName];    // 대상 bindCommand 설정

                if (typeof bindCommand === 'undefined') {
                    console.warn('[%s] bindCommand가 없습니다.', cmdName);
                } else {
                    
                    for (var prop in bindCommand) {
                        if (bindCommand[prop] instanceof MetaView && 
                                prop.substr(0, 1) !== '_' &&                        // 이름 제외 조건
                                (['valid', 'bind', 'etc'].indexOf(prop) > -1 ||     // 기본 Entity
                                1 < bindCommand.outputOption['option'] )) {                   // 확장 Entity(output)은 옵션 검사
                            
                            for (var ii = 0; bindCommand[prop].columns.count > ii; ii++) {

                                item = bindCommand[prop].columns[ii];
                                if (columns.indexOf(item) < 0) { // 없으면 추가
                                    columns.push(item);
                                }
                            }
                        }
                    }
                }
            }

            for (var i = 0; collection.count > i; i++) {
                
                if (cmds.length > 0) {
                    selector = columns.indexOf(collection[i]) > -1 ? collection[i].selector : null;   // 비교
                } else {
                    selector = collection[i].selector;  // 전체 포함
                }
                
                if (selector !== null && typeof selector === 'object' && typeof selector.key === 'string' && selector.key.length > 0) {
                        obj = { 
                            item: collection[i].name, 
                            key: collection[i].selector.key, 
                            type: collection[i].selector.type,
                            check: Util.validSelector(selector.key, true) === null ? true : false
                        };
                        selectors.push(obj);
                }
            }
            // 정렬
            selectors.sort(function(a, b) {
                if (a.check > b.check) {
                    return 1;
                } else {
                    return -1;
                }
            });
            if (p_isLog === true) {
                for (var i = 0; i < selectors.length > 0; i++ ) {
                    if (selectors[i].check === true) {
                        console.log('item: %s, key: %s, type: %s ', selectors[i].item, selectors[i].key, selectors[i].type);
                    } else {
                        console.warn('item: %s, key: %s, type: %s [Fail]', selectors[i].item, selectors[i].key, selectors[i].type);
                    }
                }
            }
            return selectors;
        };        

        /**
         * 명령 추가
         * @param {*} p_name 
         * @param {*} p_option 
         * @param {*} p_bEntity 기본엔테티
         */
        BindModelAjax.prototype.addCommand  = function(p_name, p_option, p_bEntity) {
            
            var bindCommand;
            
            
            // TODO: 'Array | ALL | all' 에약어 추가해야함
            // 유효성 검사
            if (typeof p_name !== 'string') {
                throw new Error('Only [p_name] type "string" can be added');
            }
            bindCommand = new BindCommandAjax(this, p_option, p_bEntity);
            // TODO: 예약어 검사 추가
            this.command.add(p_name, bindCommand);

            return bindCommand;
        };

        /**
         * 서비스를 설정한다.
         * @param {IBindModel} p_service 서비스객체
         * @param {?Boolean} p_is_readItem 서비스 내의 prop 를 item 으로 로딩힌다. (기본값: true)
         */
         BindModelAjax.prototype.setService  = function(p_service, p_is_readItem) {

            try {  

                _super.prototype.setService.call(this, p_service, p_is_readItem);    // 부모 호출

                // base
                if (typeof p_service['baseUrl'] === 'string') {
                    this.baseUrl = p_service['baseUrl'];
                }
                if (typeof p_service['baseAjaxSetup'] === 'object') {
                    this.baseAjaxSetup = p_service['baseAjaxSetup'];
                }

                for (var prop in p_service) {
                    if (p_service.hasOwnProperty(prop) && this.$KEYWORD.indexOf(prop) < 0) {
                        // 사용자 객체 설정
                        // console.log(prop);
                        this[prop] = p_service[prop];
                    }
                }

            } catch (err) {
                var _err = {
                    name: err.name || 'throw',
                    message: err.message || err,
                    target: err.target || '',
                    stack: err.stack || '',
                };
                this.cbError('Err:setService() message:'+ _err.message);
                if (_global.isLog) {
                    console.error('NAME : '+ _err.name);
                    console.error('MESSAGE : '+ _err.message);
                    console.error('TARGET : '+ JSON.stringify(_err.target));
                    console.error('STACK : '+ _err.stack);
                }
                if (_global.isThrow) throw _err;       // 에러 던지기
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