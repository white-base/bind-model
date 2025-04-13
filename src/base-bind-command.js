/**** bind-command.js | BaseBindCommand ****/
//==============================================================
import { ExtendError }                  from 'logic-entity';
import { MetaRegistry }                 from 'logic-entity';
import { MetaColumn }                   from 'logic-entity';
import { MetaTable }                    from 'logic-entity';
import { MetaView }                     from 'logic-entity';
import { MetaViewCollection }           from 'logic-entity';
import { Util }                         from './util-wrap.js';
import { IBindCommand }                 from './i-bind-command.js';
import { ICommandCallback }             from './i-command-callback.js';
import { BaseBind }                     from './base-bind.js';

var BaseBindCommand  = (function (_super) {
    /**
     * 바인드 명령 
     * 
     * @constructs _L.Meta.Bind.BaseBindCommand
     * @abstract
     * @extends _L.Meta.Bind.BaseBind
     * @param {BaseBindModel} p_BaseBindModel 
     * @param {MetaTable} [p_baseTable] 
     */
    function BaseBindCommand(p_BaseBindModel, p_baseTable) {
        _super.call(this);
        
        // p_baseTable = p_baseTable || p_BaseBindModel._baseTable;     // 기본값
        if (!p_baseTable && p_BaseBindModel && p_BaseBindModel._baseTable) {
            p_baseTable = p_BaseBindModel._baseTable;
        }

        var $newOutput          = [];
        var _this               = this;
        var _model              = null;
        var _outputs            = null;
        var valid;
        var bind;
        var misc;
        var cbBegin;
        var cbValid;
        var cbBind;
        var cbResult;
        var cbEnd;
        var cbOutput;
        var outputOption        = { option: 0, index: 0 };     // 0: 제외(edit),  1: View 오버로딩 , 2: 있는자료만 , 3: 존재하는 자료만          
        var state;

        // if (p_baseTable && !(p_BaseBindModel instanceof MetaObject && p_baseTable.instanceOf('BaseEntity'))) {
        //     throw new Error('Only [p_baseTable] type "BaseEntity" can be added');
        // }
        
        /**
         * 별칭 내부값
         * 
         * @member {string | number | boolean} _L.Meta.Bind.BaseBindCommand#$model
         * @readonly
         * @private
         */
        Object.defineProperty(this, '$model', {
            get: function() { return _model; },
            set: function(nVal) { _model = nVal; },
            configurable: false,
            enumerable: false,
        });

        /**
         * 별칭 내부값
         * 
         * @member {string | number | boolean} _L.Meta.Bind.BaseBindCommand#$newOutput
         * @readonly
         * @private
         */
        Object.defineProperty(this, '$newOutput', {
            get: function() { return $newOutput; },
            set: function(nVal) { $newOutput = nVal; },
            configurable: false,
            enumerable: false,
        });

        /**
         * _outputs MetaView 컬켁션
         * 
         * @member {BaseBindModel} _L.Meta.Bind.BaseBindCommand#_outputs
         * @readonly
         * @protected
         */
        Object.defineProperty(this, '_outputs', {
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
         * 
         * @member {BaseBindModel} _L.Meta.Bind.BaseBindCommand#_model
         * @readonly
         */
        Object.defineProperty(this, '_model', {
            get: function() { return _model; },
            // set: function(nVal) { 
            //     if (!(nVal instanceof MetaObject && nVal.instanceOf('BaseBindModel'))) {
            //         throw new Error('Only [_model] type "BaseBindModel" can be added');
            //     }
            //     _model = nVal;
            // },
            configurable: false,
            enumerable: true
        });

        /**
         * 검사대상 MetaView
         * 
         * @member {MetaView} _L.Meta.Bind.BaseBindCommand#valid 
         */
        Object.defineProperty(this, 'valid', {
            get: function() { 
                if (typeof valid === 'undefined') valid = new MetaView('valid', _this._baseTable);
                return valid; 
            },
            set: function(nVal) { 
                if (!(nVal instanceof MetaView)) throw new ExtendError(/EL061301/, null, [this.constructor.name]);
                valid = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 바인드 MetaView
         * 
         * @member {MetaView} _L.Meta.Bind.BaseBindCommand#bind 
         */
        Object.defineProperty(this, 'bind', {
            get: function() { 
                if (typeof bind === 'undefined') bind = new MetaView('bind', _this._baseTable);
                return bind; 
            },
            set: function(nVal) { 
                if (!(nVal instanceof MetaView)) throw new ExtendError(/EL061302/, null, [this.constructor.name]);
                bind = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 기타 MetaView
         * 
         * @member {MetaView} _L.Meta.Bind.BaseBindCommand#misc 
         */
        Object.defineProperty(this, 'misc', {
            get: function() { 
                if (typeof misc === 'undefined') misc = new MetaView('misc', _this._baseTable);
                return misc; 
            },
            set: function(nVal) { 
                if (!(nVal instanceof MetaView)) throw new ExtendError(/EL061302/, null, [this.constructor.name]);  // REVIEW: EL061302 오류 코드 중복됨
                misc = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 출력(output) 특성  
         * 0: 제외(edit),  1: View 오버로딩 , 2: 있는자료만 , 3: 존재하는 자료만  
         * 
         * @member {object} _L.Meta.Bind.BaseBindCommand#outputOption 
         */
        Object.defineProperty(this, 'outputOption', {
            get: function() { return outputOption; },
            set: function(nVal) { 
                if (typeof nVal === 'number' ) outputOption['option'] = nVal;
                else if (typeof nVal === 'object') {
                    if (typeof nVal['option'] === 'number') outputOption['option'] = nVal['option'];
                    if (typeof nVal['index'] === 'number' || Array.isArray(nVal['index'])) outputOption['index'] = nVal['index'];
                } else throw new ExtendError(/EL061303/, null, [this.constructor.name]);
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 출력(output) 특성  === outputOption  
         * 0: 제외(edit),  1: View 오버로딩 , 2: 있는자료만 , 3: 존재하는 자료만  
         * 
         * @member {object} _L.Meta.Bind.BaseBindCommand#outOpt 
         */
        Object.defineProperty(this, 'outOpt', {
            get: function() { return this.outputOption; },
            set: function(nVal) { this.outputOption = nVal;},
            configurable: true,
            enumerable: false
        });

        /**
         * 시작 전 콜백
         * 
         * @member {Function} _L.Meta.Bind.BaseBindCommand#cbBegin 
         */
        Object.defineProperty(this, 'cbBegin', {
            get: function() { return cbBegin; },
            set: function(nVal) { 
                if (typeof nVal !== 'function') throw new ExtendError(/EL061304/, null, [this.constructor.name]);
                cbBegin = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 검사(valid) 전 콜백
         * 
         * @member {Function} _L.Meta.Bind.BaseBindCommand#cbValid 
         */
        Object.defineProperty(this, 'cbValid', {
            get: function() { return cbValid; },
            set: function(nVal) { 
                if (typeof nVal !== 'function') throw new ExtendError(/EL061305/, null, [this.constructor.name]);
                cbValid = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 바인드(bind) 전 콜백
         * 
         * @member {Function} _L.Meta.Bind.BaseBindCommand#cbBind
         */
        Object.defineProperty(this, 'cbBind', {
            get: function() { return cbBind; },
            set: function(nVal) { 
                if (typeof nVal !== 'function') throw new ExtendError(/EL061306/, null, [this.constructor.name]);
                cbBind = nVal;
            },
            configurable: false,
            enumerable: true
        });

        /**
         * 바인드(bind) 결과 콜백 (주요 : 회신자료의 가공의 역활)
         * 
         * @member {Function} _L.Meta.Bind.BaseBindCommand#cbValid 
         */
        Object.defineProperty(this, 'cbResult', {
            get: function() { return cbResult; },
            set: function(nVal) { 
                if (typeof nVal !== 'function') throw new ExtendError(/EL061307/, null, [this.constructor.name]);
                cbResult = nVal;
            },
            configurable: true,
            enumerable: true
        });

        /**
         * 바인드 결과 출력 콜백 (주요: 목록의 출력)
         * 
         * @member {Function} _L.Meta.Bind.BaseBindCommand#cbOutput 
         */
        Object.defineProperty(this, 'cbOutput', {
            get: function() { return cbOutput; },
            set: function(nVal) { 
                if (typeof nVal  !== 'function') throw new ExtendError(/EL061308/, null, [this.constructor.name]);
                cbOutput = nVal;
            },
            configurable: true,
            enumerable: true
        });
        
        /**
         * 바인드 처리 종료 후 콜백 (주요: 다른 이벤트 또는 명령과의 연결)
         * 
         * @member {Function} _L.Meta.Bind.BaseBindCommand#cbEnd 
         */
        Object.defineProperty(this, 'cbEnd', {
            get: function() { return cbEnd; },
            set: function(nVal) { 
                if (typeof nVal !== 'function') throw new ExtendError(/EL061309/, null, [this.constructor.name]);
                cbEnd = nVal;
            },
            configurable: true,
            enumerable: true
        });    

        /**
         * exectue 처리 상태 0 ~ 8, -1 ~ -8 은 실패 위치
         * 
         * @member {Function} _L.Meta.Bind.BaseBindCommand#state 
         */
        Object.defineProperty(this, 'state', {
            get: function() { return state; },
            set: function(nVal) { 
                if (typeof nVal !== 'number') throw new ExtendError(/EL061336/, null, [this.constructor.name]);
                state = nVal;
            },
            configurable: true,
            enumerable: true
        });  


        // default set
        if (p_baseTable) this._baseTable = p_baseTable;
        if (p_BaseBindModel) this.$model = p_BaseBindModel;
        this.newOutput('output');

        // 예약어 등록
        this.$KEYWORD = ['_model', '_outputs'];
        this.$KEYWORD = ['valid', 'bind', 'output', 'misc'];
        this.$KEYWORD = ['cbBegin', 'cbValid', 'cbBind', 'cbResult', 'cbOutput', 'cbEnd'];
        this.$KEYWORD = ['outputOption', 'outOpt', 'state'];
        this.$KEYWORD = ['addColumnValue', 'setColumn', 'release', 'execute', 'exec', 'newOutput', 'removeOutput'];

        Util.implements(BaseBindCommand, this);         // strip:
    }
    Util.inherits(BaseBindCommand, _super);

    BaseBindCommand._UNION = [IBindCommand, ICommandCallback];
    BaseBindCommand._NS = 'Meta.Bind';
    BaseBindCommand._PARAMS = ['_model', '_baseTable'];
    BaseBindCommand._KIND = 'abstract';

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
        if (!_isString(cName)) throw new ExtendError(/EL061310/, null, [cName]);
        return cName;
    }

    function _isAllName(p_name) {
        if (p_name.toLowerCase() === '$all') return true;
        return false;
    };

    function _getPropDescriptor(_this, oName) {
        return {
            get: function() { return _this._outputs[oName];},
            set: function(newVal) { 
                if (!(newVal instanceof MetaView)) throw new ExtendError(/EL061311/, null, [oName]);
                _this._outputs[oName] = newVal;
            },
            configurable: true,
            enumerable: true
        };
    }

    /**
     * 현재 객체의 guid 타입의 객체를 가져옵니다.  
     * - 순환참조는 $ref 값으로 대체된다.  
     * 
     * @param {number} p_vOpt 가져오기 옵션  
     * - opt = 0 : 참조 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 1 : 소유 구조의 객체 (_guid: Yes, $ref: Yes)  
     * - opt = 2 : 소유 구조의 객체 (_guid: No,  $ref: No)  
     * 객체 비교 : equal(a, b)  
     * a.getObject(2) == b.getObject(2)  
     * @param {object | array<object>} [p_owned] 현재 객체를 소유하는 상위 객체들
     * @returns {object}  
     */
    BaseBindCommand.prototype.getObject = function(p_vOpt, p_owned) {
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
        obj['misc']         = this.misc.getObject(vOpt, owned);

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
     * 
     * @param {object} p_oGuid guid 타입의 객체
     * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
     * 기본값은 p_oGuid 객체와 동일
     */
    BaseBindCommand.prototype.setObject  = function(p_oGuid, p_origin) {
        _super.prototype.setObject.call(this, p_oGuid, p_origin);
        
        var origin = p_origin ? p_origin : p_oGuid;
        var _model;

        if (MetaRegistry.isGuidObject(p_oGuid['_baseTable'])) {
            var obj = MetaRegistry.createMetaObject(p_oGuid['_baseTable'], origin);
            obj.setObject(p_oGuid['_baseTable'], origin);
            this._baseTable = obj;
            
        } else if (p_oGuid['_baseTable']['$ref']) {
            var meta = MetaRegistry.findSetObject(p_oGuid['_baseTable']['$ref'], origin);
            if (!meta) throw new ExtendError(/EL061312/, null, [p_oGuid['_baseTable']['$ref']]);
            this._baseTable = meta;
        } else throw new ExtendError(/EL061313/, null, [p_oGuid['_baseTable']['$ref']]);

        this._outputs.setObject(p_oGuid['_outputs'], origin);
        if (p_oGuid['_model']) {
            _model = MetaRegistry.findSetObject(p_oGuid['_model']['$ref'], origin);
            if (!_model) throw new ExtendError(/EL061314/, null, [p_oGuid['_baseTable']['$ref']]);
            this.$model = _model;
        }

        this.valid.setObject(p_oGuid['valid'], origin);
        this.bind.setObject(p_oGuid['bind'], origin);
        this.misc.setObject(p_oGuid['misc'], origin);

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
     * 
     * @abstract 
     */
    BaseBindCommand.prototype.execute = function() {
        throw new ExtendError(/EL061315/, null, [this.constructor.name]);
    };

    /** 
     * execute 메소드 별칭
     */
    BaseBindCommand.prototype.exec = BaseBindCommand.prototype.execute;

    
    /**
     * 컬럼을 추가하고 지정 테이블에 추가하고, 컬럼의 참조를 BaseBindCommand 의 valid, bind, output, misc MetaView 에 등록합니다.
     * 
     * @param {string | MetaColumn} p_column 컬럼
     * @param {string | string[]} p_views 추가할 뷰 엔티티  TODO: 필수 조건으로 변경함, 전체추가시 [] 빈배열 전달
     * @param {string | MetaTable} [p_bTable] 추가할 메타테이블
     */
    BaseBindCommand.prototype.addColumn = function(p_column, p_views, p_bTable) {
        var views = [];     // 파라메터 변수
        var property = [];      // View 실체 
        var collection;
        var table;
        var column;
        var idx;

        // 1.유효성 검사
        if (!(p_column instanceof MetaColumn || _isString(p_column))) {
            throw new ExtendError(/EL061316/, null, []);
        }
        if (typeof p_views !== 'undefined' && (!(Array.isArray(p_views) || typeof p_views === 'string'))) {
            throw new ExtendError(/EL061317/, null, []);
        }
        // if (p_bTable && !(p_bTable instanceof MetaTable)) {
        //     throw new Error('Only [p_bTable] type "MetaTable" can be added');
        // }

        // 2.초기화 설정
        if (Array.isArray(p_views)) views = p_views;
        else if (typeof p_views === 'string') views.push(p_views);
        // $all 일 경우 빈배열로 변경
        if (views.some(function(elem){
            if (!_isString(elem)) throw new ExtendError(/EL061319/, null, [i, typeof views[i]]);
            if (_isAllName(elem)) return true;
            return false;
        })) views.length = 0;


        if (typeof p_bTable === 'string') table = this._model._tables[p_bTable];
        else table = p_bTable || this._baseTable;
        
        if (!(table instanceof MetaTable)) {
            throw new ExtendError(/EL061318/, null, []);
        }
        if (_isString(p_column)) column = new this._model._columnType(p_column, table);
        else column = p_column;

        // baseTable 에 컬럼이 없으면 등록, 중복이름은 기존 이름을 사용함
        if (!table.columns.contains(column))  {
            idx = table.columns.add(column);
            column = table.columns[idx];
        }

        // 3.설정 대상 가져오기
        if (views.length > 0) {
            for (var i = 0; i < views.length; i++) {
                
                // 속성 유무 검사
                if (this[views[i]]) property.push(views[i]);
                else throw new ExtendError(/EL061320/, null, [i, views[i]]);
            }
        } else {
            // 공개(public) BaseEntity 프로퍼티 검사
            property = ['valid', 'bind', 'misc'];
            for (var j = 0; j < this._outputs.count; j++) {
                property.push(this._outputs.indexToKey(j));
            }
        }

        // 4.컬렉션 추가(등록)
        for (var k = 0;  k < property.length; k++) {
            collection = this[property[k]].columns;
            // if (this[property[i]] instanceof MetaView ){
            // } else {
            //     // console.warn('Warning!! [' + property[i] + ']속성이 this 에 없습니다. ');
            //     throw new Error(' Param p_views 에 [' + property[i] + ']가 없습니다. ');
            // }
            collection.add(column, table.columns);
        }
    };

    /**
     * 지정한 이름으로 컬럼과 값을 추가하고, 컬럼의 참조를 BaseBindCommand 의 valid, bind, output MetaView 에 등록합니다.
     * 
     * @param {string} p_name 컬럼명
     * @param {object | string | number | boolean} p_value 컬럼값 또는 속성
     * @param {string | string[]} [p_views] <선택> 추가할 뷰 엔티티
     * @param {string | MetaTable} [p_bTable] 대상 기본 엔티티 
     */
    BaseBindCommand.prototype.addColumnValue = function(p_name, p_value, p_views, p_bTable) {
        var property = {};
        var table;
        var tableName;
        var columnName;
        var column;        
        
        // 유효성 검사
        if (!_isString(p_name)) {
            throw new ExtendError(/EL061321/, null, [typeof p_name]);
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
            throw new ExtendError(/EL061322/, null, []);
        }

        column = new this._model._columnType(columnName, table, property);  // REVIEW: 파라메터 일반화 요구됨
        this.addColumn(column, p_views, table);
    };

    /**
     * 메타테이블의 컬럼을 지정한 MetaView 에 설정합니다.
     * 
     * @param {string | array} p_names 컬럼명
     * @param {string | string[]} [p_views] 설정할 뷰
     * @param {string | MetaTable} [p_bTable] 컬럼을 소유한 메타테이블
     * @example
     * e.read.setEntity(['idx', 'addr'], 'valid');
     */
    BaseBindCommand.prototype.setColumn = function(p_names, p_views, p_bTable) {

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
        if (names.length === 0) throw new ExtendError(/EL061323/, null, []);

        // 아이템 검사 및 등록 함수 this.add(..) 호출
        for(var i = 0; names.length > i; i++) {
            itemName = names[i]; 

            if (!_isString(itemName)) {
                throw new ExtendError(/EL061323/, null, [i, typeof itemName]);
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
                throw new ExtendError(/EL061325/, null, []);
            }

            column = table.columns[columnName];
            if (typeof column !== 'undefined') {
                this.addColumn(column, p_views, table);
            } else {
                throw new ExtendError(/EL061326/, null, [columnName]);
            }
        }
    };

    /**
     * 지정한 컬럼을 대상 MeteView 에서 제거합니다.  (컬럼삭제 아님)
     * 
     * @param {string | string[]} p_names 해제할 아이템명
     * @param {string | string[]} [p_views] 'valid', 'bind', 'output', 'misc' 해제할 뷰 엔티티 지정
     * 
     * @example
     * e.read.release(['idx', 'addr'], 'valid');
     */
    BaseBindCommand.prototype.release = function(p_names, p_views) {

        var names = [];         // 파라메터 변수
        var views = [];      // 파라메터 변수
        var property = [];      // 속성
        var columnName;
        var viewName;

        // 초기화
        if (Array.isArray(p_names)) names = p_names;
        else if (_isString(p_names)) names.push(p_names);
        // 1. 유효성 검사
        if (names.length === 0) throw new ExtendError(/EL061327/, null, []);
        if (typeof p_views !== 'undefined' && (!(Array.isArray(p_views) || typeof p_views === 'string'))) {
            throw new ExtendError(/EL061328/, null, []);
        } 
        // 2. 초기화 설정
        if (Array.isArray(p_views)) views = p_views;
        else if (typeof p_views === 'string') views.push(p_views);
        // $all 일 경우 빈배열로 변경
        if (views.some(function(elem){
            if (!_isString(elem)) throw new ExtendError(/EL061329/, null, [i, typeof views[i]]);
            if (_isAllName(elem)) return true;
            return false;
        })) views.length = 0;
        
        // 3. 설정 대상 가져오기
        if (views.length > 0) {
            for (var i = 0; i < views.length; i++) {
                viewName = views[i];
                if (!_isString(viewName)) throw new ExtendError(/EL061329/, null, [i, typeof viewName]);
                // 속성 유무 검사
                if (this[viewName]) property.push(viewName);
                else throw new ExtendError(/EL061330/, null, [viewName]);
            }
        } else {
            property = ['valid', 'bind', 'misc'];
            for (var j = 0; j < this._outputs.count; j++) {
                property.push(this._outputs.indexToKey(j));
            }
        }
        // 4. 아이템 검사 및 아이템 해제
        for(var k = 0; names.length > k; k++) {
            columnName = names[k]; 
            for (var m = 0; property.length > m; m++) {
                var idx = this[property[m]].columns.keyToIndex(columnName);
                if (idx > -1) this[property[m]].columns.removeAt(idx);
            }
        }
    };

    /**
     * _output MetaViewCollection 에 MetaView 을 추가합니다.  
     * -  기본 이름 =  'output' + _outout.count  
     * 
     * @param {string} [p_name] MetaView 이름
     */
    BaseBindCommand.prototype.newOutput = function(p_name) {
        var _this = this;
        var cntName = 'output' + (Number(this._outputs.count) + 1);

        // 유효성 검사
        if (p_name && !_isString(p_name)) throw new ExtendError(/EL061331/, null, [typeof p_name]);

        // 이름 추가
        $addOutput(cntName);

        // 참조 이름 추가
        if (_isString(p_name)) {
            if (!$checkDoubleName(p_name)) {
                throw new ExtendError(/EL061332/, null, [typeof p_name]);
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
     * 
     * @param {string} p_name 
     */
    BaseBindCommand.prototype.removeOutput = function(p_name) {
        // var idx = this._outputs.indexToKey(p_name);
        var defOutput = this['output'];
        var view;
        var pos;

        if (!_isString(p_name)) throw new ExtendError(/EL061333/, null, [typeof p_name]);
        
        view = this[p_name];
        if (view === defOutput)  throw new ExtendError(/EL061334/, null, [p_name]);
        
        if (this._outputs.indexOf(view) < 0) throw new ExtendError(/EL061335/, null, [p_name]);

        pos = this.$newOutput.indexOf(p_name);

        delete this[p_name];
        this.$newOutput.splice(pos, 1);
        this._outputs.remove(view);
    };

    return BaseBindCommand;

}(BaseBind));

export default BaseBindCommand;
export { BaseBindCommand };