/**** bind-command-ajax.js | BindCommand ****/
//==============================================================
import { ExtendError }                  from 'logic-entity';
import { Util }                         from './util-wrap.js';
import { BaseBindCommand }              from './base-bind-command.js';
// import { OUT_TYPE }                     from './base-bind-command.js';
// import { SCHEMA_TYPE }                  from './base-bind-command.js';
// import { getOptionNumber }              from './base-bind-command.js';
import axios                            from 'axios';

var EXEC_STATE = {
    INIT: 0,
    ON_EXECUTE: 1,
    BEGIN: 2,
    VALID: 3,
    BIND: 4,
    RESULT: 5,
    OUTPUT: 6,
    END: 7,
    ON_EXECUTED: 8
};

var BindCommand  = (function (_super) {
    /**
     * 바인드 명령 Ajax 
     * 
     * @constructs BindCommand
     * @extends BaseBindCommand
     * @param {BaseBindModel} p_BaseBindModel 출력 옵션 
     * @param {obejct | number | string} p_outputOption 
     * @param {Entity} p_baseTable 
     */
    function BindCommand(p_BaseBindModel, p_outputOption, p_baseTable) {
        _super.call(this, p_BaseBindModel, p_baseTable);

        var config = {
            url: null,              // 요청 경로
            method: null,           // 전송 방법 : GET, POST TODO: method 교체 요망
            responseType: null      //      TODO: responseType 으로 교체 요망
        };
        
        /**
         * config 설정값 (jquery의 config 과 동일)
         * 
         * @member {Object} BindCommand#config 
         */
        Object.defineProperty(this, 'config', {
            get: function() { return config; },
            set: function(nVal) {
                if (typeof nVal === 'object') {
                    if (typeof nVal['url'] === 'string')            config['url'] = nVal['url'];
                    if (typeof nVal['method'] === 'string')           config['method'] = nVal['method'];
                    if (typeof nVal['responseType'] === 'string')       config['responseType'] = nVal['responseType'];
                    for (var prop in nVal) {
                        if (prop === 'url' || prop === 'method' || prop === 'responseType') continue;
                        config[prop] = nVal[prop];
                    }
                } else throw new ExtendError(/EL06161/, null, [this.constructor.name]);
            },
            configurable: true,
            enumerable: true
        });
        
        /**
         * config.url 의 값에 설정한다.
         * 
         * @member {String} BindCommand#url 
         */
        Object.defineProperty(this, 'url', {
            get: function() { return config.url; },
            set: function(nVal) {
                if (!(_isString(nVal))) throw new ExtendError(/EL06162/, null, [this.constructor.name]);
                config.url = nVal;
            },
            configurable: true,
            enumerable: true
        }); 

        // outputOption 설정
        if (p_outputOption) this.outputOption = p_outputOption;

        // 예약어 등록
        this.$KEYWORD = ['config', 'url'];
        this.$KEYWORD = ['_execValid', '_execBind', '_execOutput'];
        this.$KEYWORD = ['_ajaxSuccess', '_execError', '_ajaxComplete', '_ajaxCall'];
    }
    Util.inherits(BindCommand, _super);

    BindCommand._UNION = [];
    BindCommand._NS = 'Meta.Bind';
    BindCommand._PARAMS = ['_model', 'outputOption', '_baseTable'];
    
    // local function
    function _isString(obj) {    // 공백아닌 문자 여부
        if (typeof obj === 'string' && obj.length > 0) return true;
        return false;
    }

    function _isObject(obj) {
        if (obj !== null && typeof obj === 'object' && !Array.isArray(obj)) return true;
        return false;
    }

    /**
     * execute() 실행시 처음으로 실행됩니다.  
     * 
     * @protected
     */
    BindCommand.prototype._execBegin = function() {
        this.state = EXEC_STATE.ON_EXECUTE;
        this._model._onExecute(this._model, this);
        this._onExecute(this._model, this);         // '실행 시작' 이벤트 발생

        this.state = EXEC_STATE.BEGIN;
        if (typeof this.cbBegin === 'function' ) {
            this.cbBegin.call(this, this._model, this);
        } else if (typeof this._model.cbBaseBegin === 'function') {
            this._model.cbBaseBegin.call(this, this._model, this);
        }
    };

    /** 
     * cbValid 콜백함수를 실행하고 view(MetaView)의 유효성을 검사합니다.
     * 
     * @returns {boolean} 유효성 검사 결과
     * @protected
     */
    BindCommand.prototype._execValid = function() {
        var result = {};     // 오류 참조 변수
        var value = null;
        var bReturn = true;

        this.state = EXEC_STATE.VALID;
        // 콜백 검사 (valid)
        if (typeof this.cbValid  === 'function') {
            bReturn = this.cbValid.call(this, this.valid, this, this._model);
        } else if (typeof this._model.cbBaseValid  === 'function') {
            bReturn = this._model.cbBaseValid.call(this, this.valid, this, this._model);
        }

        // undefined 회신을 안할 경우
        // bReturn = typeof bReturn !== 'boolean' ? true : bReturn;
        
        // if (bReturn === false)

        // valid 검사 결과
        // if (!bReturn) {
        //     this._execFail('valid 검사가 실패하였습니다.');
        //     return false;
        // }
        if (!bReturn) {     // undefind 는 종료하지만, 실패 처리는 하지 않는다.
            if (bReturn === false) this._execFail('valid 검사가 실패하였습니다.');
            return false;
        }

        // 아이템 검사
        for(var i = 0; i < this.valid.columns.count; i++) {
            value = this.valid.columns[i].value;
            
            // 공백 && isNotNull = false    => 검사 넘어감
            // 공백 && isNotNull = true     => 오류 리턴
            // 값존재시                     => 검사 수행
            // if (value.length > 0 || this.valid.columns[i].isNotNull) {
            // if (typeof this.valid.columns[i].valid(value, result, 2) !== 'undefined') {
            result = this.valid.columns[i].valid(value);
            if (result) {
                this._execFail(result.msg);
                return false;
            }
        }
        return true;
    };

    /**
     * cbBind 콜백함수를 실행하고, ajax 을 호출합니다.
     * 
     * @returns {Promise} 프로미스 객체를 리턴합니다.
     * @protected
     */
    BindCommand.prototype._execBind = function() {
        var value;
        var column;
        var config = {};
        
        this.state = EXEC_STATE.BIND;
        // 기본값 못가져오는 오류 변경함 
        config.url           = this.config.url || this._model.baseConfig.url;
        config.method          = this.config.method || this._model.baseConfig.method;
        config.responseType      = this.config.responseType || this._model.baseConfig.responseType;

        for (var prop in this.config) {
            if (typeof config[prop] !== 'undefined') continue;
            config[prop] = this.config[prop];
        }
        
        for (var prop2 in this._model.baseConfig) {
            if (typeof config[prop2] !== 'undefined') continue;
            config[prop2] = this._model.baseConfig[prop2];
        }

        if (!_isObject(config.data)) config.data = {};
        for(var i = 0; i < this.bind.columns.count; i++) {
            var dataName = '';
            column = this.bind.columns[i];
            value = column.value || column.default;
            dataName = column.alias;
            // data가 bind Column 보다 우선순위가 높음
            if (typeof config.data[dataName] === 'undefined') config.data[dataName] = value;    // 별칭에 설정, 없을시 기본 name
        }
        
        // 콜백 검사 (bind)
        if (typeof this.cbBind === 'function') {
            this.cbBind.call(this, this.bind, this, config);
        } else if (typeof this._model.cbBaseBind === 'function') {
            this._model.cbBaseBind.call(this, this.bind, this, config);
        }
        return this._ajaxCall(config);       // Ajax 호출 (web | node)
    };

    /**
     * ajax 호출하고 성공시, cbResult 콜백함수로 결과(data)를 변경합니다.
     * 
     * @param {object} p_data  데이터
     * @param {object} p_res response 객체
     * @returns {object} data
     * @protected
     */
    BindCommand.prototype._execResult = function(p_data, p_res) {
        var data = p_data;

        this.state = EXEC_STATE.RESULT;
        if (typeof this.cbResult === 'function' ) {
            data = this.cbResult.call(this, p_data, this, p_res) || p_data;
        } else if (typeof this._model.cbBaseResult === 'function' ) {
            data = this._model.cbBaseResult.call(this, p_data, this, p_res) || p_data;
        }
        
        return data;
    };

    /**
     * 결과 data 로 outputs ViewCollection 을 설정하고, cbOutput 콜백함수를 호출합니다.
     * 
     * @param {object} p_data data
     * @param {object} p_res response 객체
     * @protected
     */
    BindCommand.prototype._execOutput = function(p_data, p_res) {
        var _this = this;
        var data  = p_data;
        var option = this.outputOption.option;
        var index = this.outputOption.index;
        var schema = this.outputOption.schema;
        // var loadOption = (option === 1) ? 3  : (option === 2 || option === 3) ? 2 : 0;
        var loadOption = (option === 'ALL') ? 3  : (option === 'PICK' || option === 'VIEW') ? 2 : 0;

        // TODO: result 타입 검사 추가  

        this.state = EXEC_STATE.OUTPUT;

        // 1. 초기화 : opt = 1
        for (var i = 0; this._outputs.count > i; i++) {
            if (loadOption === 1) this._outputs[i].clear();  // 전체 초기화 (item, rows)
            else this._outputs[i].rows.clear();              // Row 초기화
        }
        
        /**
         * - {columns, row}
         * - {props: {colums, rows}, ... }
         * - [ {columns, rows}, ...]
         * - [ {props: {colums, rows} } ] = > X
         */

        // 2-1. schema 타입에 따라 rows 로 변경
        if (schema === 'AUTO') {
            if (_isObject(data) && typeof data['rows'] === 'undefined') {
                data = { 'rows': data };
            } else if (Array.isArray(data) && data.length > 0) {
                for (var j = 0; j < data.length; j++) {
                    if (!_isObject(data[j])) throw new ExtendError(/EL06167/, null, [j, typeof data[j]]); // 순서, 타입
                }
                data = { 'rows': data };  // 배열인 경우 rows 로 변경
            }        
        } else if (schema === 'DATA') {
            if (_isObject(data)) {
                data = { 'rows': data };
            } else if (Array.isArray(data) && data.length > 0) { // 중복
                for (var k = 0; k < data.length; k++) {
                    if (!_isObject(data[k])) throw new ExtendError(/EL06167/, null, [k, typeof data[k]]); // 순서, 타입
                }
                data = { 'rows': data };
            }
        } else if (schema === 'ENTITY') {
            if (Array.isArray(data) && data.length > 0) {
                var list = [];
                for (var o = 0; o < data.length; o++) {
                    if (!_isObject(data[o])) throw new ExtendError(/EL06167/, null, [o, typeof data[o]]); // 순서, 타입
                    if (typeof data[o]['rows'] === 'undefined') {
                        list.push({ 'rows': data[o] });
                    } else {
                        list.push(data[o]);  // rows 가 있는 경우 그대로 사용
                    }
                }
                data = list;
            }
        }

        // 2-2. 결과 MetaView 에 로딩
        if ($isEntitySchema(data)) {    // 단일 엔티티
            $readOutput(data, 0, loadOption); 
        } else if (Array.isArray(data)) { // 복수 엔티티
            for (var p = 0; p < data.length; p++) {
                $readOutput(data[p], p, loadOption);
            }
        } else {
            throw new ExtendError(/EL06163/, null, [typeof data]);
        }   

        // if ($isEntitySchema(data)) {
        //     $readOutput(data, 0, loadOption);
        // } else {
        //     if (Array.isArray(data)) {
        //         for (var j = 0; j < data.length; j++) {
        //             $readOutput(data[j], j, loadOption);
        //         }

        //     } else if (_isObject(data)){
        //         var k = 0;
        //         for (var prop in data) {
        //             $readOutput(data[prop], k, loadOption);
        //             k++;
        //         }
        //     } else {
        //         throw new ExtendError(/EL06163/, null, [typeof data]);
        //     }
        // }


        // 3. 존재하는 아이템 중에 지정된 값으로 설정
        if (option === 'VIEW') {
            if (Array.isArray(index)) {
                for (var m = 0; m < this._outputs.count && m < index.length; m++) {
                    $setOutputValue(index[m], m);
                }
            } else {
                for (var n = 0; this._outputs.count > n; n++) {
                    $setOutputValue(index, n);
                }
            }
        }

        // 콜백 검사 (Output)
        if (typeof this.cbOutput === 'function' ) {
            this.cbOutput.call(this,  this._outputs, this, p_res);
        } else if (typeof this._model.cbBaseOutput === 'function' ) { 
            this._model.cbBaseOutput.call(this, this._outputs, this, p_res);
        }

        // inner function
        function $isEntitySchema(target) {
            if (target['rows'] || target['columns'] ) return true;
            return false;
        }
        function $readOutput(entity, cnt, readOpt) {
            // var idx = cnt > 0 ? cnt - 1 : 0;
            // var idx = cnt - 1;
            if (readOpt === 3 && typeof _this._outputs[cnt] === 'undefined') {
                _this.newOutput();
            }
            _this._outputs[cnt].read(entity, readOpt);
        }
        function $setOutputValue(rowIdx, i) {
            if (typeof rowIdx !== 'number') throw new ExtendError(/EL06164/, null, [i, typeof rowIdx]);
            if (_this._outputs[i].columns.count === 0) throw new ExtendError(/EL06165/, null, [i]);
            if (_this._outputs[i].rows.count - 1 < rowIdx) throw new ExtendError(/EL06166/, null, [i, rowIdx]);
            _this._outputs[i].setValue(_this._outputs[i].rows[rowIdx]);
        }
    };

    /**
     * excute() 실행 후 마지막으로 cbEnd 콜백함수를 호출합니다.
     * 
     * @param {object} p_status 상태값
     * @param {object} p_res response
     * @protected
     */
    BindCommand.prototype._execEnd = function(p_status, p_res) {
        try {
            if (this.state > 0) this.state = EXEC_STATE.END;

            if (typeof this.cbEnd === 'function' ) {
                this.cbEnd.call(this, p_status, this, p_res);
            } else if (typeof this._model.cbBaseEnd === 'function') {
                this._model.cbBaseEnd.call(this, p_status, this, p_res);
            }

            if (this.state > 0) this.state = EXEC_STATE.ON_EXECUTED;
            this._onExecuted(this._model, this);
            this._model._onExecuted(this._model, this);
            
        } catch (err) {
            // var msg = 'Err: _execEnd(cmd='+ this.name +') message:'+ err.message;
            // this._execError(msg, p_status, p_res);
            throw new ExtendError(/EL06168/, err, [p_status]);
        }
    };

    /**
     * 오류 발생시 호출됩니다. (cbError 콜백함수 호출)
     * 
     * @param {string} p_error 에러 메세지
     * @param {string} p_status  상태값
     * @param {string} p_res response
     * @protected
     */
    BindCommand.prototype._execError = function(p_error, p_status, p_res) {
        var msg = p_error;
        
        if (this.state > 0) this.state = this.state * -1;
        if (p_res && p_res.statusText) msg += ', statusText: '+ p_res.statusText;
        this._model.cbError.call(this, msg, p_status, p_res);
    };

    /**
     * excute() 실행시 유효성 검사가 실패하면 호출됩니다.
     * 
     * @param {string} p_msg 실패 메세지
     */
    BindCommand.prototype._execFail = function(p_msg) {
        if (this.state > 0) this.state = this.state * -1;
        this._model.cbFail.call(this, p_msg, this.valid);
    };

    /**
     * ajax 를 호출합니다. (axios)
     * 
     * @param {object} p_config axios 설정
     * @protected
     */
    BindCommand.prototype._ajaxCall = function(p_config) {
        var _this = this;
        var config = {};

        // return axios(p_config)
        //     .then(function(res){
        //         _this._ajaxSuccess.call(_this, res.data, res.status, res);
        //     })
        //     .catch(function(err){
        //         var status = '';
        //         if (err.response && err.response.status) status = err.response.status;  // Branch:
        //         _this._execError.call(_this, err, status, err.response);
        //         _this._execEnd(err.status, err.response);
        //     });
        
        for (var prop in p_config) {
            if (prop === 'url' || prop === 'method' || prop === 'data') continue;
            config[prop] = p_config[prop];
        }
        if (p_config.method === 'GET') {            // 요청
            // TODO:
            // data 를 params 문자열로 변환 필요
            // 데이터 전송 여부 확인 필요
            return axios.get(p_config.url, config)
                .then(function(res){
                    return _this._ajaxSuccess.call(_this, res.data, res.status, res);
                })
                .catch(function(err){
                    _this._execError.call(_this, err);
                    return Promise.reject(err);
                })
                .finally(function() {
                    _this._execEnd.call(_this);
                });

        } else if (p_config.method === 'DELETE') {  // 삭제
            return axios.delete(p_config.url, p_config.data, config)
                .then(function(res){
                    return _this._ajaxSuccess.call(_this, res.data, res.status, res);
                })
                .catch(function(err){
                    _this._execError.call(_this, err);
                    return Promise.reject(err);
                })
                .finally(function() {
                    _this._execEnd.call(_this);
                });

        } else if (p_config.method === 'POST') {    // 추가
            return axios.post(p_config.url, p_config.data, config)
                .then(function(res){
                    return _this._ajaxSuccess.call(_this, res.data, res.status, res);
                })
                .catch(function(err){
                    _this._execError.call(_this, err);
                    return Promise.reject(err);
                })
                .finally(function() {
                    _this._execEnd.call(_this);
                });
                
        } else if (p_config.method === 'PUT') {    // 수정 
            return axios.put(p_config.url, p_config.data, config)
                .then(function(res){
                    return _this._ajaxSuccess.call(_this, res.data, res.status, res);
                })
                .catch(function(err){
                    _this._execError.call(_this, err);
                    return Promise.reject(err);
                })
                .finally(function() {
                    _this._execEnd.call(_this);
                });


        } else if (p_config.method === 'PATCH') {   // 일부 수정
            return axios.patch(p_config.url, p_config.data, config)
                .then(function(res){
                    return _this._ajaxSuccess.call(_this, res.data, res.status, res);
                })
                .catch(function(err){
                    _this._execError.call(_this, err);
                    return Promise.reject(err);
                })
                .finally(function() {
                    _this._execEnd.call(_this);
                });

        } else {
            throw new ExtendError(/EL06169/, null, [p_config.method]);
        }
    };

    /**
     * ajax 호출이 성공할 경우 호출됩니다.
     * 
     * @param {*} p_data 데이터
     * @param {*} p_status 상태값
     * @param {*} p_res response
     * @protected
     */
    BindCommand.prototype._ajaxSuccess = function(p_data, p_status, p_res) {
        var option = this.outputOption.option;
        var data;
        
        data = typeof p_data === 'object' ? p_data : JSON.parse(JSON.stringify(p_data));
        data = this._execResult(data, p_res);

        if (option !== 'SEND') this._execOutput.call(this, data, p_res);
    };

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
    BindCommand.prototype.getObject = function(p_vOpt, p_owned) {
        var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
        // var vOpt = p_vOpt || 0;
        // var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

        obj['config'] = this.config;
        return obj;                        
    };

    /**
     * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.   
     * 
     * @param {object} p_oGuid guid 타입의 객체
     * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
     * 기본값은 p_oGuid 객체와 동일
     */
    BindCommand.prototype.setObject = function(p_oGuid, p_origin) {
        _super.prototype.setObject.call(this, p_oGuid, p_origin);
        
        // var origin = p_origin ? p_origin : p_oGuid;
        // var entity;
        
        this.config = p_oGuid['config'];
    };

    /**
     * command 을 실행합니다.  
     * 실행 순서 <정상흐름>  
     *  _execBegin() >> _execValid() >> execBind() >>  
     *  [콜백] _execResult() >> _execOutput() >> _execEnd()  
     * 
     * @param {object | string | number} [p_outOpt] 출력 옵션
     * @param {object | string} [p_config] axios 설정 또는 url
     * @returns {Promise} 프로미스 객체
     */
    BindCommand.prototype.execute = function(p_outOpt, p_config) {
        var _this = this;
        var isFail = false;
        // var outOpt;

        try {
            this.state = EXEC_STATE.INIT;
            
            if (p_outOpt) this.outputOption = p_outOpt;
            
            // config 설정
            if (_isString(p_config)) this.url = p_config;
            else if (_isObject(p_config)) this.config = p_config;
            
            this._execBegin();

            if (!this._execValid()) {
                isFail = true;
                this.state = this.state * -1;
                this._execEnd.call(this);
                // return null;
                return Promise.resolve(null);
            }
            return this._execBind();

        } catch (err) {
            if (this.state > 0) this.state = this.state * -1;
            // var msg = 'Err:execue(cmd='+ _this.name +') message:'+ err.message;
            // this._execError(msg);
            this._execError.call(this, err);
            if (!isFail) this._execEnd.call(this);
            return Promise.reject(err);  // 에러 → 실패한 Promise 반환
        }
    };

    /** 
     * execute 메소드 별칭
     */
    BindCommand.prototype.exec = BindCommand.prototype.execute;

    return BindCommand;

}(BaseBindCommand));

export default BindCommand;
export { BindCommand };