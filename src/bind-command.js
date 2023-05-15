/**
 * namespace _L.Meta.Bind.BindCommand
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
    var util;
    var MetaObject;
    var BaseCollection; // TODO: 제거 대상, 사용안함
    var BaseBind;
    var MetaColumn;           // TODO: HTMLColumn 으로 대체 해야함
    var MetaEntity;
    var entityView;
    var MetaView;
    var MetaViewCollection;


    if (typeof module === 'object' && typeof module.exports === 'object') {     
        BaseBind                = require('./bind-base');
        util                    = require('logic-core').Util;
        MetaObject              = require('logic-core').MetaObject;
        BaseCollection          = require('logic-core').BaseCollection;
        MetaColumn                    = require('logic-core').MetaColumn;
        MetaEntity                  = require('logic-core').MetaEntity;
        MetaView              = require('logic-core').MetaView;
        MetaViewCollection    = require('logic-core').MetaViewCollection;
        // util                    = require('./utils');
        // MetaObject              = require('./meta-object');
        // BaseCollection          = require('./collection-base');
        // MetaColumn                    = require('./entity-item').MetaColumn;
        // Entity                  = require('./entity-base');
        // entityView              = require('./entity-view');
        // MetaView              = entityView.MetaView;
        // MetaViewCollection    = entityView.MetaViewCollection;
    } else {
        util                    = global._L.Common.Util;
        MetaObject              = global._L.Meta.MetaObject;
        BaseCollection          = global._L.Collection.BaseCollection;
        BaseBind                = global._L.Meta.Bind.BaseBind;
        MetaEntity                  = global._L.Meta.Entity.MetaEntity;
        MetaView              = global._L.Meta.Entity.MetaView;
        MetaViewCollection    = global._L.Meta.Entity.MetaViewCollection;
        MetaColumn                    = global._L.Meta.Entity.MetaColumn;
    }

    //==============================================================
    // 3. 모듈 의존성 검사
    if (typeof util === 'undefined') throw new Error('[util] module load fail...');
    if (typeof MetaObject === 'undefined') throw new Error('[MetaObject] module load fail...');
    if (typeof BaseCollection === 'undefined') throw new Error('[BaseCollection] module load fail...');
    if (typeof BaseBind === 'undefined') throw new Error('[BaseBind] module load fail...');
    if (typeof MetaEntity === 'undefined') throw new Error('[MetaEntity] module load fail...');
    if (typeof MetaColumn === 'undefined') throw new Error('[MetaColumn] module load fail...');
    if (typeof MetaView === 'undefined') throw new Error('[MetaView] module load fail...');
    if (typeof MetaViewCollection === 'undefined') throw new Error('[MetaViewCollection] module load fail...');

    //==============================================================
    // 4. 모듈 구현    
    var BindCommand  = (function (_super) {
        /**
         * 바인드 명령 (상위)
         * @constructs _L.Meta.Bind.BindCommand
         * @abstract
         * @extends _L.Meta.Bind.BaseBind
         * @param {*} p_bindModel 
         * @param {*} p_baseEntity 
         */
        function BindCommand(p_bindModel, p_baseEntity) {
            _super.call(this);
            
            p_baseEntity = p_baseEntity || p_bindModel._baseEntity;     // 기본값

            /**
             * 모델
             * @protected  
             */
            this._model = p_bindModel;          // 최상위 설정
            /**
             * 기본 요소
             * @protected
             */
            this._baseEntity = p_baseEntity;    // 최상위 설정

            /**
             * 출력 컬렉션
             * @protected
             */
            this._output = new MetaViewCollection(this, this._baseEntity);
            this.addOutput('output');

            var __propagation   = true;

            var __valid     = new MetaView('valid', this._baseEntity);
            var __bind      = new MetaView('bind', this._baseEntity);
            var __etc       = new MetaView('etc', this._baseEntity);

            var __cbValid       = null;
            var __cbBind        = null;
            var __cbResult      = null;
            var __cbEnd         = null;
            var __cbOutput      = null;
            var __outputOption  = 0;     // 0: 제외(edit),  1: View 오버로딩 , 2: 있는자료만 , 3: 존재하는 자료만          

            
            if (p_bindModel && !(p_bindModel instanceof MetaObject && p_bindModel.instanceOf('BindModel'))) {
                throw new Error('Only [p_bindModel] type "BindModel" can be added');
            }
            if (p_baseEntity && !(p_bindModel instanceof MetaObject && p_baseEntity.instanceOf('MetaEntity'))) {
                throw new Error('Only [p_baseEntity] type "MetaEntity" can be added');
            }
            
            /**
             * 이벤트 전파 유무 (기본값 = true)
             * @member {Boolean} _L.Meta.Bind.BindCommand#eventPropagation 
             */
            Object.defineProperty(this, 'eventPropagation', {
                enumerable: true,
                configurable: true,
                set: function(p_bool) {
                    if (typeof p_bool !== 'boolean') throw new Error('Only [p_bool] type "Boolean" can be added');
                    __propagation = p_bool;
                },
                get: function() { return __propagation; }
            }); 
            
            /**
             * 검사대상 MetaView
             * @member {MetaView} _L.Meta.Bind.BindCommand#valid 
             */
            Object.defineProperty(this, 'valid', 
            {
                get: function() { return __valid; },
                set: function(newValue) { 
                    if (!(newValue instanceof MetaView)) throw new Error('Only [valid] type "MetaView" can be added');
                    __valid = newValue;
                },
                configurable: true,
                enumerable: true
            });

            /**
             * 바인드 MetaView
             * @member {MetaView} _L.Meta.Bind.BindCommand#bind 
             */
            Object.defineProperty(this, 'bind', 
            {
                get: function() { return __bind; },
                set: function(newValue) { 
                    if (!(newValue instanceof MetaView)) throw new Error('Only [valid] type "MetaView" can be added');
                    __bind = newValue;
                },
                configurable: true,
                enumerable: true
            });

            /**
             * 기타 MetaView (기타의 용도 : validSelector 외)
             * @member {MetaView} _L.Meta.Bind.BindCommand#etc 
             */
            Object.defineProperty(this, 'etc', 
            {
                get: function() { return __etc; },
                set: function(newValue) { 
                    if (!(newValue instanceof MetaView)) throw new Error('Only [etc] type "MetaView" can be added');
                    __etc = newValue;
                },
                configurable: true,
                enumerable: true
            });
            
            /**
             * 출력(output) 특성
             * 0: 제외(edit),  1: View 오버로딩 , 2: 있는자료만 , 3: 존재하는 자료만 
             * @member {Number} _L.Meta.Bind.BindCommand#outputOption 
             */
            Object.defineProperty(this, 'outputOption', 
            {
                get: function() { return __outputOption; },
                set: function(newValue) { 
                    if (!(typeof newValue === 'number')) throw new Error('Only [outputOption] type "number" can be added');
                    __outputOption = newValue;
                },

                configurable: true,
                enumerable: true
            });

            /**
             * 검사(valid) 전 콜백
             * @member {Function} _L.Meta.Bind.BindCommand#cbValid 
             */
            Object.defineProperty(this, 'cbValid', 
            {
                get: function() { return __cbValid; },
                set: function(newValue) { 
                    if (typeof newValue !== 'function') throw new Error('Only [cbValid] type "Function" can be added');
                    __cbValid = newValue;
                },
                configurable: true,
                enumerable: true
            });

            /**
             * 바인드(bind) 전 콜백
             * @member {Function} _L.Meta.Bind.BindCommand#cbBind
             */
            Object.defineProperty(this, 'cbBind', 
            {
                get: function() { return __cbBind; },
                set: function(newValue) { 
                    if (typeof newValue !== 'function') throw new Error('Only [cbBind] type "Function" can be added');
                    __cbBind = newValue;
                },
                configurable: true,
                enumerable: true
            });

            /**
             * 바인드(bind) 결과 콜백 (주요 : 회신자료의 가공의 역활)
             * @member {Function} _L.Meta.Bind.BindCommand#cbValid 
             */
            Object.defineProperty(this, 'cbResult', 
            {
                get: function() { return __cbResult; },
                set: function(newValue) { 
                    if (typeof newValue !== 'function') throw new Error('Only [cbResult] type "Function" can be added');
                    __cbResult = newValue;
                },
                configurable: true,
                enumerable: true
            });

            /**
             * 바인드 결과 출력 콜백 (주요: 목록의 출력)
             * @member {Function} _L.Meta.Bind.BindCommand#cbOutput 
             */
            Object.defineProperty(this, 'cbOutput', 
            {
                get: function() { return __cbOutput; },
                set: function(newValue) { 
                    if (typeof newValue  !== 'function') throw new Error('Only [cbOutput] type "Function" can be added');
                    __cbOutput = newValue;
                },
                configurable: true,
                enumerable: true
            });
            
            /**
             * 바인드 처리 종료 후 콜백 (주요: 다른 이벤트 또는 명령과의 연결)
             * @member {Function} _L.Meta.Bind.BindCommand#cbEnd 
             */
            Object.defineProperty(this, 'cbEnd', 
            {
                get: function() { return __cbEnd; },
                set: function(newValue) { 
                    if (typeof newValue !== 'function') throw new Error('Only [cbEnd] type "Function" can be added');
                    __cbEnd = newValue;
                },
                configurable: true,
                enumerable: true
            });    

            // 예약어 등록
            this._symbol = this._symbol.concat(['_model', 'eventPropagation']);
            this._symbol = this._symbol.concat(['valid', 'bind']);
            this._symbol = this._symbol.concat(['cbValid', 'cbBind', 'cbResult', 'cbOutput', 'cbEnd']);
            this._symbol = this._symbol.concat(['_output', 'outputOption', 'cbOutput']);
            this._symbol = this._symbol.concat(['execute', '_onExecute', '_onExecuted', 'getTypes', 'add', 'addItem', 'setItem']);
            this._symbol = this._symbol.concat(['addOutput']);
        }
        util.inherits(BindCommand, _super);
    

        /** 
         * 실행 ( valid >> bind >> result >> output >> end )
         * @virtual 
         */
        BindCommand.prototype.execute = function() {
            throw new Error('[ execute() ] Abstract method definition, fail...');
        };

        /**
         * BindCommand의 실행 전 이벤트 
         * @override 
         * @param {BindCommand} p_bindCommand 
         */
        BindCommand.prototype._onExecute = function(p_bindCommand) {
            _super.prototype._onExecute.call(this, p_bindCommand);               // 자신에 이벤트 발생
            
            if (this.eventPropagation) this._model._onExecute(p_bindCommand);    // 모델에 이벤트 추가 발생
        };

        /**
         * BindCommand의 실행 후 이벤트 
         * @override 
         * @param {BindCommand} p_bindCommand 
         * @param {Object} p_result 
         */
        BindCommand.prototype._onExecuted = function(p_bindCommand, p_result) {
            _super.prototype._onExecuted.call(this, p_bindCommand, p_result);
            if (this.eventPropagation) this._model._onExecuted(p_bindCommand, p_result);
        };

        /** 
         * 상속 클래스에서 오버라이딩 필요!!
         * @override  
         */
        // BindCommand.prototype.getTypes  = function() {
                    
        //     var type = ['BindCommand'];
            
        //     return type.concat(typeof _super !== 'undefined' && _super.prototype && _super.prototype.getTypes ? _super.prototype.getTypes() : []);
        // };
        
        /**
         * 아이템을 추가하고 명령과 매핑한다.
         * @param {MetaColumn} p_item 등록할 아이템
         * @param {?(Array<String> | String)} p_views <선택> 추가할 뷰 엔티티
         */
        BindCommand.prototype.add = function(p_item, p_views) {

            var views = [];     // 파라메터 변수
            var property = [];      // 속성
            var collection;

            // 1.유효성 검사
            if (!(p_item instanceof MetaColumn)) {
                throw new Error('Only [p_item] type "MetaColumn" can be added');
            }
            if (typeof p_views !== 'undefined' && (!(Array.isArray(p_views) || typeof p_views === 'string'))) {
                throw new Error('Only [p_views] type "Array | string" can be added');
            } 

            // 2.초기화 설정
            if (Array.isArray(p_views)) views = p_views;
            else if (typeof p_views === 'string') views.push(p_views);
            
            // baseEntity 에 아이템 없으면 등록
            if (!this._baseEntity.columns.contains(p_item))  {
                this._baseEntity.columns.add(p_item);
            }

            // 3.설정 대상 가져오기
            if (views.length > 0) {
                for (var i = 0; i < views.length; i++) {
                    
                    if (typeof views[i] !== 'string') throw new Error('Only [String] type instances can be added');
                   
                    // 속성 유무 검사
                    if (this[views[i]]) {
                        property.push(views[i]);
                    } else {
                        console.warn('Warning!! Param p_views 에 [' + views[i] + ']가 없습니다. ');
                    }
                }
            } else {
                // 공개(public) MetaEntity 프로퍼티 검사
                for (var prop in this) {
                    if (this[prop] instanceof MetaEntity && prop.substr(0, 1) !== '_') {
                        property.push(prop.toString());
                    }
                }
            }

            // 4.컬렉션 추가(등록)
            for (var i = 0; i < property.length; i++) {
                if (this[property[i]] instanceof MetaEntity ){
                    collection = this[property[i]].columns;
                } else {
                    console.warn('Warning!! [' + property[i] + ']속성이 this 에 없습니다. ');
                }
                collection.add(p_item);
            }
        };

        /**
         * p_name으로 아이템을 p_entitys(String | String)에 다중 등록한다.
         * @param {String} p_name
         * @param {Object | String | Number | Boolean} p_value
         * @param {?(Array<String> | String)} p_views <선택> 추가할 뷰 엔티티
         */
        BindCommand.prototype.addItem = function(p_name, p_value, p_views) {

            var item;
            
            // 유효성 검사
            if (typeof p_name !== 'string') {
                throw new Error('Only [p_name] type "string" can be added');
            }

            // 코어 변경에 따른 수정 POINT:
            // item = this._baseEntity.columns.addValue(p_name, p_value);
            if (this._baseEntity.columns.addValue(p_name, p_value)) {
                item = this._baseEntity.columns[p_name];
                this.add(item, p_views);
            } else {
                throw new Error('item added fail');
            }
        };

        /**
         * 예시>
         * e.read.setEntity(['idx', 'addr'], 'valid');
         * @param {String | Array} p_names 아이템명
         * @param {?(String | Array<String>)} p_views 설정할 뷰이름
         */
        BindCommand.prototype.setItem = function(p_names, p_views) {

            var names = [];     // 파라메터 변수
            var itemName;
            var item;

            // 초기화
            if (Array.isArray(p_names)) names = p_names;
            else if (typeof p_names === 'string') names.push(p_names);

            // 유효성 검사
            if (names.length === 0) throw new Error('Only [p_names] type "Array | string" can be added');

            // 아이템 검사 및 등록 함수 this.add(..) 호출
            for(var i = 0; names.length > i; i++) {
                itemName = names[i]; 
                item = this._model._baseEntity.columns[itemName];
                if (typeof item !== 'undefined') {
                    this.add(item, p_views);
                } else {
                    console.warn('baseEntity에 [' + itemName + '] 아이템이 없습니다.');
                }
            }
        };

        /**
         * 대상엔티티에서 해제
         * @param {String | Array} p_names 해제할 아이템명
         * @param {?(String | Array<String>)} p_views 'valid', 'bind', 'output' 해제할 뷰 엔티티 지정
         * @example
         * e.read.release(['idx', 'addr'], 'valid');
         */
        BindCommand.prototype.release = function(p_names, p_views) {

            var names = [];         // 파라메터 변수
            var views = [];      // 파라메터 변수
            var property = [];      // 속성
            var itemName;
            var item;


            // 초기화
            if (Array.isArray(p_names)) names = p_names;
            else if (typeof p_names === 'string') names.push(p_names);

            // 1. 유효성 검사
            if (names.length === 0) throw new Error('Only [p_names] type "Array | string" can be added');
            if (typeof p_views !== 'undefined' && (!(Array.isArray(p_views) || typeof p_views === 'string'))) {
                throw new Error('Only [p_views] type "Array | string" can be added');
            } 

            // 2.초기화 설정
            if (Array.isArray(p_views)) views = p_views;
            else if (typeof p_views === 'string') views.push(p_views);
            
            // 3.설정 대상 가져오기
            if (views.length > 0) {
                for (var i = 0; i < views.length; i++) {
                    
                    if (typeof views[i] !== 'string') throw new Error('Only [String] type instances can be added');
                   
                    // 속성 유무 검사
                    if (this[views[i]]) {
                        property.push(views[i]);
                    } else {
                        console.warn('Warning!! Param p_views 에 [' + views[i] + ']가 없습니다. ');
                    }
                }
            } else {
                // 공개(public) MetaEntity 프로퍼티 검사
                for (var prop in this) {
                    if (this[prop] instanceof MetaEntity && prop.substr(0, 1) !== '_') {
                        property.push(prop.toString());
                    }
                }
            }

            // 아이템 검사 및 아이템 해제
            for(var i = 0; names.length > i; i++) {
                itemName = names[i]; 
                item = this._model._baseEntity.columns[itemName];

                if (typeof item !== 'undefined') {
                    for (var ii = 0; property.length > ii; ii++) {
                        this[property[ii]].columns.remove(item);
                    }

                } else {
                    console.warn('baseEntity에 [' + itemName + '] 아이템이 없습니다.');
                }
            }
        };

        /**
         * 출력에 사용할 엔티티를 추가한다.
         * @param {String} p_name 
         */
        BindCommand.prototype.addOutput = function(p_name) {

            // 유효성 검사
            if (typeof p_name !== 'string') throw new Error('Only [p_name] type "string" can be added');
            
            // 예약어 검사
            if (this._symbol.indexOf(p_name) > -1) {
                throw new Error(' [' + p_name + '] is a Symbol word');   
            }            

            // 이름 중복 검사
            if (typeof this[p_name] !== 'undefined') throw new Error('에러!! 이름 중복 : ' + p_name);

            // this._output.add('default', this._baseEntity);            // 등록방법 2
            this._output.add(new MetaView(p_name, this._baseEntity));  // 등록방법 1
            this[p_name] = this._output[p_name];
        };


        return BindCommand;
    
    }(BaseBind));

    //==============================================================
    // 5. 모듈 내보내기 (node | web)
    if (typeof module === 'object' && typeof module.exports === 'object') {     
        module.exports = BindCommand;
    } else {
        global._L.Meta.Bind.BindCommand = BindCommand;
    }

}(typeof module === 'object' && typeof module.exports === 'object' ? global : window));