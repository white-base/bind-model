/**** bind-model.js | _L.Meta.Bind.BindModel ****/
(function(_global) {
    'use strict';

    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    if (isNode) {                                                                       // strip:
        var _Message                    = require('logic-entity').Message;              // strip:
        var _ExtendError                = require('logic-entity').ExtendError;          // strip:
        var _Type                       = require('logic-entity').Type;                 // strip:
        var _Util                       = require('logic-entity').Util;                 // strip:
        var _MetaRegistry               = require('logic-entity').MetaRegistry;         // strip:
        var _MetaColumn                 = require('logic-entity').MetaColumn;           // strip:
        var _PropertyCollection         = require('logic-entity').PropertyCollection;   // strip:
        var _MetaTable                  = require('logic-entity').MetaTable;            // strip:
        var _MetaTableCollection        = require('logic-entity').MetaTableCollection;  // strip:
        var _IBindModel                 = require('./i-bind-model').IBindModel;         // strip:
        var _IModelCallback             = require('./i-model-callback').IModelCallback; // strip:
        var _IService                   = require('./i-service').IService;              // strip:
        var _BaseBind                   = require('./base-bind').BaseBind;              // strip:
    }                                                                                   // strip:
        
    var $Message                    = _global._L.Message;               // modify:
    var $ExtendError                = _global._L.ExtendError;           // modify:
    var $Type                       = _global._L.Type;                  // modify:
    var $Util                       = _global._L.Util;                  // modify:
    var $MetaRegistry               = _global._L.MetaRegistry;          // modify:
    var $MetaColumn                 = _global._L.MetaColumn;            // modify:
    var $PropertyCollection         = _global._L.PropertyCollection;    // modify:
    var $MetaTable                  = _global._L.MetaTable;             // modify:
    var $MetaTableCollection        = _global._L.MetaTableCollection;   // modify:
    var $IBindModel                 = _global._L.IBindModel;            // modify:
    var $IModelCallback             = _global._L.IModelCallback;        // modify:
    var $IService                   = _global._L.IService;              // modify:
    var $BaseBind                   = _global._L.BaseBind;              // modify:
    
    var Message                 = _Message              || $Message;                    // strip:
    var ExtendError             = _ExtendError          || $ExtendError;                // strip:
    var Type                    = _Type                 || $Type;                       // strip:
    var Util                    = _Util                 || $Util;                       // strip:
    var MetaRegistry            = _MetaRegistry         || $MetaRegistry;               // strip:
    var MetaColumn              = _MetaColumn           || $MetaColumn;                 // strip:
    var PropertyCollection      = _PropertyCollection   || $PropertyCollection;         // strip:
    var MetaTable               = _MetaTable            || $MetaTable;                  // strip:
    var MetaTableCollection     = _MetaTableCollection  || $MetaTableCollection;        // strip:
    var IBindModel              = _IBindModel           || $IBindModel;                 // strip:
    var IModelCallback          = _IModelCallback       || $IModelCallback;             // strip:
    var IService                = _IService             || $IService;                   // strip:
    var BaseBind                = _BaseBind             || $BaseBind;                   // strip:

    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Type) throw new Error(Message.get('ES011', ['Type', 'type']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    if (!MetaRegistry) throw new Error(Message.get('ES011', ['MetaRegistry', 'meta-registry']));
    if (!MetaColumn) throw new Error(Message.get('ES011', ['MetaColumn', 'meta-column']));
    if (!PropertyCollection) throw new Error(Message.get('ES011', ['PropertyCollection', 'collection-property']));
    if (!MetaTable) throw new Error(Message.get('ES011', ['MetaTable', 'meta-table']));
    if (!MetaTableCollection) throw new Error(Message.get('ES011', ['MetaTableCollection', 'meta-table']));
    if (!IBindModel) throw new Error(Message.get('ES011', ['IBindModel', 'i-bind-model']));
    if (!IModelCallback) throw new Error(Message.get('ES011', ['IModelCallback', 'i-model-callback']));
    if (!IService) throw new Error(Message.get('ES011', ['IService', 'i-service']));
    if (!BaseBind) throw new Error(Message.get('ES011', ['BaseBind', 'base-bind']));

    //==============================================================
    // 3. module implementation
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
            var _columnType     = MetaColumn;
            var items           = new PropertyCollection(this);
            var command         = new PropertyCollection(this);
            var fn              = new PropertyCollection(this);

            var cbFail        = function(msg, valid) { console.warn('실패하였습니다. Err:'+ msg); };
            var cbError       = function(msg, status, response) { console.error('오류가 발생 하였습니다. Err: '+ msg); };
            var cbBaseBegin;
            var cbBaseValid;
            var cbBaseBind ;
            var cbBaseResult;
            var cbBaseOutput;
            var cbBaseEnd;
            
            var preRegister    = function() {};
            var preCheck       = function() {return true};
            var preReady       = function() {};
            
            var DEFALUT_TABLE_NAME = 'first';
            
            // items._elemTypes = [Object, String, Number, Boolean];    // REVIEW: 특성 제거 했음, 필요시 검사후 삽입

            /**
             * _tables 
             * @member {PropertyCollection} _L.Meta.Bind.BindModel#_tables
             */
            Object.defineProperty(this, '_tables', 
            {
                get: function() { return _tables; },
                set: function(nVal) { 
                    if (!(nVal instanceof MetaTableCollection)) throw new Error('Only [_tables] type "MetaTableCollection" can be added');
                    _tables = nVal;
                },
                configurable: false,
                enumerable: true
            });

            /**
             * 아이템 타입을 설정한다.
             * @member {MetaColumn} _L.Meta.Bind.BindModel#_columnType
             */
            Object.defineProperty(this, '_columnType', 
            {
                get: function() { return _columnType; },
                set: function(nVal) { 
                    if (!(Type.isProtoChain(nVal, MetaColumn))) throw new Error('Only [columnType] type "MetaColumn" can be added');
                    _columnType = nVal;
                    for (var i = 0; i < this._tables.count; i++) {
                        this._tables[i].columns._baseType = nVal;
                    }
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
                set: function(nVal) { // REVIEW: readonly 가 검토 필요
                    if (!(nVal instanceof PropertyCollection)) throw new Error('Only [items] type "PropertyCollection" can be added');
                    items = nVal;
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
                set: function(nVal) { 
                    if (!(nVal instanceof PropertyCollection)) throw new Error('Only [fn] type "PropertyCollection" can be added');
                    fn = nVal;
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
                set: function(nVal) { 
                    if (!(nVal instanceof PropertyCollection)) throw new Error('Only [command] type "PropertyCollection" can be added');
                    command = nVal;
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
                get: function() { return this.command; },
                set: function(nVal) { this.command = nVal; },
                configurable: false,
                enumerable: true
            });
            
            /**
             * columns = _baseTable.columns
             * @member {PropertyCollection} _L.Meta.Bind.BindModel#columns
             */
            Object.defineProperty(this, 'columns', 
            {
                get: function() { return this._baseTable.columns; },
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
                set: function(nVal) { 
                    if (typeof nVal !== 'function') throw new Error('Only [cbFail] type "Function" can be added');
                    cbFail = nVal;
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
                set: function(nVal) { 
                    if (typeof nVal !== 'function') throw new Error('Only [cbError] type "Function" can be added');
                    cbError = nVal;
                },
                configurable: false,
                enumerable: true
            });

            /**
             * 검사(valid)시 기본 콜백 (cbBegin 콜백함수가 없을 경우)
             * @member {Funtion} _L.Meta.Bind.BindModel#cbBaseBegin
             */
            Object.defineProperty(this, 'cbBaseBegin', 
            {
                get: function() { return cbBaseBegin; },
                set: function(nVal) { 
                    if (typeof nVal !== 'function') throw new Error('Only [cbBaseBegin] type "Function" can be added');
                    cbBaseBegin = nVal;
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
                set: function(nVal) { 
                    if (typeof nVal !== 'function') throw new Error('Only [cbBaseValid] type "Function" can be added');
                    cbBaseValid = nVal;
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
                set: function(nVal) { 
                    if (typeof nVal !== 'function') throw new Error('Only [cbBaseBind] type "Function" can be added');
                    cbBaseBind = nVal;
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
                set: function(nVal) { 
                    if (typeof nVal !== 'function') throw new Error('Only [cbBaseResult] type "Function" can be added');
                    cbBaseResult = nVal;
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
                set: function(nVal) { 
                    if (typeof nVal !== 'function') throw new Error('Only [cbBaseOutput] type "Function" can be added');
                    cbBaseOutput = nVal;
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
                set: function(nVal) { 
                    if (typeof nVal !== 'function') throw new Error('Only [cbBaseEnd] type "Function" can be added');
                    cbBaseEnd = nVal;
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
                set: function(nVal) { 
                    if (typeof nVal !== 'function') throw new Error('Only [preRegister] type "Function" can be added');
                    preRegister = nVal;
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
                set: function(nVal) { 
                    if (typeof nVal !== 'function') throw new Error('Only [preCheck] type "Function" can be added');
                    preCheck = nVal;
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
                set: function(nVal) { 
                    if (typeof nVal !== 'function') throw new Error('Only [preReady] type "Function" can be added');
                    preReady = nVal;
                },
                configurable: false,
                enumerable: true
            });

            // default set
            this.fn._elemTypes  = Function;    // REVIEW: 위치 변경 
            this._baseTable     = this.addTable(DEFALUT_TABLE_NAME);    // Entity 추가 및 baseEntity 설정
            // this._columnType    = MetaColumn;                           // 기본 아이템 타입 변경

            // 예약어 등록
            this.$KEYWORD = ['_tables', '_baseTable', '_columnType', 'items', 'fn', 'command', 'cmd', 'columns'];
            this.$KEYWORD = ['cbFail', 'cbError'];
            this.$KEYWORD = ['cbBaseBegin', 'cbBaseValid', 'cbBaseBind', 'cbBaseResult', 'cbBaseOutput', 'cbBaseEnd'];
            this.$KEYWORD = ['init', 'preRegister', 'preCheck', 'preReady'];
            this.$KEYWORD = ['addColumnValue', '_readItem', 'setMapping', 'addTable'];
            this.$KEYWORD = ['addCommand', 'setService'];
            this.$KEYWORD = DEFALUT_TABLE_NAME;

            Util.implements(BindModel, this);       // strip:
        }
        Util.inherits(BindModel, _super);

        BindModel._UNION    = [IBindModel, IModelCallback];
        BindModel._NS       = 'Meta.Bind';
        BindModel._PARAMS   = [];
        BindModel._KIND     = 'abstract';

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
            var tName = '';
            if (itemName.indexOf('.') > -1) tName = itemName.split('.')[0];
            return tName;
        }
        
        function _getColumnName(itemName) {
            var cName;
            if (itemName.indexOf('.') > -1) cName = itemName.split('.')[1];
            else cName = itemName;
            if (!_isString(cName)) throw new Error('컬럼 이름 형식이 다릅니다. ');
            return cName;
        }

        function _isAllCommandName(p_cmdName) {
            // if (['all', 'array'].indexOf(p_cmdName.toLowerCase()) > -1 ) return true;
            if (p_cmdName.toLowerCase() === '$all') return true;
            return false;
        };

        /**
         * 지정한 item 또는 전체 items 목록을 기본 MetaTable 에 등록합니다.(기존에 등록되 있으면 통과)
         * @param {string | string[]} p_items 읽을 아이템
         * @param {string | MetaTable} [p_bEntity=_baseTable] 기본 엔티티 
         */
        BindModel.prototype._readItem = function(p_items, p_bEntity) {
            var items = [];
            var table;
            var itemName;
            var tableName;
            var columnName;            

            // 1. 초기화
            if (Array.isArray(p_items)) items = items.concat(p_items);
            else if (_isString(p_items)) items.push(p_items);
            else  throw new Error('p_items 타입 string | string[] 이 아닙니다. 전체는 [] 빈배열 입니다. ');
    
            if (items.length === 0) items = this.items._keys;   // 없을 경우 (전체 가져옴)

            // 2. 속성정보 등록
            for(var i = 0; items.length > i; i++) {
                itemName    = items[i];
                columnName  = _getColumnName(itemName);
                tableName   = _getTableName(itemName);
                
                if (tableName) table = this._tables[tableName];
                else if (_isString(p_bEntity)) table = this._tables[p_bEntity];
                else  table = p_bEntity || this._baseTable;

                //3. 메타테이블 유효성 검사
                if (!table) throw new Error(' 대상이름의 table가 존재하지않습니다.');
                if (!(table instanceof MetaTable)) throw new Error('table이 MetaTable 이 아닙니다.');

                if (columnName.indexOf('__') > -1 ) continue; // __이름으로 제외 조건 추가 TODO: 아이템명 조건 별도 함수로 분리
                if(['number', 'string', 'boolean'].indexOf(typeof this.items[itemName]) > -1) { 
                    table.columns.addValue(columnName, this.items[itemName]);
                } else if (_isObject(this.items[itemName])){
                    table.columns.add(new this._columnType(columnName, table, this.items[itemName]));
                } else throw new Error('아이템 타입은 생성할 수 없습니다.');
            }
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
        BindModel.prototype.getObject = function(p_vOpt, p_owned) {
            var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
            var vOpt = p_vOpt || 0;
            var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

            obj['_tables']      = this._tables.getObject(vOpt, owned);
            obj['_columnType']  = this._columnType;
            obj['fn']           = this.fn.getObject(vOpt, owned);
            obj['command']      = this.command.getObject(vOpt, owned);

            obj['cbFail']       = this.cbFail;
            obj['cbError']      = this.cbError;
            obj['cbBaseBegin']  = this.cbBaseBegin;
            obj['cbBaseValid']  = this.cbBaseValid;
            obj['cbBaseBind']   = this.cbBaseBind;
            obj['cbBaseResult'] = this.cbBaseResult;
            obj['cbBaseOutput'] = this.cbBaseOutput;
            obj['cbBaseEnd']    = this.cbBaseEnd;
            obj['preRegister']  = this.preRegister;
            obj['preCheck']     = this.preCheck;
            obj['preReady']     = this.preReady;
            // _tables (내부)에 존재하는 경우 참조로, 독립적으로 사용하는 추가함
            if (MetaRegistry.hasGuidObject(this._baseTable, owned)) {
                obj['_baseTable'] = MetaRegistry.createReferObject(this._baseTable);
            } else obj['_baseTable'] = this._baseTable.getObject(vOpt, owned);

            return obj;                        
        };

        /**
         * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.   
         * @param {object} p_oGuid guid 타입의 객체
         * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
         * 기본값은 p_oGuid 객체와 동일
         */
        BindModel.prototype.setObject  = function(p_oGuid, p_origin) {
            _super.prototype.setObject.call(this, p_oGuid, p_origin);
            
            var origin = p_origin ? p_origin : p_oGuid;

            this._tables.setObject(p_oGuid['_tables'], origin);
            this._columnType = p_oGuid['_columnType'];
            this.fn.setObject(p_oGuid['fn'], origin);
            this.command.setObject(p_oGuid['command'], origin);
            
            this.cbFail         = p_oGuid['cbFail'];
            this.cbError        = p_oGuid['cbError'];
            if (typeof p_oGuid['cbBaseBegin'] === 'function')   this.cbBaseBegin = p_oGuid['cbBaseBegin'];
            if (typeof p_oGuid['cbBaseValid'] === 'function')   this.cbBaseValid = p_oGuid['cbBaseValid'];
            if (typeof p_oGuid['cbBaseBind'] === 'function')    this.cbBaseBind = p_oGuid['cbBaseBind'];
            if (typeof p_oGuid['cbBaseResult'] === 'function')  this.cbBaseResult = p_oGuid['cbBaseResult'];
            if (typeof p_oGuid['cbBaseOutput'] === 'function')  this.cbBaseOutput = p_oGuid['cbBaseOutput'];
            if (typeof p_oGuid['cbBaseEnd'] === 'function')     this.cbBaseEnd = p_oGuid['cbBaseEnd'];
            this.preRegister    = p_oGuid['preRegister'];
            this.preCheck       = p_oGuid['preCheck'];
            this.preReady       = p_oGuid['preReady'];

            if (MetaRegistry.isGuidObject(p_oGuid['_baseTable'])) {
                var obj = MetaRegistry.createMetaObject(p_oGuid['_baseTable'], origin);
                obj.setObject(p_oGuid['_baseTable'], origin);
                this._baseTable = obj;
                
            } else if (p_oGuid['_baseTable']['$ref']) {
                var meta = MetaRegistry.findSetObject(p_oGuid['_baseTable']['$ref'], origin);
                if (!meta) throw new Error('_baseTable.ref $set 조회가 실패 했습니다.');
                this._baseTable = meta;
            
            } else throw new Error('setObject 실패, _baseTable 이 존재하지 않습니다.');
        };        

        /** 
         * 전처리 콜백함수를 호출합니다.  
         * 실행순서 : preRegister() >>  preCheck(): boolean  >> preRedy()
         */
        BindModel.prototype.init = function() {
            try {
                this.preRegister.call(this, this);
                if (this.preCheck.call(this, this)) {
                    this.preReady.call(this, this);
                }

            } catch (err) {
                this.cbError('Err:init() message:'+ err.message);
            } 
        };
        
        /**
         * 메타테이블을 생성하고, 지정한 테이블 이름을 속성으로 등록합니다.
         * @param {string} p_name 테이블명
         * @returns {MetaTable} 등록한 메타테이블
         */
        BindModel.prototype.addTable = function(p_name) {
            var table;

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
            table = this._tables[p_name];
            table.columns._baseType = this._columnType;    // 아이템타입 설정            
            this[p_name] = table;
            
            return table;
        }

        /**
         * 컬럼을 추가하고 지정테이블에 추가하고, 컬럼의 참조를 BindCommand 의 valid, bind, output MetaView 에 등록합니다.
         * @param {string | MetaColumn} p_column 등록할 아이템
         * @param {string | string[]} [p_cmds]  추가할 아이템 명령, [] 입력시 전체 command 선택됨
         * @param {string | string[]} [p_views] 추가할 뷰 엔티티
         * @param {string | MetaTable} [p_bTable] 메타테이블
         */
        BindModel.prototype.addColumn = function(p_column, p_cmds, p_views, p_bTable) {
            var cmds = [];
            var command = [];
            var table;
            var column;

            // 1. 유효성 검사
            if (!(p_column instanceof MetaColumn || _isString(p_column))) {
                throw new Error('Only [p_column] type "string | MetaColumn" can be added');
            }
            if (typeof p_cmds !== 'undefined' && p_cmds !== null && (!(Array.isArray(p_cmds) || _isString(p_cmds)))) {
                throw new Error('Only [a_cmd] type "Array | string" can be added');
            }

            // 2. 초기값 설정
            if (Array.isArray(p_cmds)) cmds = p_cmds;
            else if (_isString(p_cmds)) cmds.push(p_cmds);

            if (_isString(p_bTable)) table = this._tables[p_bTable];
            else table = p_bTable || this._baseTable;

            if (!(table instanceof MetaTable)) {
                throw new Error('메타 테이블이 존재하지 않습니다. ');
            }
            if (_isString(p_column)) column = new this._columnType(p_column, table)
            else column = p_column;
            
            // 3. command 확인
            if (typeof p_cmds !== 'undefined' && cmds.length > 0) {
                for (var i = 0; i< cmds.length; i++) {
                    if (typeof cmds[i] !== 'string') throw new Error('Only [String] type instances can be added');
                    
                    if (this.command.exist(cmds[i]))  command.push(cmds[i]);
                    else throw new Error(' Param p_cmds 에 [' + cmds[i] + ']가 없습니다. ');
                }
            } else if (typeof p_cmds !== 'undefined') {
                command = this.command._keys;
            }

            // 4. 컬럼 등록 및 조회
            column = table.columns[table.columns.add(column)];

            // 5. command 에 컬럼 등록
            for (var i = 0; i < command.length; i++) {
                // this.command[command[i]].addColumn(column, p_views, table);
                this.command[command[i]].setColumn(column.columnName, p_views, table);
            }
        };

        /**
         * 지정한 이름으로 컬럼과 값을 추가하고, 컬럼의 참조를 BindCommand 의 valid, bind, output MetaView 에 등록합니다.
         * @param {string} p_name
         * @param {object | string | number | boolean} p_value 
         * @param {string[]} [p_cmds] <선택> 추가할 아이템 명령
         * @param {string | string[]} [p_views] <선택> 추가할 뷰 엔티티
         * @param {string | MetaTable} [p_bEntity] 대상 기본 엔티티 
         */
        BindModel.prototype.addColumnValue = function(p_name, p_value, p_cmds, p_views, p_bEntity) {
            var column;
            var property = {};
            var table;
            var tableName;
            var columnName;            

            // 유효성 검사
            if (typeof p_name !== 'string') {
                throw new Error('Only [p_name] type "string" can be added');
            }

            columnName = _getColumnName(p_name);
            tableName = _getTableName(p_name);

            if (tableName) table = this._tables[tableName];
            else if (_isString(p_bEntity)) table = this._tables[p_bEntity];
            else table = p_bEntity || this._baseTable;

            if (!(table instanceof MetaTable)) {
                throw new Error('메타 테이블이 존재하지 않습니다. ');
            }

            if (_isObject(p_value)) property = p_value;
            else property = { value: p_value };
            
            column = new this._columnType(columnName, table, property);  // REVIEW: 파라메터 일반화 요구됨

            this.addColumn(column, p_cmds, p_views, table);
        };

        /**
         * 매핑객체를 BindModel 객체에 설정합니다.
         * @param {ProperyCollection | object} p_mapping MetaColumn 에 매핑할 객체 또는 컬렉션
         * @param {string | MetaTable} [p_bEntity=_baseTable] 대상 기본 엔티티 
         */
        BindModel.prototype.setMapping = function(p_mapping, p_bEntity) {
            var mappingCollection;
            // var itemsCollection;
            var table;
            var itemName;
            var tableName;
            var columnName;
            var column;
            
            // TODO: try 감싸야함
            
            // 1.유효성 검사
            if (!(p_mapping instanceof PropertyCollection || typeof p_mapping === 'object')) {
                throw new Error('Only [p_mapping] type "PropertyCollection | object" can be added');
            }

            // 2. 임시 매핑 컬렉션에 등록
            if (p_mapping instanceof PropertyCollection) {
                mappingCollection = p_mapping;
                // itemsCollection = p_mapping;
            } else if (_isObject(p_mapping)) {
                mappingCollection = new PropertyCollection();
                // itemsCollection = this.items;
                for(var prop in p_mapping) {
                    if (p_mapping.hasOwnProperty(prop) && typeof p_mapping[prop] !== 'undefined') {
                        mappingCollection.add(prop, p_mapping[prop]);
                    }
                }
            } else throw new Error('mapping 이 object 또는 PropertyCollection 타입이 아닙니다. ');

            // 3. 매핑에 존재하고, 아이템에 존재하고, 컬럼에 추가
            // this._readItem()
            for(var i = 0; mappingCollection.count > i; i++) {
                itemName = mappingCollection.keyOf(i);
                columnName = _getColumnName(itemName);
                tableName = _getTableName(itemName);

                if (tableName) table = this._tables[tableName];
                else if (_isString(p_bEntity)) table = this._tables[p_bEntity];
                else  table = p_bEntity || this._baseTable;

                if (!(table instanceof MetaTable)) {
                    throw new Error('메타 테이블이 존재하지 않습니다. ');
                }

                if (!table.columns.exist(columnName)) {
                    if (this.items.exist(columnName)) {
                        this._readItem(columnName, table);
                    } else {
                        throw new Error('매핑할려는 ['+columnName+']이 columns 와 items 에 존재하지 않습니다.');
                    }
                }

                column = table.columns[columnName];
                // if (typeof column !== 'undefined') {
                for (var prop in mappingCollection[i]) {    // command 조회
                    // if (prop === 'Array') {          // 'Array' 전체 등록 속성 추가
                    if (_isAllCommandName(prop)) {          // 'Array' 전체 등록 속성 추가
                        for (var ii = 0; ii < this.command.count; ii++) {
                            this.command[ii].addColumn(column, mappingCollection[i][prop], table);
                        }
                    } else {
                        this.command[prop].addColumn(column, mappingCollection[i][prop], table);
                    }
                }
            }
        };

        /**
         * BindCommand 객체를 추가합니다.
         * @param {string} p_name BindCommand 이름
         * @param {number | object} p_option 옵션
         * @param {BaseEntity} [p_bEntity] 기본 메타테이블
         * @abstract
         */
        BindModel.prototype.addCommand = function(p_name, p_option, p_bEntity) {
            throw new Error('[ addCommand() ] Abstract method definition, fail...');
        };

        /**
         * 서비스 객체로 현재 객체를 설정합니다.
         * @param {IService} [p_service] 서비스 객체
         * @param {boolean} [p_passTypeChk=false] 서비스객체 type 검사 통과 유무
         */
        BindModel.prototype.setService = function(p_service, p_passTypeChk) {
            var propObject;
            var command;
            var tables = [];
            var mapping = new PropertyCollection(this);

            // TODO: try 감싸야함
            
            // try {
                
                // if (!_isObject(p_service)) throw new Error('Only [p_service] type "object" can be added');
                if (!p_passTypeChk) Type.matchType(IService, p_service, 1);
                // Type.allowType(IService, p_service, 1);
    
                // tables 등록
                if (p_service['tables']) {
                    if (Array.isArray(p_service['tables'])) tables = p_service['tables'];
                    else if (_isString(p_service['tables'])) tables.push(p_service['tables']);
                    else throw new Error('서비스 tables 타입은 string[], string 만 가능합니다.');
                    for (var i = 0; i < tables.length; i++) {
                        this.addTable(tables[i]);
                    }
                }
                
                // command 등록
                if (_isObject(p_service['command'])) {
                    propObject = p_service['command'];
                    for(var prop in propObject) {
                        if (propObject.hasOwnProperty(prop) && typeof propObject[prop] !== 'undefined') {
                            // command 등록 및 설정
                            command = this.addCommand(prop);
                            if (propObject[prop]['outputOption'])                       command['outputOption'] = propObject[prop]['outputOption'];  // TODO: ['블럭으로 감싸야함']
                            if (typeof propObject[prop]['config'] === 'object')      command['config'] = propObject[prop]['config'];
                            if (typeof propObject[prop]['url'] === 'string')            command['url'] = propObject[prop]['url'];
                            if (typeof propObject[prop]['onExecute'] === 'function')    command['onExecute'] = propObject[prop]['onExecute'];
                            if (typeof propObject[prop]['onExecuted'] === 'function')   command['onExecuted'] = propObject[prop]['onExecuted'];
                            if (typeof propObject[prop]['cbBegin'] === 'function')      command['cbBegin'] = propObject[prop]['cbBegin'];
                            if (typeof propObject[prop]['cbValid'] === 'function')      command['cbValid'] = propObject[prop]['cbValid'];
                            if (typeof propObject[prop]['cbBind'] === 'function')       command['cbBind'] = propObject[prop]['cbBind'];
                            if (typeof propObject[prop]['cbResult'] === 'function')     command['cbResult'] = propObject[prop]['cbResult'];
                            if (typeof propObject[prop]['cbOutput'] === 'function')     command['cbOutput'] = propObject[prop]['cbOutput'];
                            if (typeof propObject[prop]['cbEnd'] === 'function')        command['cbEnd'] = propObject[prop]['cbEnd']; 
                        }
                    }
                }
                
                // prop 등록
                if (_isObject(p_service['items'])) {
                    propObject = p_service['items'];
                    for(var prop in propObject) {
                        if (propObject.hasOwnProperty(prop) && typeof propObject[prop] !== 'undefined') {
                            //__prop.add(prop, propObject[prop]);
                            // get/sett 형식의 기능 추가        REVIEW:: 확인필요 get/set 의 필요성, 중복 및 혼선의 이슈
                            // if (typeof propObject[prop] === 'object' 
                            //     && (typeof propObject[prop].get === 'function' || typeof propObject[prop].set === 'function')) {
                            //     this.items.add(prop, '', propObject[prop]);    
                            // } else {
                            //     this.items.add(prop, propObject[prop]);
                            // }
                            this.items.add(prop, propObject[prop]);
                        }
                    }
                }
                
                // fn 등록
                if (_isObject(p_service['fn'])) {
                    propObject = p_service['fn'];
                    for(var prop in propObject) {
                        if (propObject.hasOwnProperty(prop) && typeof propObject[prop] !== 'undefined') {
                            this.fn.add(prop, propObject[prop]);
                        }
                    }
                }
    
                if (_isObject(p_service['mapping'])) {
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
                if (typeof p_service['cbBaseBegin'] === 'function') {
                    this.cbBaseBegin = p_service['cbBaseBegin'];
                }
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
                // if (typeof p_service['service'] === 'object') {
                //     this._service = p_service['service'];
                // }
                // this.$mapping = mapping;    // 확인 및 검사시 활용

                // 서비스에 onwer bindModel 설정
                p_service.bindModel = this;
    
                // 속성(prop)을 아이템으로 로딩 ('__'시작이름 제외)
                // if (p_isReadItem === true) {   // REVIEW: 필요성 유무, 아이템을 별도로 안불러올 이유가?
                //     this._readItem();
                // }
                this.setMapping(mapping);
                // this.setMapping(this._mapping);

            // } catch (error) {
            //     throw new ExtendError('service 객체 설정 실패', error);
            // }
        };

        return BindModel;
    
    }(BaseBind));
    

    //==============================================================
    // 4. module export
    if (isNode) exports.BindModel = BindModel;      // strip:

    _global._L               = _global._L || {};
    _global._L.Meta          = _global._L.Meta || {};
    _global._L.Meta.Bind     = _global._L.Meta.Bind || {};
    
    _global._L.BindModel = BindModel;
    _global._L.Meta.Bind.BindModel = BindModel;

}(typeof window !== 'undefined' ? window : global));