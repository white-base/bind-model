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
        var _MetaObject                 = require('logic-entity').MetaObject;
        var _MetaColumn                 = require('logic-entity').MetaColumn;
        var _BaseEntity                 = require('logic-entity').BaseEntity;
        var _MetaTable                  = require('logic-entity').MetaTable;
        var _PropertyCollection         = require('logic-entity').PropertyCollection;
        var _MetaView                   = require('logic-entity').MetaView;
        var _MetaViewCollection         = require('logic-entity').MetaViewCollection;
        var _BaseBind                   = require('./base-bind').BaseBind;
        var _IBindCommand               = require('./i-bind-command').IBindCommand;
        var _ICommandCallback           = require('./i-command-callback').ICommandCallback;
    } else {
        var $Message                    = _global._L.Message;
        var $ExtendError                = _global._L.ExtendError;
        var $Type                       = _global._L.Type;
        var $Util                       = _global._L.Util;
        var $MetaObject                 = _global._L.MetaObject;
        var $MetaColumn                 = _global._L.MetaColumn;
        var $BaseEntity                 = _global._L.BaseEntity;
        var $MetaTable                  = _global._L.MetaTable;
        var $PropertyCollection         = _global._L.PropertyCollection;
        var $MetaView                   = _global._L.MetaView;
        var $MetaViewCollection         = _global._L.MetaViewCollection;
        var $BaseBind                   = _global._L.BaseBind;
        var $IBindCommand               = _global._L.IBindCommand;
        var $ICommandCallback           = _global._L.ICommandCallback;
    }
    var Message                 = _Message              || $Message;
    var ExtendError             = _ExtendError          || $ExtendError;
    var Type                    = _Type                 || $Type;
    var Util                    = _Util                 || $Util;
    var MetaObject              = _MetaObject           || $MetaObject;
    var MetaColumn              = _MetaColumn           || $MetaColumn;
    var BaseEntity              = _BaseEntity           || $BaseEntity;
    var MetaTable               = _MetaTable            || $MetaTable;
    var PropertyCollection      = _PropertyCollection   || $PropertyCollection;
    var MetaView                = _MetaView             || $MetaView;
    var MetaViewCollection      = _MetaViewCollection   || $MetaViewCollection;
    var BaseBind                = _BaseBind             || $BaseBind;
    var IBindCommand            = _IBindCommand         || $IBindCommand;
    var ICommandCallback        = _ICommandCallback     || $ICommandCallback;

    //==============================================================
    // 3. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Type === 'undefined') throw new Error(Message.get('ES011', ['Type', 'type']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    if (typeof MetaObject === 'undefined') throw new Error(Message.get('ES011', ['MetaObject', 'meta-object']));
    if (typeof MetaColumn === 'undefined') throw new Error(Message.get('ES011', ['MetaColumn', 'meta-column']));
    if (typeof BaseEntity === 'undefined') throw new Error(Message.get('ES011', ['BaseEntity', 'base-entity']));
    if (typeof MetaTable === 'undefined') throw new Error(Message.get('ES011', ['MetaTable', 'meta-table']));
    if (typeof PropertyCollection === 'undefined') throw new Error(Message.get('ES011', ['PropertyCollection', 'collection-property']));
    if (typeof MetaView === 'undefined') throw new Error(Message.get('ES011', ['MetaView', 'meta-view']));
    if (typeof MetaViewCollection === 'undefined') throw new Error(Message.get('ES011', ['MetaViewCollection', 'meta-view']));
    if (typeof BaseBind === 'undefined') throw new Error(Message.get('ES011', ['BaseBind', 'base-bind']));
    if (typeof IBindCommand === 'undefined') throw new Error(Message.get('ES011', ['IBindCommand', 'i-bind-command']));
    if (typeof ICommandCallback === 'undefined') throw new Error(Message.get('ES011', ['ICommandCallback', 'i-base-command-callback']));

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
         * @param {MetaTable?} p_baseTable 
         */
        function BindCommand(p_bindModel, p_baseTable) {
            _super.call(this);
            
            p_baseTable = p_baseTable || p_bindModel._baseTable;     // 기본값

            var _this               = this;
            var _model              = null;
            var _outputs            = null;
            // var _eventPropagation   = true;
            var valid;
            var bind;
            var cbValid;
            var cbBind;
            var cbResult;
            var cbEnd;
            var cbOutput;
            var outputOption        = {option: 0, index: 0};     // 0: 제외(edit),  1: View 오버로딩 , 2: 있는자료만 , 3: 존재하는 자료만          

            
            if (!(p_bindModel instanceof MetaObject && p_bindModel.instanceOf('BindModel'))) {
                throw new Error('Only [p_bindModel] type "BindModel" can be added');
            }
            if (p_baseTable && !(p_bindModel instanceof MetaObject && p_baseTable.instanceOf('BaseEntity'))) {
                throw new Error('Only [p_baseTable] type "BaseEntity" can be added');
            }
            
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
             * _outputs 출력들
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
                // set: function(newValue) { 
                //     if (!(newValue instanceof MetaViewCollection)) {
                //         throw new Error('Only [_outputs] type "MetaViewCollection" can be added');
                //     }
                //     _outputs = newValue;
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
                // set: function(newValue) { 
                //     if (!(newValue instanceof MetaObject && newValue.instanceOf('BindModel'))) {
                //         throw new Error('Only [_model] type "BindModel" can be added');
                //     }
                //     _model = newValue;
                // },
                configurable: false,
                enumerable: true
            });

            // /**
            //  * 이벤트 전파 유무 (기본값 = true)
            //  * @member {Boolean} _L.Meta.Bind.BindCommand#_eventPropagation 
            //  */
            // Object.defineProperty(this, '_eventPropagation', {
            //     enumerable: true,
            //     configurable: true,
            //     get: function() { return _eventPropagation; },
            //     set: function(p_bool) {
            //         if (typeof p_bool !== 'boolean') throw new Error('Only [p_bool] type "Boolean" can be added');
            //         _eventPropagation = p_bool;
            //     },
            // }); 
            
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
                set: function(newValue) { 
                    if (!(newValue instanceof MetaView)) throw new Error('Only [valid] type "MetaView" can be added');
                    valid = newValue;
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
                set: function(newValue) { 
                    if (!(newValue instanceof MetaView)) throw new Error('Only [valid] type "MetaView" can be added');
                    bind = newValue;
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
                set: function(newValue) { 
                    if (typeof newValue === 'number' ) outputOption['option'] = newValue;
                    else if (typeof newValue === 'object') {
                        if (typeof newValue['option'] === 'number') outputOption['option'] = newValue['option'];
                        if (typeof newValue['index'] === 'number' || Array.isArray(newValue['index'])) outputOption['index'] = newValue['index'];
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
                set: function(newValue) { this.outputOption = newValue;},
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
                set: function(newValue) { 
                    if (typeof newValue !== 'function') throw new Error('Only [cbValid] type "Function" can be added');
                    cbValid = newValue;
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
                set: function(newValue) { 
                    if (typeof newValue !== 'function') throw new Error('Only [cbBind] type "Function" can be added');
                    cbBind = newValue;
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
                set: function(newValue) { 
                    if (typeof newValue !== 'function') throw new Error('Only [cbResult] type "Function" can be added');
                    cbResult = newValue;
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
                set: function(newValue) { 
                    if (typeof newValue  !== 'function') throw new Error('Only [cbOutput] type "Function" can be added');
                    cbOutput = newValue;
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
                set: function(newValue) { 
                    if (typeof newValue !== 'function') throw new Error('Only [cbEnd] type "Function" can be added');
                    cbEnd = newValue;
                },
                configurable: true,
                enumerable: true
            });    

            // default set
            this._baseTable     = p_baseTable;    
            this.$model         = p_bindModel;          
            this.newOutput('output');

            // 예약어 등록
            this.$KEYWORD = ['_model', '_outputs'];
            this.$KEYWORD = ['valid', 'bind', 'output', 'output1'];
            this.$KEYWORD = ['cbValid', 'cbBind', 'cbResult', 'cbOutput', 'cbEnd'];
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
            if (typeof itemName !== 'string') throw new Error('아이템 string 타입이 아닙니다.');
            if (itemName.indexOf('.') > -1) return itemName.split('.')[0];
        }
        
        function _getColumnName(itemName) {
            if (typeof itemName !== 'string') throw new Error('아이템 string 타입이 아닙니다.');
            if (itemName.indexOf('.') > -1) return itemName.split('.')[1];
            else return itemName;
        }
        // /**
        //  * BindCommand의 실행 전 이벤트 리스너
        //  * @override 
        //  * @param {BindCommand} p_bindCommand 
        //  */
        // BindCommand.prototype._onExecute = function(p_bindCommand) {
        //     _super.prototype._onExecute.call(this, p_bindCommand);               // 자신에 이벤트 발생
            
        //     // if (this._eventPropagation) this._model._onExecute(p_bindCommand);    // 모델에 이벤트 추가 발생
        // };

        // /**
        //  * BindCommand의 실행 후 이벤트 리스너
        //  * @override 
        //  * @param {BindCommand} p_bindCommand 
        //  * @param {Object} p_result 
        //  */
        // BindCommand.prototype._onExecuted = function(p_bindCommand, p_result) {
        //     _super.prototype._onExecuted.call(this, p_bindCommand, p_result);
        //     // if (this._eventPropagation) this._model._onExecuted(p_bindCommand, p_result);
        // };

        /** 
         * 실행 ( valid >> bind >> result >> output >> end )
         * @abstract 
         */
        BindCommand.prototype.execute = function() {
            throw new Error('[ execute() ] Abstract method definition, fail...');
        };
        
        /**
         * 아이템을 추가하고 명령과 매핑한다.
         * 메타테이블에 없을 경우 등록한다.
         * @param {MetaColumn} p_column 등록할 아이템
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
         * p_name으로 아이템을 p_entitys(String | String)에 다중 등록한다.
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

            // item = this._baseTable.columns.addValue(p_name, p_value);
            column = new this._model._columnType(columnName, table, property);  // REVIEW: 파라메터 일반화 요구됨

            // column = entity.columns.addValue(columnName, p_value);

            this.addColumn(column, p_views, table);

            // if (this._baseTable.columns.addValue(p_name, p_value)) {
            //     item = this._baseTable.columns[p_name];
            //     this.addColumn(item, p_views);
            // } else {
            //     throw new Error('item added fail');
            // }
        };

        /**
         * 컬럼 설정
         * 예시>
         * e.read.setEntity(['idx', 'addr'], 'valid');
         * @param {string | array} p_names 아이템명
         * @param {string | string[]} [p_views] 설정할 뷰이름
         * @param {string | MetaTable} [p_bTable] 대상 기본 엔티티 
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
         * 대상엔티티에서 해제
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
            var column;
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
                // 공개(public) BaseEntity 프로퍼티 검사
                // for (var prop in this) {
                //     if (this[prop] instanceof BaseEntity && prop.substring(0, 1) !== '_') {
                //         property.push(prop.toString());
                //     }
                // }
            }

            // 아이템 검사 및 아이템 해제
            for(var i = 0; names.length > i; i++) {
                columnName = names[i]; 
                // column = this._model._baseTable.columns[columnName];

                // if (column instanceof MetaColumn) {
                for (var ii = 0; property.length > ii; ii++) {
                    // this[property[ii]].columns.remove(column);
                    var idx = this[property[ii]].columns.indexOf(columnName, true);
                    if (idx > -1) this[property[ii]].columns.removeAt(idx);
                }

                // } else {
                //     throw new Error('baseEntity에 [' + columnName + '] 아이템이 없습니다.');
                // }
            }
        };

        /**
         * 출력에 사용할 엔티티를 추가한다.
         * 기본 이름 =  'output' + _outout.count
         * @param {string} [p_name] 추가로 참조를 지정할 뷰 이름
         */
        BindCommand.prototype.newOutput = function(p_name) {
            var _this = this;
            var cntName = 'output' + (Number(this._outputs.count) + 1);
            var view;

            // 유효성 검사
            if (p_name && typeof p_name !== 'string') throw new Error('Only [p_name] type "string" can be added');

            // 이름 추가
            // view = $addOutput(cntName);
            $addOutput(cntName);

            // 참조 이름 추가
            if (_isString(p_name)) {
                if (!$checkDoubleName(p_name)) {
                    throw new Error(' view 이름 [' + p_name + '] 총돌(중복) 되었습니다.');   
                }
                // this[p_name] = view;

                Object.defineProperty(this, p_name, $getPropDescriptor(cntName));
                // Object.defineProperty(this, p_name, 
                // {
                //     get: function() { return _this._outputs[cntName];},
                //     set: function(newVal) { 
                //         if (!(newVal instanceof MetaView)) throw new Error('Only [valid] type "MetaView" can be added');
                //         _this._outputs[cntName] = newVal;
                //     },
                //     configurable: true,
                //     enumerable: true
                // });
            }
            
            
            // inner function
            function $addOutput(vName) {
                // if (!$checkDoubleName(vName)) {
                //     throw new Error(' 기본 view 생성자 이름 [' + vName + '] 총돌(중복) 되었습니다. 기존에 동일한 예약된 프로퍼티를 사용하지만 안됩니다.');   
                // }
                // this._output.add('default', this._baseTable);            // 등록방법 2
                _this._outputs.add(new MetaView(vName, _this._baseTable));  // 등록방법 1   // TODO: getter/setter 추가 필요 검토?
                // _this[vName] = _this._outputs[vName];
                
                Object.defineProperty(_this, vName, $getPropDescriptor(vName));
                // Object.defineProperty(_this, vName, 
                // {
                //     get: function() { return _this._outputs[vName];},
                //     set: function(newVal) { 
                //         if (!(newVal instanceof MetaView)) throw new Error('Only [valid] type "MetaView" can be added');
                //         _this._outputs[vName] = newVal;
                //     },
                //     configurable: true,
                //     enumerable: true
                // });
                return _this._outputs[vName];
            }
            function $checkDoubleName(newName) {
                // 예약어 검사
                if (_this.$KEYWORD.indexOf(newName) > -1) return false;
                // 이름 중복 검사
                if (typeof _this[newName] !== 'undefined') return false;
                return true;
            }
            function $getPropDescriptor(oName) {
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
        };


        /**
         * output View 삭제
         * @param {string} p_name 
         */
        BindCommand.prototype.removeOutput = function(p_name) {
            // var idx = this._outputs.keyOf(p_name);
            var defOutput = this['output'];
            var view;

            if (!_isString(p_name)) throw new Error('Only [p_name] type "string" can be added');
            
            view = this[p_name];
            if (view === defOutput)  throw new Error('output 기본 view 는 삭제 할 수 없습니다.');
            
            if (this._outputs.indexOf(view) < 0) throw new Error('_ouput['+p_name+']이 존재하지 않습니다.');

            this._outputs.remove(view);

            // if (idx < 0 ) throw new Error('_ouput['+p_name+']이 존재하지 않습니다.');
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