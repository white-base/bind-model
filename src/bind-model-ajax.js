/**
 * namespace _L.Meta.Bind.BindModelAjax
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
    // var CustomError;
    var BindModel;
    var PropertyCollection;
    var IBindModel;
    var HTMLColumn;
    var BindCommandAjax;
    var MetaView;

    if (typeof module === 'object' && typeof module.exports === 'object') {    
        IBindModel              = require('./i-bind-model');
        BindModel               = require('./bind-model');
        HTMLColumn              = require('./html-column');
        BindCommandAjax         = require('./bind-command-ajax');
        Util                    = require('logic-core').Util;
        // CustomError             = require('logic-core').CustomError;
        PropertyCollection      = require('logic-core').PropertyCollection;
        MetaView                = require('logic-entity').MetaView;
        // BindModel               = require('./bind-model');
        // Util                    = require('./Utils');
        // CustomError             = require('./error-custom');
        // PropertyCollection      = require('./collection-property');
        // IBindModel              = require('./i-bind-model');        
        // HTMLColumn                 = require('./entity-item-dom');
        // BindCommandAjax         = require('./bind-command-ajax');
        // MetaView              = require('./entity-view').MetaView;
    } else {
        Util                    = global._L.Common.Util;
        // CustomError             = global._L.Common.CustomError;
        BindModel               = global._L.Meta.Bind.BindModel;
        PropertyCollection      = global._L.Collection.PropertyCollection;
        IBindModel              = global._L.Interface.IBindModel;        
        HTMLColumn                 = global._L.Meta.Entity.HTMLColumn;
        BindCommandAjax         = global._L.Meta.Bind.BindCommandAjax;
        MetaView              = global._L.Meta.Entity.MetaView;
    }

    //==============================================================
    // 3. 모듈 의존성 검사
    if (typeof Util === 'undefined') throw new Error('[Util] module load fail...');
    // if (typeof CustomError === 'undefined') throw new Error('[CustomError] module load fail...');
    if (typeof BindModel === 'undefined') throw new Error('[BindModel] module load fail...');
    if (typeof PropertyCollection === 'undefined') throw new Error('[PropertyCollection] module load fail...');
    if (typeof IBindModel === 'undefined') throw new Error('[IBindModel] module load fail...');
    if (typeof HTMLColumn === 'undefined') throw new Error('[HTMLColumn] module load fail...');
    if (typeof BindCommandAjax === 'undefined') throw new Error('[BindCommandAjax] module load fail...');
    if (typeof MetaView === 'undefined') throw new Error('[MetaView] module load fail...');

    //==============================================================
    // 4. 모듈 구현    
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
         * globalNS.method1(5, 10);
         * @example
         * // returns 3
         * globalNS.method(5, 15); 
         * 어떤 샘플이 들어....
         * 
         * @summary
         * - aaa : ddd
         * - a-1
         * - ddd
         * - b-1
         * - ccc
         * @desc
         *  바인딩 모델 의 기본 설정
         * - 무엇을 하는가.
         * - 뭐든지 하지요.
         * - 할것
         * - 또할것
         * # ㅁㅁㅁ
         * - ㅇㅇㅇㅇㅇ
         * - ㅉ
         * # ㅉㅈ
         * ㅇㅇㅇㅇㅇ
         * ** 굵게(강조)**
         * ~~취소선~~
         * - aaa
         *  - bbbb
         * + 1111
         *  + 2222
         * 
         * ```javascript
         * var s = 'JavaScript syntax highlighting';
         * alert(s);
         * ``
         * @todo 할것 목록
         * 
         * @tutorial tutorial-1  튜토리얼이 들어있음
         */
        function BindModelAjax(p_service) {
            _super.call(this);

            // 기본값 설정
            var __baseAjaxSetup = {
                url: '',
                type: 'GET',
                dataType: 'json',
                async: true,
                crossDomain: false,
            };
            
            this._baseEntity                = this.addEntity('first');   // Entity 추가 및 baseEntity 설정
            this.itemType                   = HTMLColumn;                   // 기본 아이템 타입 변경
            this._baseEntity.columns.itemType = this.itemType;            // base 엔티티 타입 변경
            this.columns                      = this._baseEntity.columns;   // 참조 추가

            /**
             * 바인딩 기본 ajaxSetup 을 설정한다.
             * @member {Object} _L.Meta.Bind.BindModelAjax#baseAjaxSetup
             */
            Object.defineProperty(this, 'baseAjaxSetup', 
            {
                get: function() { return __baseAjaxSetup; },
                configurable: true,
                enumerable: true
            });

            /**
             * 바인딩 기본 ajaxSetup.url 을 설정한다.
             * @member {String} _L.Meta.Bind.BindModelAjax#baseUrl
             */
            Object.defineProperty(this, 'baseUrl', 
            {
                get: function() { return __baseAjaxSetup.url; },
                set: function(newValue) { 
                    if (!(typeof newValue === 'string')) throw new Error('Only [baseUrl] type "string" can be added');
                    __baseAjaxSetup.url = newValue;
                },
                configurable: true,
                enumerable: true
            });

            // 객체 등록
            if (typeof p_service === 'object') {
                // 서비스 설정
                this.setService(p_service);
            }

            // 예약어 등록
            this._symbol = this._symbol.concat(['columns', 'baseAjaxSetup', 'baseUrl']);
            this._symbol = this._symbol.concat(['getTypes', 'checkSelector', 'setService']);
        }
        Util.inherits(BindModelAjax, _super);
    
        /**
         * 상속 클래스에서 오버라이딩 필요!! *
         * @override
         */
        // BindModelAjax.prototype.getTypes  = function() {
                    
        //     var type = ['BindModelAjax'];
            
        //     return type.concat(typeof _super !== 'undefined' && _super.prototype && _super.prototype.getTypes ? _super.prototype.getTypes() : []);
        // };

        /**
         * 셀렉터 검사
         * @param {?MetaColumnCollection} p_collection 
         */
        BindModelAjax.prototype.checkSelector  = function(p_collection) {
            
            var collection = p_collection || this.prop;
            var failSelector = null;
            var selectors = [];
            var selector = '';

            // 유효성 검사
            if (!(collection instanceof PropertyCollection)) throw new Error('Only [p_collection] type "PropertyCollection" can be added');

            // 검사
            // for (var i = 0; collection.count > i; i++) {
            //     if (typeof collection[i].selector !== 'undefined') {
            //         selectors = [];
            //         if (Array.isArray(collection[i].selector)) 
            //             selectors = collection[i].selector;
            //         else   
            //             selectors.push(collection[i].selector)
                    
            //         for (var ii = 0; ii < selectors.length; ii++) {
            //             selector  = typeof selectors[ii] === 'function' ? selectors[ii].call(this) : selectors[ii];

            //             if (typeof selector === 'string' && selector.length > 0) failSelector = Util.validSelector(selector);
                        
            //             if (failSelector !== null) {
            //                 console.warn('selector 검사 실패 : %s ', failSelector);
            //                 return false;
            //             }
            //         }
            //     }
            // }            
            for (var i = 0; collection.count > i; i++) {
                if (typeof collection[i].selector !== 'undefined') {
                        selector = collection[i].selector.key;

                        if (typeof selector === 'string' && selector.length > 0) failSelector = Util.validSelector(selector, true);
                        
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

                    // // cmds.valid
                    // for (var ii = 0; bindCommand.valid.columns.count > ii; ii++) {
                    //     item = bindCommand.valid.items[ii];
                    //     if (columns.indexOf(item) < 0) { // 없으면 추가
                    //         columns.push(item);
                    //     }
                    // }
                    // // cmds.bind
                    // for (var ii = 0; bindCommand.bind.columns.count > ii; ii++) {
                    //     item = bindCommand.bind.items[ii];
                    //     if (columns.indexOf(item) < 0) { // 없으면 추가
                    //         columns.push(item);
                    //     }
                    // }
                    // // cmds.etc
                    // for (var ii = 0; bindCommand.etc.columns.count > ii; ii++) {
                    //     item = bindCommand.etc.items[ii];
                    //     if (columns.indexOf(item) < 0) { // 없으면 추가
                    //         columns.push(item);
                    //     }
                    // }
                    // //TODO: 전체 output[] 에서 비교해야함
                    // // cmds.output  
                    // for (var ii = 0; bindCommand.output.columns.count > ii; ii++) {
                    //     item = bindCommand.output.items[ii];
                    //     if (columns.indexOf(item) < 0) { // 없으면 추가
                    //         columns.push(item);
                    //     }
                    // }
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
            
            // 유효성 검사
            if (typeof p_name !== 'string') {
                throw new Error('Only [p_name] type "string" can be added');
            }

            // 예약어 검사
            if (this._symbol.indexOf(p_name) > -1) {
                throw new Error(' [' + p_name + '] is a Symbol word');   
            }            
            
            // 중복 검사
            if (typeof this[p_name] !== 'undefined') throw new Error('에러!! 이름 중복 : ' + p_name);

            // 생성 및 이름 설정
            bindCommand = new BindCommandAjax(this, p_option, p_bEntity);
            bindCommand.name = p_name;  // 인스턴스 이름

            this[p_name] = bindCommand;

            return this[p_name];
        };


        /**
         * 서비스를 설정한다.
         * @param {IBindModel} p_service 서비스객체
         * @param {?Boolean} p_isLoadProp 서비스 내의 prop 를 item 으로 로딩힌다. (기본값: true)
         */
         BindModelAjax.prototype.setService  = function(p_service, p_isLoadProp) {

            try {  

                _super.prototype.setService.call(this, p_service, p_isLoadProp);    // 부모 호출

                // base
                if (typeof p_service['baseUrl'] === 'string') {
                    this.baseUrl = p_service['baseUrl'];
                }
                if (typeof p_service['baseAjaxSetup'] === 'object') {
                    this.baseAjaxSetup = p_service['baseAjaxSetup'];
                }

                for (var prop in p_service) {
                    if (p_service.hasOwnProperty(prop) && this._symbol.indexOf(prop) < 0) {
                        // 사용자 객체 설정
                        console.log(prop);
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
                if (global.isLog) {
                    console.error('NAME : '+ _err.name);
                    console.error('MESSAGE : '+ _err.message);
                    console.error('TARGET : '+ JSON.stringify(_err.target));
                    console.error('STACK : '+ _err.stack);
                }
                if (global.isThrow) throw _err;       // 에러 던지기
            }               
        };

        return BindModelAjax;
    
    }(BindModel));
    
    //==============================================================
    // 5. 모듈 내보내기 (node | web)
    if (typeof module === 'object' && typeof module.exports === 'object') {     
        module.exports = BindModelAjax;
    } else {
        global._L.Meta.Bind.BindModelAjax = BindModelAjax;
        global._L.BindModelAjax = BindModelAjax;        // 힌트
    }

}(typeof module === 'object' && typeof module.exports === 'object' ? global : window));