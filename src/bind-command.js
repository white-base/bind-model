/**** bind-command.js | _L.Meta.Bind.BindCommand ****/
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
        var _MetaRegistry               = require('logic-core').MetaRegistry;
        // var _MetaObject                 = require('logic-entity').MetaObject;
        var _MetaColumn                 = require('logic-entity').MetaColumn;
        // var _BaseEntity                 = require('logic-entity').BaseEntity;
        var _MetaTable                  = require('logic-entity').MetaTable;
        var _MetaView                   = require('logic-entity').MetaView;
        var _MetaViewCollection         = require('logic-entity').MetaViewCollection;
        var _IBindCommand               = require('./i-bind-command').IBindCommand;
        var _ICommandCallback           = require('./i-command-callback').ICommandCallback;
        var _BaseBind                   = require('./base-bind').BaseBind;
    } else {
        var $Message                    = _global._L.Message;
        var $ExtendError                = _global._L.ExtendError;
        var $Type                       = _global._L.Type;
        var $Util                       = _global._L.Util;
        var $MetaRegistry               = _global._L.MetaRegistry;
        // var $MetaObject                 = _global._L.MetaObject;
        var $MetaColumn                 = _global._L.MetaColumn;
        // var $BaseEntity                 = _global._L.BaseEntity;
        var $MetaTable                  = _global._L.MetaTable;
        var $MetaView                   = _global._L.MetaView;
        var $MetaViewCollection         = _global._L.MetaViewCollection;
        var $IBindCommand               = _global._L.IBindCommand;
        var $ICommandCallback           = _global._L.ICommandCallback;
        var $BaseBind                   = _global._L.BaseBind;
    }
    var Message                 = _Message              || $Message;
    var ExtendError             = _ExtendError          || $ExtendError;
    var Type                    = _Type                 || $Type;
    var Util                    = _Util                 || $Util;
    var MetaRegistry            = _MetaRegistry         || $MetaRegistry;
    // var MetaObject              = _MetaObject           || $MetaObject;
    var MetaColumn              = _MetaColumn           || $MetaColumn;
    // var BaseEntity              = _BaseEntity           || $BaseEntity;
    var MetaTable               = _MetaTable            || $MetaTable;
    var MetaView                = _MetaView             || $MetaView;
    var MetaViewCollection      = _MetaViewCollection   || $MetaViewCollection;
    var IBindCommand            = _IBindCommand         || $IBindCommand;
    var ICommandCallback        = _ICommandCallback     || $ICommandCallback;
    var BaseBind                = _BaseBind             || $BaseBind;

    //==============================================================
    // 3. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Type === 'undefined') throw new Error(Message.get('ES011', ['Type', 'type']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    if (typeof MetaRegistry === 'undefined') throw new Error(Message.get('ES011', ['MetaRegistry', 'meta-registry']));
    // if (typeof MetaObject === 'undefined') throw new Error(Message.get('ES011', ['MetaObject', 'meta-object']));    // 
    if (typeof MetaColumn === 'undefined') throw new Error(Message.get('ES011', ['MetaColumn', 'meta-column']));
    // if (typeof BaseEntity === 'undefined') throw new Error(Message.get('ES011', ['BaseEntity', 'base-entity']));    //
    if (typeof MetaTable === 'undefined') throw new Error(Message.get('ES011', ['MetaTable', 'meta-table']));
    if (typeof MetaView === 'undefined') throw new Error(Message.get('ES011', ['MetaView', 'meta-view']));
    if (typeof MetaViewCollection === 'undefined') throw new Error(Message.get('ES011', ['MetaViewCollection', 'meta-view']));
    if (typeof IBindCommand === 'undefined') throw new Error(Message.get('ES011', ['IBindCommand', 'i-bind-command']));
    if (typeof ICommandCallback === 'undefined') throw new Error(Message.get('ES011', ['ICommandCallback', 'i-base-command-callback']));
    if (typeof BaseBind === 'undefined') throw new Error(Message.get('ES011', ['BaseBind', 'base-bind']));

    //==============================================================
    // 4. module implementation
    //--------------------------------------------------------------
    // implementation
    var BindCommand  = (function (_super) {
        /**
         * 바인드 명령 
         * @constructs _L.Meta.Bind.BindCommand
         * @abstract
         * @extends _L.Meta.Bind.BaseBind
         * @param {BindModel} p_bindModel 
         * @param {MetaTable} [p_baseTable] 
         */
        function BindCommand(p_bindModel, p_baseTable) {
            _super.call(this);
            
            // p_baseTable = p_baseTable || p_bindModel._baseTable;     // 기본값
            if (!p_baseTable && p_bindModel && p_bindModel._baseTable) {
                p_baseTable = p_bindModel._baseTable;
            }

            var $newOutput          = [];
            var _this               = this;
            var _model              = null;
            var _outputs            = null;
            var valid;
            var bind;
            var cbBegin;
            var cbValid;
            var cbBind;
            var cbResult;
            var cbEnd;
            var cbOutput;
            var outputOption        = {option: 0, index: 0};     // 0: 제외(edit),  1: View 오버로딩 , 2: 있는자료만 , 3: 존재하는 자료만          

            // if (p_baseTable && !(p_bindModel instanceof MetaObject && p_baseTable.instanceOf('BaseEntity'))) {
            //     throw new Error('Only [p_baseTable] type "BaseEntity" can be added');
            // }
            
            /**
             * 별칭 내부값
             * @member {string | number | boolean} _L.Meta.Bind.BindCommand#$model
             * @readonly
             * @private
             */
            Object.defineProperty(this, '$model',
            {
                get: function() { return _model; },
                set: function(nVal) { _model = nVal; },
                configurable: false,
                enumerable: false,
            });

            /**
             * 별칭 내부값
             * @member {string | number | boolean} _L.Meta.Bind.BindCommand#$newOutput
             * @readonly
             * @private
             */
            Object.defineProperty(this, '$newOutput',
            {
                get: function() { return $newOutput; },
                set: function(nVal) { $newOutput = nVal; },
                configurable: false,
                enumerable: false,
            });

            /**
             * _outputs MetaView 컬켁션
             * @member {BindModel} _L.Meta.Bind.BindCommand#_outputs
             * @readonly
             * @protected
             */
            Object.defineProperty(this, '_outputs', 
            {
                get: function() { 
                    if (_outputs === null) _outputs = new MetaViewCollection(_this, _this._baseTable);
                    return _outputs;
                },
                // set: function(nVal) { 
                //     if (!(nVal instanceof MetaViewCollection)) {
                //         throw new Error('Only [_outputs] type "MetaViewCollection" can be added');
                //     }
                //     _outputs = nVal;
                // },
                configurable: false,
                enumerable: true
            });

            /**
             * _model 바인드모델
             * @member {BindModel} _L.Meta.Bind.BindCommand#_model
             * @readonly
             */
            Object.defineProperty(this, '_model', 
            {
                get: function() { return _model; },
                // set: function(nVal) { 
                //     if (!(nVal instanceof MetaObject && nVal.instanceOf('BindModel'))) {
                //         throw new Error('Only [_model] type "BindModel" can be added');
                //     }
                //     _model = nVal;
                // },
                configurable: false,
                enumerable: true
            });

            /**
             * 검사대상 MetaView
             * @member {MetaView} _L.Meta.Bind.BindCommand#valid 
             */
            Object.defineProperty(this, 'valid', 
            {
                get: function() { 
                    if (typeof valid === 'undefined') valid = new MetaView('valid', _this._baseTable);
                    return valid; 
                },
                set: function(nVal) { 
                    if (!(nVal instanceof MetaView)) throw new Error('Only [valid] type "MetaView" can be added');
                    valid = nVal;
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
                get: function() { 
                    if (typeof bind === 'undefined') bind = new MetaView('bind', _this._baseTable);
                    return bind; 
                },
                set: function(nVal) { 
                    if (!(nVal instanceof MetaView)) throw new Error('Only [valid] type "MetaView" can be added');
                    bind = nVal;
                },
                configurable: true,
                enumerable: true
            });

            /**
             * 출력(output) 특성
             * 0: 제외(edit),  1: View 오버로딩 , 2: 있는자료만 , 3: 존재하는 자료만 
             * @member {object} _L.Meta.Bind.BindCommand#outputOption 
             */
            Object.defineProperty(this, 'outputOption', 
            {
                get: function() { return outputOption; },
                set: function(nVal) { 
                    if (typeof nVal === 'number' ) outputOption['option'] = nVal;
                    else if (typeof nVal === 'object') {
                        if (typeof nVal['option'] === 'number') outputOption['option'] = nVal['option'];
                        if (typeof nVal['index'] === 'number' || Array.isArray(nVal['index'])) outputOption['index'] = nVal['index'];
                    } else throw new Error('Only [outputOption] type "number | object {option, index,}" can be added');
                },
                configurable: true,
                enumerable: true
            });

            /**
             * 출력(output) 특성  === outputOption
             * 0: 제외(edit),  1: View 오버로딩 , 2: 있는자료만 , 3: 존재하는 자료만 
             * @member {object} _L.Meta.Bind.BindCommand#outOpt 
             */
            Object.defineProperty(this, 'outOpt', 
            {
                get: function() { return this.outputOption; },
                set: function(nVal) { this.outputOption = nVal;},
                configurable: true,
                enumerable: true
            });

            /**
             * 시작 전 콜백
             * @member {Function} _L.Meta.Bind.BindCommand#cbBegin 
             */
            Object.defineProperty(this, 'cbBegin', 
            {
                get: function() { return cbBegin; },
                set: function(nVal) { 
                    if (typeof nVal !== 'function') throw new Error('Only [cbBegin] type "Function" can be added');
                    cbBegin = nVal;
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
                get: function() { return cbValid; },
                set: function(nVal) { 
                    if (typeof nVal !== 'function') throw new Error('Only [cbValid] type "Function" can be added');
                    cbValid = nVal;
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
                get: function() { return cbBind; },
                set: function(nVal) { 
                    if (typeof nVal !== 'function') throw new Error('Only [cbBind] type "Function" can be added');
                    cbBind = nVal;
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
                get: function() { return cbResult; },
                set: function(nVal) { 
                    if (typeof nVal !== 'function') throw new Error('Only [cbResult] type "Function" can be added');
                    cbResult = nVal;
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
                get: function() { return cbOutput; },
                set: function(nVal) { 
                    if (typeof nVal  !== 'function') throw new Error('Only [cbOutput] type "Function" can be added');
                    cbOutput = nVal;
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
                get: function() { return cbEnd; },
                set: function(nVal) { 
                    if (typeof nVal !== 'function') throw new Error('Only [cbEnd] type "Function" can be added');
                    cbEnd = nVal;
                },
                configurable: true,
                enumerable: true
            });    

            // default set
            if (p_baseTable) this._baseTable = p_baseTable;    
            if (p_bindModel) this.$model = p_bindModel;          
            this.newOutput('output');

            // 예약어 등록
            this.$KEYWORD = ['_model', '_outputs'];
            this.$KEYWORD = ['valid', 'bind', 'output'];
            this.$KEYWORD = ['cbBegin', 'cbValid', 'cbBind', 'cbResult', 'cbOutput', 'cbEnd'];
            this.$KEYWORD = ['outputOption', 'outOpt'];
            this.$KEYWORD = ['addColumnValue', 'setColumn', 'release', 'execute', 'newOutput', 'removeOutput'];

            Util.implements(BindCommand, this);
        }
        Util.inherits(BindCommand, _super);
    
        BindCommand._UNION = [IBindCommand, ICommandCallback];
        BindCommand._NS = 'Meta.Bind';
        BindCommand._PARAMS = ['_model', '_baseTable'];
        BindCommand._KIND = 'abstract';

        // local function
        function _isString(obj) {    // 공백아닌 문자 여부
            if (typeof obj === 'string' && obj.length > 0) return true;
            return false;
        }

        function _isObject(obj) {
            if (typeof obj !== null && typeof obj === 'object') return true;
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

        function _getPropDescriptor(_this, oName) {
            return {
                get: function() { return _this._outputs[oName];},
                set: function(newVal) { 
                    if (!(newVal instanceof MetaView)) throw new Error('Only [valid] type "MetaView" can be added');
                    _this._outputs[oName] = newVal;
                },
                configurable: true,
                enumerable: true
            }
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
        BindCommand.prototype.getObject = function(p_vOpt, p_owned) {
            var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
            var vOpt = p_vOpt || 0;
            var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

            if (MetaRegistry.hasGuidObject(this._baseTable, owned)) {
                obj['_baseTable'] = MetaRegistry.createReferObject(this._baseTable);
            } else obj['_baseTable'] = this._baseTable.getObject(vOpt, owned);

            obj['_outputs']     = this._outputs.getObject(vOpt, owned);
            if (vOpt < 2 && vOpt > -1 && this._model) {
                obj['_model'] = MetaRegistry.createReferObject(this._model);
            }
            obj['valid']        = this.valid.getObject(vOpt, owned);
            obj['bind']         = this.bind.getObject(vOpt, owned);

            obj['outputOption'] = this.outputOption;
            
            obj['cbBegin']      = this.cbBegin;
            obj['cbValid']      = this.cbValid;
            obj['cbBind']       = this.cbBind;
            obj['cbResult']     = this.cbResult;
            obj['cbOutput']     = this.cbOutput;
            obj['cbEnd']        = this.cbEnd;            
            obj['$newOutput']   = this.$newOutput;

            return obj;
        };

        /**
         * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.   
         * @param {object} p_oGuid guid 타입의 객체
         * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
         * 기본값은 p_oGuid 객체와 동일
         */
        BindCommand.prototype.setObject  = function(p_oGuid, p_origin) {
            _super.prototype.setObject.call(this, p_oGuid, p_origin);
            
            var origin = p_origin ? p_origin : p_oGuid;
            var _model;

            if (MetaRegistry.isGuidObject(p_oGuid['_baseTable'])) {
                var obj = MetaRegistry.createMetaObject(p_oGuid['_baseTable'], origin);
                obj.setObject(p_oGuid['_baseTable'], origin);
                this._baseTable = obj;
                
            } else if (p_oGuid['_baseTable']['$ref']) {
                var meta = MetaRegistry.findSetObject(p_oGuid['_baseTable']['$ref'], origin);
                if (!meta) throw new Error('$ref 를 찾을 수 없습니다.');
                this._baseTable = meta;
            } else throw new Error('setObject 실패, _baseTable 이 존재하지 않습니다.');

            this._outputs.setObject(p_oGuid['_outputs'], origin);
            if (p_oGuid['_model']) {
                _model = MetaRegistry.findSetObject(p_oGuid['_model']['$ref'], origin);
                if (!_model) throw new Error('_model 객체가 존재하지 않습니다.');
                this.$model = _model;
            }

            this.valid.setObject(p_oGuid['valid'], origin);
            this.bind.setObject(p_oGuid['bind'], origin);

            this.outputOption = p_oGuid['outputOption'];
            
            if (typeof p_oGuid['cbBegin'] === 'function') this.cbBegin = p_oGuid['cbBegin'];
            if (typeof p_oGuid['cbValid'] === 'function') this.cbValid = p_oGuid['cbValid'];
            if (typeof p_oGuid['cbBind'] === 'function') this.cbBind = p_oGuid['cbBind'];
            if (typeof p_oGuid['cbResult'] === 'function') this.cbResult = p_oGuid['cbResult'];
            if (typeof p_oGuid['cbOutput'] === 'function') this.cbOutput = p_oGuid['cbOutput'];
            if (typeof p_oGuid['cbEnd'] === 'function') this.cbEnd = p_oGuid['cbEnd'];

            this.$newOutput = p_oGuid['$newOutput'];
            for(var i = 0; i < this.$newOutput.length; i++) {
                var nObj = this.$newOutput[i];
                Object.defineProperty(this, nObj.cmdName, _getPropDescriptor(this, nObj.viewName));
            }
        };

        /** 
         * 실행 ( valid >> bind >> result >> output >> end )
         * @abstract 
         */
        BindCommand.prototype.execute = function() {
            throw new Error('[ execute() ] Abstract method definition, fail...');
        };
        
        /**
         * 컬럼을 추가하고 지정 테이블에 추가하고, 컬럼의 참조를 BindCommand 의 valid, bind, output MetaView 에 등록합니다.
         * @param {MetaColumn} p_column 컬럼
         * @param {string | string[]} p_views 추가할 뷰 엔티티  TODO: 필수 조건으로 변경함, 전체추가시 [] 빈배열 전달
         * @param {string | MetaTable} [p_bTable] 추가할 메타테이블
         */
        BindCommand.prototype.addColumn = function(p_column, p_views, p_bTable) {
            var views = [];     // 파라메터 변수
            var property = [];      // View 실체 
            var collection;
            var table;

            // 1.유효성 검사
            if (!(p_column instanceof MetaColumn)) {
                throw new Error('Only [p_column] type "MetaColumn" can be added');
            }
            if (typeof p_views !== 'undefined' && (!(Array.isArray(p_views) || typeof p_views === 'string'))) {
                throw new Error('Only [p_views] type "Array | string" can be added');
            }
            // if (p_bTable && !(p_bTable instanceof MetaTable)) {
            //     throw new Error('Only [p_bTable] type "MetaTable" can be added');
            // }

            // 2.초기화 설정
            if (Array.isArray(p_views)) views = p_views;
            else if (typeof p_views === 'string') views.push(p_views);

            if (typeof p_bTable === 'string') table = this._model._tables[p_bTable];
            else table = p_bTable || this._baseTable;
            
            if (!(table instanceof MetaTable)) {
                throw new Error('메타 테이블이 존재하지 않습니다. ');
            }

            // baseTable 에 컬럼이 없으면 등록, 중복이름은 기존 이름을 사용함
            if (!table.columns.contains(p_column))  {
                table.columns.add(p_column);
            }

            // 3.설정 대상 가져오기
            if (views.length > 0) {
                for (var i = 0; i < views.length; i++) {
                    
                    if (typeof views[i] !== 'string') throw new Error('Only [String] type instances can be added');
                   
                    // 속성 유무 검사
                    if (this[views[i]]) {
                        property.push(views[i]);
                    } else {
                        throw new Error(' Param p_views 에 [' + views[i] + ']가 없습니다. ');
                    }
                }
            } else {
                // 공개(public) BaseEntity 프로퍼티 검사
                property = ['valid', 'bind'];
                for (var i = 0; i < this._outputs.count; i++) {
                    property.push(this._outputs.keyOf(i));
                }
            }

            // 4.컬렉션 추가(등록)
            for (var i = 0; i < property.length; i++) {
                collection = this[property[i]].columns;
                // if (this[property[i]] instanceof MetaView ){
                // } else {
                //     // console.warn('Warning!! [' + property[i] + ']속성이 this 에 없습니다. ');
                //     throw new Error(' Param p_views 에 [' + property[i] + ']가 없습니다. ');
                // }
                collection.add(p_column, table.columns);
            }
        };

        /**
         * 지정한 이름으로 컬럼과 값을 추가하고, 컬럼의 참조를 BindCommand 의 valid, bind, output MetaView 에 등록합니다.
         * @param {string} p_name 컬럼명
         * @param {object | string | number | boolean} p_value 컬럼값 또는 속성
         * @param {string | string[]} [p_views] <선택> 추가할 뷰 엔티티
         * @param {string | MetaTable} [p_bTable] 대상 기본 엔티티 
         */
        BindCommand.prototype.addColumnValue = function(p_name, p_value, p_views, p_bTable) {
            var property = {};
            var table;
            var tableName;
            var columnName;
            var column;        
            
            // 유효성 검사
            if (typeof p_name !== 'string') {
                throw new Error('Only [p_name] type "string" can be added');
            }
            // if (p_bTable && !(p_bTable instanceof MetaTable)) {
            //     throw new Error('Only [p_bTable] type "MetaTable" can be added');
            // }

            columnName = _getColumnName(p_name);
            tableName = _getTableName(p_name);

            if (tableName) {
                table = this._model._tables[tableName];
            } else table = this._model._tables[p_bTable] || this._baseTable;

            if (tableName) table = this._model._tables[tableName];
            else if (typeof p_bTable === 'string') table = this._model._tables[p_bTable];
            else table = p_bTable || this._baseTable;

            if (_isObject(p_value)) property = p_value;
            else property = { value: p_value };
            
            if (!(table instanceof MetaTable)) {
                throw new Error('메타 테이블이 존재하지 않습니다. ');
            }

            column = new this._model._columnType(columnName, table, property);  // REVIEW: 파라메터 일반화 요구됨
            this.addColumn(column, p_views, table);
        };

        /**
         * 메타테이블의 컬럼을 지정한 MetaView 에 설정합니다.
         * @param {string | array} p_names 컬럼명
         * @param {string | string[]} [p_views] 설정할 뷰
         * @param {string | MetaTable} [p_bTable] 컬럼을 소유한 메타테이블
         * @example
         * e.read.setEntity(['idx', 'addr'], 'valid');
         */
        BindCommand.prototype.setColumn = function(p_names, p_views, p_bTable) {

            var names = [];     // 파라메터 변수
            var itemName;
            var column;
            var table;
            var tableName;
            var columnName;            

            // 초기화
            if (Array.isArray(p_names)) names = p_names;
            else if (typeof p_names === 'string') names.push(p_names);

            // 유효성 검사
            if (names.length === 0) throw new Error('Only [p_names] type "Array | string" can be added');

            // 아이템 검사 및 등록 함수 this.add(..) 호출
            for(var i = 0; names.length > i; i++) {
                itemName = names[i]; 

                if (!_isString(itemName)) {
                    throw new Error('Only [itemName] type "string" can be added');
                }

                columnName = _getColumnName(itemName);
                tableName = _getTableName(itemName);

                // if (tableName) {
                //     table = this._model._tables[tableName];
                // } else table = this._baseTable;
                if (tableName) table = this._model._tables[tableName];
                else if (typeof p_bTable === 'string') table = this._model._tables[p_bTable];
                else table = p_bTable || this._baseTable;

                if (!(table instanceof MetaTable)) {
                    throw new Error('메타 테이블이 존재하지 않습니다. ');
                }

                column = table.columns[columnName];
                if (typeof column !== 'undefined') {
                    this.addColumn(column, p_views, table);
                } else {
                    throw new Error('tables 에 [' + itemName + '] 컬럼이 없습니다.');
                }
            }
        };

        /**
         * 지정한 컬럼을 대상 MeteView 에서 제거합니다.  (컬럼삭제 아님)
         * @param {string | string[]} p_names 해제할 아이템명
         * @param {string | string[]} [p_views] 'valid', 'bind', 'output' 해제할 뷰 엔티티 지정
         * @example
         * e.read.release(['idx', 'addr'], 'valid');
         */
        BindCommand.prototype.release = function(p_names, p_views) {

            var names = [];         // 파라메터 변수
            var views = [];      // 파라메터 변수
            var property = [];      // 속성
            var columnName;
            var viewName;

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
                    viewName = views[i];
                    if (typeof viewName !== 'string') throw new Error('Only [String] type instances can be added');
                    // 속성 유무 검사
                    if (this[viewName]) property.push(viewName);
                    else throw new Error('Warning!! Param p_views 에 [' + viewName + ']가 없습니다. ');
                }
            } else {
                property = ['valid', 'bind'];
                for (var i = 0; i < this._outputs.count; i++) {
                    property.push(this._outputs.keyOf(i));
                }
            }

            // 아이템 검사 및 아이템 해제
            for(var i = 0; names.length > i; i++) {
                columnName = names[i]; 
                for (var ii = 0; property.length > ii; ii++) {
                    var idx = this[property[ii]].columns.indexOf(columnName, true);
                    if (idx > -1) this[property[ii]].columns.removeAt(idx);
                }
            }
        };

        /**
         * _output MetaViewCollection 에 MetaView 을 추가합니다.  
         * -  기본 이름 =  'output' + _outout.count
         * @param {string} [p_name] MetaView 이름
         */
        BindCommand.prototype.newOutput = function(p_name) {
            var _this = this;
            var cntName = 'output' + (Number(this._outputs.count) + 1);

            // 유효성 검사
            if (p_name && typeof p_name !== 'string') throw new Error('Only [p_name] type "string" can be added');

            // 이름 추가
            $addOutput(cntName);

            // 참조 이름 추가
            if (_isString(p_name)) {
                if (!$checkDoubleName(p_name)) {
                    throw new Error(' view 이름 [' + p_name + '] 총돌(중복) 되었습니다.');   
                }
                this.$newOutput.push({ cmdName: p_name, viewName: cntName });
                Object.defineProperty(this, p_name, _getPropDescriptor(this, cntName));
            }
            
            // inner function
            function $addOutput(vName) {
                _this._outputs.add(new MetaView(vName, _this._baseTable));  // 등록방법 1   // TODO: getter/setter 추가 필요 검토?
                Object.defineProperty(_this, vName, _getPropDescriptor(_this, vName));
                return _this._outputs[vName];
            }
            function $checkDoubleName(newName) {
                // 예약어 검사
                if (_this.$KEYWORD.indexOf(newName) > -1) return false;
                // 이름 중복 검사
                if (typeof _this[newName] !== 'undefined') return false;
                return true;
            }
        };

        /**
         * _output MetaViewCollection 에 MetaView 을 제거합니다.  
         * @param {string} p_name 
         */
        BindCommand.prototype.removeOutput = function(p_name) {
            // var idx = this._outputs.keyOf(p_name);
            var defOutput = this['output'];
            var view;
            var pos;

            if (!_isString(p_name)) throw new Error('Only [p_name] type "string" can be added');
            
            view = this[p_name];
            if (view === defOutput)  throw new Error('output 기본 view 는 삭제 할 수 없습니다.');
            
            if (this._outputs.indexOf(view) < 0) throw new Error('_outputs['+p_name+']이 존재하지 않습니다.');

            pos = this.$newOutput.indexOf(p_name);

            delete this[p_name];
            this.$newOutput.splice(pos, 1);
            this._outputs.remove(view);
        };

        return BindCommand;
    
    }(BaseBind));

    //==============================================================
    // 5. module export
    if (isNode) {     
        exports.BindCommand                = BindCommand;
    } else {
        _global._L.BindCommand             = BindCommand;
        // namespace
        _global._L.Meta.Bind.BindCommand   = BindCommand;
    }

}(typeof window !== 'undefined' ? window : global));