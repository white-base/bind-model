/**** bind-model.js | _L.Meta.Bind.BindModel ****/

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
        var _MetaObject                 = require('logic-entity').MetaObject;
        var _MetaColumn                 = require('logic-entity').MetaColumn;
        var _BaseEntity                 = require('logic-entity').BaseEntity;
        var _PropertyCollection         = require('logic-entity').PropertyCollection;
        var _MetaTable                  = require('logic-entity').MetaTable;
        var _MetaTableCollection        = require('logic-entity').MetaTableCollection;
        var _BaseBind                   = require('./base-bind').BaseBind;
        var _IBindModel                 = require('./i-bind-model').IBindModel;
        var _IModelCallback             = require('./i-model-callback').IModelCallback;
    } else {
        var $Message                    = _global._L.Message;
        var $ExtendError                = _global._L.ExtendError;
        var $Type                       = _global._L.Type;
        var $Util                       = _global._L.Util;
        var $MetaObject                 = _global._L.MetaObject;
        var $MetaColumn                 = _global._L.MetaColumn;
        var $BaseEntity                 = _global._L.BaseEntity;
        var $PropertyCollection         = _global._L.PropertyCollection;
        var $MetaTable                  = _global._L.MetaTable;
        var $MetaTableCollection        = _global._L.MetaTableCollection;
        var $BaseBind                   = _global._L.BaseBind;
        var $IBindModel                 = _global._L.IBindModel;
        var $IModelCallback             = _global._L.IModelCallback;
    }
    var Message                 = _Message              || $Message;
    var ExtendError             = _ExtendError          || $ExtendError;
    var Type                    = _Type                 || $Type;
    var Util                    = _Util                 || $Util;
    var MetaObject              = _MetaObject           || $MetaObject;
    var MetaColumn              = _MetaColumn           || $MetaColumn;
    var BaseEntity              = _BaseEntity           || $BaseEntity;
    var PropertyCollection      = _PropertyCollection   || $PropertyCollection;
    var MetaTable               = _MetaTable            || $MetaTable;
    var MetaTableCollection     = _MetaTableCollection  || $MetaTableCollection;
    var BaseBind                = _BaseBind             || $BaseBind;
    var IBindModel              = _IBindModel           || $IBindModel;
    var IModelCallback          = _IModelCallback       || $IModelCallback;

    //==============================================================
    // 3. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Type === 'undefined') throw new Error(Message.get('ES011', ['Type', 'type']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    if (typeof MetaObject === 'undefined') throw new Error(Message.get('ES011', ['MetaObject', 'meta-object']));
    if (typeof MetaColumn === 'undefined') throw new Error(Message.get('ES011', ['MetaColumn', 'meta-column']));
    if (typeof BaseEntity === 'undefined') throw new Error(Message.get('ES011', ['BaseEntity', 'base-entity']));
    if (typeof PropertyCollection === 'undefined') throw new Error(Message.get('ES011', ['PropertyCollection', 'collection-property']));
    if (typeof MetaTable === 'undefined') throw new Error(Message.get('ES011', ['MetaTable', 'meta-table']));
    if (typeof MetaTableCollection === 'undefined') throw new Error(Message.get('ES011', ['MetaTableCollection', 'meta-table']));
    if (typeof BaseBind === 'undefined') throw new Error(Message.get('ES011', ['BaseBind', 'base-bind']));
    if (typeof IBindModel === 'undefined') throw new Error(Message.get('ES011', ['IBindModel', 'i-bind-model']));
    if (typeof IModelCallback === 'undefined') throw new Error(Message.get('ES011', ['IModelCallback', 'i-model-callback']));

    //==============================================================
    // 4. module implementation
    //--------------------------------------------------------------
    // implementation
    var BindModel  = (function (_super) {
        /**
         * 바인드모델 추상클래스
         * @constructs _L.Meta.Bind.BindModel
         * @abstract
         * @extends _L.Meta.Bind.BaseBind
         */
        function BindModel()  {
            _super.call(this);

            var _tables         = new MetaTableCollection(this);
            // var _mapping        = new PropertyCollection(this);
            var _columnType     = MetaColumn;
            var items           = new PropertyCollection(this);
            var command         = new PropertyCollection(this);
            var fn              = new PropertyCollection(this);

            var cbFail        = function(msg) { console.warn('실패하였습니다. Err:'+ msg); };
            var cbError       = function(msg) { console.error('오류가 발생 하였습니다. Err:'+msg); };
            var cbBaseValid;
            var cbBaseBind ;
            var cbBaseResult;
            var cbBaseOutput;
            var cbBaseEnd;
            
            var preRegister

            var preRegister    = function() {};
            var preCheck       = function() {return true};
            var preReady       = function() {};
            
            // default set
            fn._elemTypes = Function;    // REVIEW: 위치 변경 
            // items._elemTypes = [Object, String, Number, Boolean];    // REVIEW: 특성 제거 했음, 필요시 검사후 삽입

            /**
             * _tables 
             * @member {PropertyCollection} _L.Meta.Bind.BindModel#_tables
             */
            Object.defineProperty(this, '_tables', 
            {
                get: function() { return _tables; },
                set: function(newValue) { 
                    if (!(newValue instanceof MetaTableCollection)) throw new Error('Only [_tables] type "MetaTableCollection" can be added');
                    _tables = newValue;
                },
                configurable: false,
                enumerable: true
            });

            // /**
            //  * mapping 속성
            //  * @member {PropertyCollection} _L.Meta.Bind.BindModel#_mapping
            //  */
            // Object.defineProperty(this, '_mapping', 
            // {
            //     get: function() { return _mapping; },
            //     set: function(newValue) { 
            //         if (!(newValue instanceof PropertyCollection)) throw new Error('Only [_mapping] type "PropertyCollection" can be added');
            //         _mapping = newValue;
            //     },
            //     configurable: true,
            //     enumerable: true
            // });

            /**
             * 아이템 타입을 설정한다.
             * @member {MetaColumn} _L.Meta.Bind.BindModel#_columnType
             */
            Object.defineProperty(this, '_columnType', 
            {
                get: function() { return _columnType; },
                set: function(newValue) { 
                    if (!(Type.isProtoChain(newValue, MetaColumn))) throw new Error('Only [columnType] type "MetaColumn" can be added');
                    _columnType = newValue;
                    // this._baseTable.columns._baseType = newValue;
                },
                configurable: false,
                enumerable: true
            });

            /**
             * items
             * @member {PropertyCollection} _L.Meta.Bind.BindModel#items
             */
            Object.defineProperty(this, 'items', 
            {
                get: function() { return items; },
                set: function(newValue) { // REVIEW: readonly 가 검토 필요
                    if (!(newValue instanceof PropertyCollection)) throw new Error('Only [items] type "PropertyCollection" can be added');
                    items = newValue;
                },
                configurable: false,
                enumerable: true
            });

            /**
             * 바인드모델 함수 (내부함수 + 노출함수)
             * @member {PropertyCollection} _L.Meta.Bind.BindModel#fn
             */
            Object.defineProperty(this, 'fn', 
            {
                get: function() { return fn; },
                set: function(newValue) { 
                    if (!(newValue instanceof PropertyCollection)) throw new Error('Only [fn] type "PropertyCollection" can be added');
                    fn = newValue;
                },
                configurable: false,
                enumerable: true
            });

            /**
             * 바인딩 command 
             * @member {PropertyCollection} _L.Meta.Bind.BindModel#command
             */
            Object.defineProperty(this, 'command', 
            {
                get: function() { return command; },
                set: function(newValue) { 
                    if (!(newValue instanceof PropertyCollection)) throw new Error('Only [command] type "PropertyCollection" can be added');
                    command = newValue;
                },
                configurable: false,
                enumerable: true
            });

            /**
             * 바인딩 cmd = command (별칭)
             * @member {PropertyCollection} _L.Meta.Bind.BindModel#cmd
             */
            Object.defineProperty(this, 'cmd', 
            {
                get: function() { return command; },
                set: function(newValue) { 
                    if (!(newValue instanceof PropertyCollection)) throw new Error('Only [prop] type "PropertyCollection" can be added');
                    command = newValue;
                },
                configurable: false,
                enumerable: true
            });
            
            /**
             * columns = _baseTable.columns
             * @member {PropertyCollection} _L.Meta.Bind.BindModel#columns
             */
            Object.defineProperty(this, 'columns', 
            {
                get: function() { return _isObject(this._baseTable) ? this._baseTable.columns : null; },
                configurable: false,
                enumerable: true
            });

            /**
             * valid 에서 실패시 콜백
             * @member {Funtion} _L.Meta.Bind.BindModel#cbFail
             */
            Object.defineProperty(this, 'cbFail', 
            {
                get: function() { return cbFail; },
                set: function(newValue) { 
                    if (typeof newValue !== 'function') throw new Error('Only [cbFail] type "Function" can be added');
                    cbFail = newValue;
                },
                configurable: false,
                enumerable: true
            });

            /**
             * valid 에서 오류발생시 콜백
             * @member {Funtion} _L.Meta.Bind.BindModel#cbError
             */
            Object.defineProperty(this, 'cbError', 
            {
                get: function() { return cbError; },
                set: function(newValue) { 
                    if (typeof newValue !== 'function') throw new Error('Only [cbError] type "Function" can be added');
                    cbError = newValue;
                },
                configurable: false,
                enumerable: true
            });

            /**
             * 검사(valid)시 기본 콜백 (cbValid 콜백함수가 없을 경우)
             * @member {Funtion} _L.Meta.Bind.BindModel#cbBaseValid
             */
            Object.defineProperty(this, 'cbBaseValid', 
            {
                get: function() { return cbBaseValid; },
                set: function(newValue) { 
                    if (typeof newValue !== 'function') throw new Error('Only [cbBaseValid] type "Function" can be added');
                    cbBaseValid = newValue;
                },
                configurable: false,
                enumerable: true
            });

            /**
             * 바인드(valid)시 기본 콜백 (cbBind 콜백함수가 없을 경우)
             * @member {Funtion} _L.Meta.Bind.BindModel#cbBaseBind
             */
            Object.defineProperty(this, 'cbBaseBind', 
            {
                get: function() { return cbBaseBind; },
                set: function(newValue) { 
                    if (typeof newValue !== 'function') throw new Error('Only [cbBaseBind] type "Function" can be added');
                    cbBaseBind = newValue;
                },
                configurable: false,
                enumerable: true
            });
            
            /**
             * 바인드 결과 수신 기본 콜백 (cbResult 콜백함수가 없을 경우)
             * @member {Funtion} _L.Meta.Bind.BindModel#cbBaseResult
             */
            Object.defineProperty(this, 'cbBaseResult', 
            {
                get: function() { return cbBaseResult; },
                set: function(newValue) { 
                    if (typeof newValue !== 'function') throw new Error('Only [cbBaseResult] type "Function" can be added');
                    cbBaseResult = newValue;
                },
                configurable: false,
                enumerable: true
            });

            /**
             * 출력 기본 콜백 (cbOutput 콜백함수가 없을 경우)
             * @member {Funtion} _L.Meta.Bind.BindModel#cbBaseOutput
             */
            Object.defineProperty(this, 'cbBaseOutput', 
            {
                get: function() { return cbBaseOutput; },
                set: function(newValue) { 
                    if (typeof newValue !== 'function') throw new Error('Only [cbBaseOutput] type "Function" can be added');
                    cbBaseOutput = newValue;
                },
                configurable: false,
                enumerable: true
            });

            /**
             * 실행완료시 기본 콜백 (cbEnd 콜백함수가 없을 경우)
             * @member {Funtion} _L.Meta.Bind.BindModel#cbBaseEnd
             */
            Object.defineProperty(this, 'cbBaseEnd', 
            {
                get: function() { return cbBaseEnd; },
                set: function(newValue) { 
                    if (typeof newValue !== 'function') throw new Error('Only [cbBaseEnd] type "Function" can be added');
                    cbBaseEnd = newValue;
                },
                configurable: false,
                enumerable: true
            });

            /**
             * 초기화시 등록 preRegister
             * @member {Funtion} _L.Meta.Bind.BindModel#preRegister
             */
            Object.defineProperty(this, 'preRegister', 
            {
                get: function() { return preRegister; },
                set: function(newValue) { 
                    if (typeof newValue !== 'function') throw new Error('Only [preRegister] type "Function" can be added');
                    preRegister = newValue;
                },
                configurable: false,
                enumerable: true
            });

            /**
             * 초기화시 검사 preCheck
             * @member {Funtion} _L.Meta.Bind.BindModel#preCheck
             */
            Object.defineProperty(this, 'preCheck', 
            {
                get: function() { return preCheck; },
                set: function(newValue) { 
                    if (typeof newValue !== 'function') throw new Error('Only [preCheck] type "Function" can be added');
                    preCheck = newValue;
                },
                configurable: false,
                enumerable: true
            });

            /**
             * 초기화시 준비 완료 preReady
             * @member {Funtion} _L.Meta.Bind.BindModel#preReady
             */
            Object.defineProperty(this, 'preReady', 
            {
                get: function() { return preReady; },
                set: function(newValue) { 
                    if (typeof newValue !== 'function') throw new Error('Only [preReady] type "Function" can be added');
                    preReady = newValue;
                },
                configurable: false,
                enumerable: true
            });

            // 예약어 등록
            this.$KEYWORD = ['_tables', '_baseTable', '_columnType', 'items', 'fn', 'command', 'cmd', 'columns'];
            this.$KEYWORD = ['cbFail', 'cbError'];
            this.$KEYWORD = ['cbBaseResult', 'cbBaseValid', 'cbBaseBind', 'cbBaseOutput', 'cbBaseEnd'];
            this.$KEYWORD = ['init', 'preRegister', 'preCheck', 'preReady'];
            this.$KEYWORD = ['addColumn', 'addColumnValue', '_readItem', 'setMapping', 'addTable'];
            this.$KEYWORD = ['addCommand', 'setService'];

            Util.implements(BindModel, this);
        }
        Util.inherits(BindModel, _super);

        BindModel._UNION = [IBindModel, IModelCallback];
        BindModel._NS = 'Meta.Bind';
        BindModel._PARAMS = [];
        BindModel._KIND = 'abstract';

        // local function
        function _isString(obj) {    // 공백아닌 문자 여부
            if (typeof obj === 'string' && obj.length > 0) return true;
            return false;
        }

        function _isObject(obj) {
            if (obj !== null && typeof obj === 'object') return true;
            return false;
        }

        function _getTableName(itemName) {
            if (typeof itemName !== 'string') throw new Error('아이템 string 타입이 아닙니다.');
            if (itemName.indexOf('.') > -1) return itemName.split('.')[0];
        }
        
        function _getColumnName(itemName) {
            if (typeof itemName !== 'string') throw new Error('아이템 string 타입이 아닙니다.');
            if (itemName.indexOf('.') > -1) return itemName.split('.')[1];
            else return itemName;
        }

        /**
         * 속성을 baseEntiey 또는 지정 Entity에  등록(로딩)한다.
         * @param {String | Array<String>} [p_prop] 
         * @param {String | MetaTable} [p_bEntity] 기본엔티티 
         */
        BindModel.prototype._readItem = function(p_prop, p_bEntity) {

            var prop = [];
            var entity;
            var propName;

            // 1.초기화
            if (Array.isArray(p_prop)) prop = prop.concat(p_prop);      // Array의 경우
            else if (typeof p_prop === 'string') prop.push(p_prop);       // String의 경우
            else prop = this.items._keys;                             // 없을 경우 (전체 가져옴)


            if (p_bEntity) {
                if (typeof p_bEntity === 'string') entity = this._tables[p_bEntity];   // TODO: isString 으로 겨체
                if (p_bEntity instanceof MetaTable) entity = p_bEntity;
            }
            // entity = p_prop

            // 2.유효성 검사
            if (prop.length == 0) {
                throw new Error('읽을 prop가 존재하지 않습니다.');
            }
            if (!(entity instanceof MetaTable)) {
                throw new Error('등록할 []메타테이블이 존재하지 않습니다.');
            }
            // if (typeof prop !== 'undefined' && (!Array.isArray(p_prop) || typeof p_prop === 'string')) {
            //     throw new Error('Only [p_entities] type "Array | string" can be added');
            // }
            // if (typeof p_bEntity !== 'undefined' && typeof p_bEntity !== 'string') {
            //     throw new Error('Only [p_bEntity] type "string" can be added');
            // }
            // if (typeof p_bEntity !== 'undefined' && typeof this[p_bEntity] === 'undefined') {
            //     throw new Error(' BindModel에 ['+ p_bEntity +']의 Entity가 없습니다. ');
            // }

            // entity = this[p_bEntity] || this._baseTable;

            // 3.속성정보 등록
            for(var i = 0; prop.length > i; i++) {
                propName = prop[i];
                if (propName.indexOf('__') > 0 ) continue; // __이름으로 제외 조건 추가
                if (typeof propName === 'string' && this.items.exist(propName)) {  
                    if(['number', 'string', 'boolean'].indexOf(typeof this.items[propName]) > -1) {
                        entity.columns.addValue(propName, this.items[propName]);
                    } else if (this.items[propName]  !== null && typeof this.items[propName] === 'object'){
                        entity.columns.add(new this._columnType(propName, entity, this.items[propName]))
                    }
                }
            }

            // 4.매핑
            // this.setMapping(this._mapping, p_bEntity);
        };

        /** 
         * 초기화  
         * 내부적으로 preRegister() >>  preCheck() >> preRedy() 실행한다.
         */
        BindModel.prototype.init = function() {
            if (_global.isLog) console.log('[BindModel] init()');
            
            try {

                this.preRegister.call(this, this);
                if (this.preCheck.call(this, this)) {
                    this.preReady.call(this, this)
                }

            } catch (err) {
                var _err = {
                    name: err.name || 'throw',
                    message: err.message || err,
                    target: err.target || '',
                    stack: err.stack || '',
                };
                this.cbError('Err:init() message:'+ _err.message);
                if (_global.isLog) {
                    console.error('NAME : '+ _err.name);
                    console.error('MESSAGE : '+ _err.message);
                    console.error('TARGET : '+ JSON.stringify(_err.target));
                    console.error('STACK : '+ _err.stack);
                }
                if (_global.isThrow) throw _err;       // 에러 던지기
            } 
        };

        // /**
        //  * 전처리 등록
        //  * @param {BindModel} p_bindModel 
        //  */
        // BindModel.prototype.preRegister = function(p_bindModel) {
        //     return this.preRegister.call(this, p_bindModel);
        // };

        // /**
        //  * 전처리 검사
        //  * @param {BindModel} p_bindModel 
        //  */
        // BindModel.prototype.preCheck = function(p_bindModel) {
        //     return this.preCheck.call(this, p_bindModel);
        // };
        
        // /**
        //  * 전처리 준비
        //  * @param {BindModel} p_bindModel 
        //  */
        // BindModel.prototype.preReady = function(p_bindModel) {
        //     return this.preReady.call(this, p_bindModel);
        // };
        
        /**
         * 테이블 등록
         * @param {string} p_name 
         * @returns 
         */
        BindModel.prototype.addTable = function(p_name) {

            var entity;

            // 유효성 검사
            if (typeof p_name !== 'string') throw new Error('Only [p_name] type "string" can be added');
            
            // 예약어 검사
            if (this.$KEYWORD.indexOf(p_name) > -1) {
                throw new Error(' [' + p_name + '] is a Symbol word');   
            }            

            if (this._tables.existTableName(p_name)) throw new Error('에러!! 이름 중복 : ' + p_name);
            
            // 이름 중복 검사
            // if (typeof this[p_name] !== 'undefined') throw new Error('에러!! 이름 중복 : ' + p_name);
            this._tables.add(p_name);
            entity = this._tables[p_name];
            entity.columns._baseType = this._columnType;    // 아이템타입 설정            
            this[p_name] = entity;
            
            return entity;
        }

        /**
         * 컬럼을 추가하고 명령과 매핑한다.
         * @param {MetaColumn} p_item 등록할 아이템
         * @param {?Array<String>} p_cmds <선택> 추가할 아이템 명령
         * @param {?(Array<String> | String)} p_views <선택> 추가할 뷰 엔티티
         * @param {MetaTable} [p_bTable] 추가할 뷰 엔티티
         */
        BindModel.prototype.addColumn = function(p_item, p_cmds, p_views, p_bTable) {
            var cmds = [];
            var property = [];      // 속성
            var entity;

            // 1.유효성 검사
            if (!(p_item instanceof MetaColumn)) {
                throw new Error('Only [p_item] type "MetaColumn" can be added');
            }
            if (typeof p_cmds !== 'undefined' && p_cmds !== null && (!(Array.isArray(p_cmds) || typeof p_cmds === 'string'))) {
                throw new Error('Only [a_cmd] type "Array | string" can be added');
            }
            
            // 2.초기화 설정
            if (Array.isArray(p_cmds)) cmds = p_cmds;
            else if (typeof p_cmds === 'string' && p_cmds.length > 0) cmds.push(p_cmds);
            entity = p_bTable || this._baseTable;
            
            // 3.설정 대상 가져오기
            if (cmds.length > 0) {
                for (var i = 0; i< cmds.length; i++) {
                    
                    if (typeof cmds[i] !== 'string') throw new Error('Only [String] type instances can be added');
                    
                    // if (this[cmds[i]]) {
                    if (this.command.exist(cmds[i])) {
                        property.push(cmds[i]);
                    } else {
                        console.warn('Warning!! Param p_cmds 에 [' + cmds[i] + ']가 없습니다. ');
                    }
                }
            } else {
                property = this.command._keys;
                // for (var )
                // public MetaColumnCollection 프로퍼티 검사
                // for (var prop in this) {
                //     if (this[prop] instanceof MetaObject && this[prop].instanceOf('BindCommand') && prop.substr(0, 1) !== '_') {
                //         property.push(prop.toString());
                //     }
                // }
            }
            // 4.설정(등록) OR item 등록
            if (typeof p_cmds === 'undefined') {
                entity.columns.add(p_item); // 기본(_baseTable)엔티티만 등록
                // this._baseTable.columns.add(p_item); // 기본(_baseTable)엔티티만 등록
            } else {
                for (var i = 0; i < property.length; i++) {
                    this.command[property[i]].addColumn(p_item, p_views, entity);
                    // this[property[i]].add(p_item, p_views);
                }
            }
        };

        /**
         * p_name으로 아이템을 p_views(String | String)에 다중 등록한다.
         * @param {String} p_name
         * @param {Object | String | Number | Boolean} p_obj 
         * @param {?Array<String>} p_cmds <선택> 추가할 아이템 명령
         * @param {string | string[]} [p_views] <선택> 추가할 뷰 엔티티
         * @param {?String} p_bEntity 대상 기본 엔티티 
         */
        BindModel.prototype.addColumnValue = function(p_name, p_obj, p_cmds, p_views, p_bEntity) {
            var item;
            var property = {};
            var entity;
            var tableName;
            var columnName;            

            // 유효성 검사
            if (typeof p_name !== 'string') {
                throw new Error('Only [p_name] type "string" can be added');
            }

            columnName = _getColumnName(p_name);
            tableName = _getTableName(p_name);

            if (tableName) {
                entity = this._tables[tableName];
            } else entity = this._tables[p_bEntity] || this._baseTable;

            if (typeof p_obj === 'object') {
                property = p_obj;
            } else {
                property = { value: p_obj };
            }
            
            item = new this._columnType(columnName, null, property);    // TODO: 파라메터 일반화 요구됨

            this.addColumn(item, p_cmds, p_views, entity);
        };



        /**
         * 아이템을 매핑한다.
         * @param {ProperyCollection | Object} p_mapping MetaColumn 에 매핑할 객체 또는 컬렉션
         * @param {?String} p_bEntity 대상 기본 엔티티 
         */
        BindModel.prototype.setMapping = function(p_mapping, p_bEntity) {
            var mappingCollection;
            var entity;
            var propName;
            var tableName;
            var columnName;
            var item;
            

            // 1.유효성 검사
            if (!(p_mapping instanceof PropertyCollection || typeof p_mapping === 'object')) {
                throw new Error('Only [p_mapping] type "PropertyCollection | object" can be added');
            }
            if (typeof p_bEntity !== 'undefined' && typeof p_bEntity !== 'string') {
                throw new Error('Only [p_bEntity] type "string" can be added');
            }
            if (typeof p_bEntity !== 'undefined' && typeof this[p_bEntity] === 'undefined') {
                throw new Error(' BindModel에 ['+ p_bEntity +']의 Entity가 없습니다. ');
            }

            entity = this._tables[p_bEntity] || this._baseTable;


            // 2. 임시 매핑 컬렉션에 등록
            if (p_mapping instanceof PropertyCollection) {
                mappingCollection = p_mapping;
            } else if (typeof p_mapping === 'object') {
                mappingCollection = new PropertyCollection();
                for(var prop in p_mapping) {
                    if (p_mapping.hasOwnProperty(prop) && typeof p_mapping[prop] !== 'undefined') {
                        mappingCollection.add(prop, p_mapping[prop]);
                    }
                }
            }

            // POINT:
            // 3. 매핑에 존재하고, 아이템에 존재하고, 컬럼에 추가
            // this._readItem()
            for(var i = 0; mappingCollection.count > i; i++) {
                propName = mappingCollection.keyOf(i);
                columnName = _getColumnName(propName);
                tableName = _getTableName(propName);
                if (tableName) {
                    entity = this._tables[tableName];
                } else entity = this._tables[p_bEntity] || this._baseTable;

                if (!entity.columns.exist(columnName)) {
                    if (this.items.exist(columnName)) {
                        this._readItem(columnName, entity);
                    } else {
                        throw new Error('매핑할려는 ['+columnName+']이 columns 와 items 에 존재하지 않습니다.');
                    }
                }
            }

            // 3. 아이템 매핑
            for(var i = 0; mappingCollection.count > i; i++) {
                propName = mappingCollection.keyOf(i);
                columnName = _getColumnName(propName);
                tableName = _getTableName(propName);
                if (tableName) {
                    entity = this._tables[tableName];
                } else entity = this._tables[p_bEntity] || this._baseTable;

                item = entity.columns[columnName];
                if (typeof item !== 'undefined') {
                    for (var prop in mappingCollection[i]) {    // command 조회
                        if (prop === 'Array') {          // 'Array' 전체 등록 속성 추가
                            for (var ii = 0; ii < this.command.count; ii++) {
                                this.command[ii].addColumn(item, mappingCollection[i][prop], entity);
                            }
                            // this.addColumn(item, [], mappingCollection[i][prop]);
                        } else if (mappingCollection[i].hasOwnProperty(prop)) {
                            this.command[prop].addColumn(item, mappingCollection[i][prop], entity);
                            // this.addColumn(item, prop, mappingCollection[i][prop]);
                        }
                    }
                } else {
                    console.warn('entity에 지정된 [%s] BindCommand 가 없습니다. ');
                }
            }

            // TODO: local 로 이동 필요


        };

        /**
         * 명령 추가 (추상클래스) 상속하여 구현해야 함
         * @abstract
         * @param {String} p_name 
         * @param {?Number} p_option 
         * @param {?Entity} p_entities 
         */
        BindModel.prototype.addCommand  = function(p_name, p_option, p_entities) {

            throw new Error('[ execute() ] Abstract method definition, fail...');
        };

        /**
         * 서비스를 설정한다.
         * @param {IBindModel} p_service 서비스객체
         * @param {?Boolean} p_is_readItem 서비스 내의 prop 를 item 으로 로딩힌다. (기본값: true)
         */
        BindModel.prototype.setService  = function(p_service, p_is_readItem) {

            var propObject;
            var propSubObject;
            var command;
            var tables = [];
            var mapping = new PropertyCollection(this);

            p_is_readItem = p_is_readItem || true;       // 기본값

            // 유효성 검사
            if (typeof p_service !== 'object') throw new Error('Only [p_service] type "object" can be added');

            // tables 등록
            if (p_service['tables']) {
                if (Array.isArray(p_service['tables'])) tables = p_service['tables'];
                else if (typeof p_service['tables'] === 'string') tables.push(p_service['tables']);
                else throw new Error('서비스 tables 타입은 string[], string 만 가능합니다.');
                for (var i = 0; i < tables.length; i++) {
                    this.addTable(tables[i]);
                }
            }
            
            // command 등록
            if (typeof p_service['command'] !== 'undefined' && p_service['items'] !== null) {
                propObject = p_service['command'];
                for(var prop in propObject) {
                    if (propObject.hasOwnProperty(prop) && typeof propObject[prop] !== 'undefined') {

                        // 예약어 검사
                        if (this.$KEYWORD.indexOf(prop) > -1) {
                            throw new Error(' [' + prop + '] is a Symbol word');   
                        }            

                        // 중복 검사
                        // if (typeof this[prop] !== 'undefined') throw new Error('에러!! command 이름 중복 : ' + prop);

                        // command 등록 및 설정
                        command = this.addCommand(prop);
                        if (typeof propObject[prop]['outputOption']) command['outputOption'] = propObject[prop]['outputOption'];  // TODO: ['블럭으로 감싸야함']
                        if (typeof propObject[prop]['ajaxSetup'] === 'object')    command.ajaxSetup = propObject[prop]['ajaxSetup'];
                        if (typeof propObject[prop]['url'] === 'string')          command.url = propObject[prop]['url'];
                        if (typeof propObject[prop]['onExecute'] === 'function')  command.onExecute = propObject[prop]['onExecute'];
                        if (typeof propObject[prop]['onExecuted'] === 'function') command.onExecuted = propObject[prop]['onExecuted'];
                        if (typeof propObject[prop]['cbValid'] === 'function')    command.cbValid = propObject[prop]['cbValid'];
                        if (typeof propObject[prop]['cbBind'] === 'function')     command.cbBind = propObject[prop]['cbBind'];
                        if (typeof propObject[prop]['cbResult'] === 'function')   command.cbResult = propObject[prop]['cbResult'];
                        if (typeof propObject[prop]['cbOutput'] === 'function')   command.cbOutput = propObject[prop]['cbOutput'];
                        if (typeof propObject[prop]['cbEnd'] === 'function')      command.cbEnd = propObject[prop]['cbEnd'];
                    }
                }
            }
            
            // prop 등록
            if (typeof p_service['items'] !== 'undefined' && p_service['items'] !== null) {
                propObject = p_service['items'];
                for(var prop in propObject) {
                    if (propObject.hasOwnProperty(prop) && typeof propObject[prop] !== 'undefined') {
                        //__prop.add(prop, propObject[prop]);
                        // get/sett 형식의 기능 추가        REVIEW:: 확인필요 get/set 의 필요성, 중복 및 혼선의 이슈
                        if (typeof propObject[prop] === 'object' 
                            && (typeof propObject[prop].get === 'function' || typeof propObject[prop].set === 'function')) {
                            this.items.add(prop, '', propObject[prop]);    
                        } else {
                            this.items.add(prop, propObject[prop]);
                        }
                    }
                }
            }
            
            // fn 등록
            if (typeof p_service['fn'] !== 'undefined' && p_service['fn'] !== null) {
                propObject = p_service['fn'];
                for(var prop in propObject) {
                    if (propObject.hasOwnProperty(prop) && typeof propObject[prop] !== 'undefined') {
                        this.fn.add(prop, propObject[prop]);
                    }
                }
            }

            if (typeof p_service['mapping'] !== 'undefined' && p_service['mapping'] !== null) {
                propObject = p_service['mapping'];
                for(var prop in propObject) {
                    if (propObject.hasOwnProperty(prop) && typeof propObject[prop] !== 'undefined') {
                        mapping.add(prop, propObject[prop]);
                        // this._mapping.add(prop, propObject[prop]);
                    }
                }
            }

            // pre 메소드 등록
            if (typeof p_service['preRegister'] === 'function') {
                this.preRegister = p_service['preRegister'];
            }
            if (typeof p_service['preCheck'] === 'function') {
                this.preCheck = p_service['preCheck'];
            }
            if (typeof p_service['preReady'] === 'function') {
                this.preReady = p_service['preReady'];
            }
            
            // fail, error 등록
            if (typeof p_service['cbFail'] === 'function') {
                this.cbFail = p_service['cbFail'];
            }
            if (typeof p_service['cbError'] === 'function') {
                this.cbError = p_service['cbError'];
            }
            
            // base 등록
            if (typeof p_service['cbBaseValid'] === 'function') {
                this.cbBaseValid = p_service['cbBaseValid'];
            }
            if (typeof p_service['cbBaseBind'] === 'function') {
                this.cbBaseBind = p_service['cbBaseBind'];
            }
            if (typeof p_service['cbBaseResult'] === 'function') {
                this.cbBaseResult = p_service['cbBaseResult'];
            }
            if (typeof p_service['cbBaseOutput'] === 'function') {
                this.cbBaseOutput = p_service['cbBaseOutput'];
            }
            if (typeof p_service['cbBaseEnd'] === 'function') {
                this.cbBaseEnd = p_service['cbBaseEnd'];
            }

            // execute 이벤트 등록
            if (typeof p_service['onExecute'] === 'function') {
                this.onExecute = p_service['onExecute'];    // 복수 등록
            }
            if (typeof p_service['onExecuted'] === 'function') {
                this.onExecuted = p_service['onExecuted'];  // 복수 등록
            }
            
            // service  등록
            if (typeof p_service['service'] === 'object') {
                this.service = p_service['service'];
            }

            // 서비스에 onwer bindModel 설정
            p_service.bindModel = this;

            // 속성(prop)을 아이템으로 로딩 ('__'시작이름 제외)
            // if (p_is_readItem === true) {   // REVIEW: 필요성 유무, 아이템을 별도로 안불러올 이유가?
            //     this._readItem();
            // }
            this.setMapping(mapping);
            // this.setMapping(this._mapping);
        };

        return BindModel;
    
    }(BaseBind));
    

    //==============================================================
    // 5. module export
    if (isNode) {     
        exports.BindModel                = BindModel;
    } else {
        _global._L.BindModel             = BindModel;
        // namespace
        _global._L.Meta.Bind.BindModel   = BindModel;
    }

}(typeof window !== 'undefined' ? window : global));