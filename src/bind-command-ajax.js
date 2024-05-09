/**** bind-command-ajax.js | _L.Meta.Bind.BindCommandAjax ****/

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
        var _BindCommand                = require('./bind-command').BindCommand;
        var _axios                      = require('axios').default;
    } else {
        var $Message                    = _global._L.Message;
        var $ExtendError                = _global._L.ExtendError;
        var $Util                       = _global._L.Util;
        var $BindCommand                = _global._L.BindCommand;
        var $axios                      = _global.axios;
    }
    var Message                 = _Message              || $Message;
    var ExtendError             = _ExtendError          || $ExtendError;
    var Util                    = _Util                 || $Util;
    var BindCommand             = _BindCommand          || $BindCommand;
    var axios                   = _axios                || $axios;

    //==============================================================
    // 3. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    if (typeof BindCommand === 'undefined') throw new Error(Message.get('ES011', ['BindCommand', 'bind-command']));
    if (typeof axios === 'undefined') throw new Error(Message.get('ES011', ['axios', 'axios']));

    //==============================================================
    // 4. module implementation
    //--------------------------------------------------------------
    // implementation
    var BindCommandAjax  = (function (_super) {
        
        /**
         * 바인드 명령 Ajax 
         * @constructs _L.Meta.Bind.BindCommandAjax
         * @extends _L.Meta.Bind.BindCommand
         * @param {BindModel} p_bindModel 
         * @param {Number | obejct} p_outputOption 
         * @param {Entity} p_baseTable 
         */
        function BindCommandAjax(p_bindModel, p_outputOption, p_baseTable) {
            _super.call(this, p_bindModel, p_baseTable);

            var config = {
                url: null,              // 요청 경로
                method: null,           // 전송 방법 : GET, POST TODO: method 교체 요망
                responseType: null      //      TODO: responseType 으로 교체 요망
            };
            
            /**
             * config 설정값 (jquery의 config 과 동일)
             * @member {Object} _L.Meta.Bind.BindCommandAjax#config 
             */
            Object.defineProperty(this, 'config', 
            {
                get: function() { return config; },
                set: function(nVal) { 
                    if (typeof nVal === 'object') {
                        if (typeof nVal['url'] === 'string')            config['url'] = nVal['url'];
                        if (typeof nVal['method'] === 'string')           config['method'] = nVal['method'];
                        if (typeof nVal['responseType'] === 'string')       config['responseType'] = nVal['responseType'];
                    } else throw new Error('Only [config] type "number | object {....}" can be added');
                },
                configurable: true,
                enumerable: true
            });
            
            /**
             * config.url 의 값에 설정한다.
             * @member {String} _L.Meta.Bind.BindCommandAjax#url 
             */
            Object.defineProperty(this, 'url', 
            {
                get: function() { return config.url; },
                set: function(nVal) {
                    if (!(_isString(nVal))) throw new Error('Only [url] type "string" can be added');
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
        Util.inherits(BindCommandAjax, _super);

        BindCommandAjax._UNION = [];
        BindCommandAjax._NS = 'Meta.Bind';
        BindCommandAjax._PARAMS = ['_model', 'outputOption', '_baseTable'];
        
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
         * 
         * @param {object} p_data 
         * @protected
         */
        BindCommandAjax.prototype._execBegin = function() {
            this._model._onExecute(this, this._model);  // '실행 시작' 이벤트 발생
            this._onExecute(this, this._model);         // '실행 시작' 이벤트 발생

            if (typeof this.cbBegin === 'function' ) this.cbBegin.call(this, this._model, this);
            else if (typeof this._model.cbBaseBegin === 'function') this._model.cbBaseBegin.call(this, this._model, this);
        };

        /** 
         * valid.columns.. 검사한다.
         * @protected
         */
        BindCommandAjax.prototype._execValid = function() {
            var result = {};     // 오류 참조 변수
            var value = null;
            var bReturn = true;

            // 콜백 검사 (valid)
            if (typeof this.cbValid  === 'function') bReturn = this.cbValid.call(this, this.valid);
            else if (typeof this._model.cbBaseValid  === 'function') bReturn = this._model.cbBaseValid.call(this, this.valid);

            // undefined 회신을 안할 경우
            bReturn = typeof bReturn !== 'boolean' ? true : bReturn;

            // valid 검사 결과
            if (!bReturn) {
                this._execFail('valid 검사가 실패하였습니다.');
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
         * Ajax 바인딩 구현
         * @protected
         */
        BindCommandAjax.prototype._execBind = function() {
            var value;
            var column;
            var config = {};
            
            // 기본값 못가져오는 오류 변경함 
            config.url           = this.config.url || this._model.baseConfig.url;
            config.method          = this.config.method || this._model.baseConfig.method;
            config.responseType      = this.config.responseType || this._model.baseConfig.responseType;

            for(var i = 0; i < this.bind.columns.count; i++) {
                // if(!_isObject(config.data)) config.data = {};
                config.data = _isObject(this.config.data) ? this.config.data : {};
                column = this.bind.columns[i];
                value = column.value || column.default;     // 값이 없으면 기본값 설정
                //config.data[item.name] = value;
                config.data[column.alias] = value;     // 별칭에 설정, 없을시 기본 name
            }
            
            // 콜백 검사 (bind)
            if (typeof this.cbBind === 'function') this.cbBind.call(this, config, this);
            else if (typeof this._model.cbBaseBind === 'function') this._model.cbBaseBind.call(this, config, this);
            
            return this._ajaxCall(config);       // Ajax 호출 (web | node)
        };

        /**
         * 
         * @param {object} p_data 
         * @protected
         */
        BindCommandAjax.prototype._execResult = function(p_data) {
            var data = p_data;

            if (typeof this.cbResult === 'function' ) data = this.cbResult.call(this, p_data) || p_data;
            else if (typeof this._model.cbBaseResult === 'function' ) data = this._model.cbBaseResult.call(this, p_data) || p_data;
            
            return data;
        };

        /**
         * 콜백
         * @param {*} p_result 
         */
        BindCommandAjax.prototype._execOutput = function(p_result, p_status, p_xhr) {
            var _this = this;
            var option = this.outputOption.option;
            var index = this.outputOption.index;
            var loadOption = option === 1 ? 3  : (option === 2 || option === 3) ? 2 : 0;    // Branch:
            var result  = p_result;

            // TODO: result 타입 검사 추가  

            // ouputOption = 1,2,3  : 출력모드의 경우
                
            // 1. 초기화 : opt = 1
            // for (var i = 0; this._output.count > i; i++) {
                // if (loadOption === 1) this._outputs[i].clear();  // 전체 초기화 (item, rows)
                // else this._outputs[i].rows.clear();              // Row 초기화
            // }
            
            /**
             * - {columns, row}
             * - {props: {colums, rows}, ... }
             * - [ {columns, rows}, ...]
             * - [ {props: {colums, rows} } ] = > X
             */

            // 2. 결과 MetaView 에 로딩
            if ($isEntitySchema(result)) {
                $readOutput(result, 1, loadOption);
            } else {
                if (Array.isArray(result)) {
                    for (var i = 0; i < result.length; i++) {
                        $readOutput(result[i], i + 1, loadOption);
                    }

                } else if (_isObject(result)){
                    var i = 0;
                    for (var prop in result) {
                        $readOutput(result[prop], i + 1, loadOption);
                        i++;
                    }
                } else {
                    throw new Error('result 는 스키마 구조를 가지고 있지 않습니다.');   // Line:
                }
            }
            
            // 3. 존재하는 아이템 중에 지정된 값으로 설정
            if (option === 3) {
                if (Array.isArray(index)) {
                    for (var i = 0; i < this._outputs.count && i < index.length; i++) {
                        $setOutputValue(index[i]);
                    }
                } else {
                    for (var i = 0; this._outputs.count > i; i++) {
                        $setOutputValue(index);
                    }
                }
            }

            // 콜백 검사 (Output)
            if (typeof this.cbOutput === 'function' ) this.cbOutput.call(this, result);
            else if (typeof this._model.cbBaseOutput === 'function' ) this._model.cbBaseOutput.call(this, result);

            // inner function
            function $isEntitySchema(target) {
                if (target['rows'] || target['columns'] ) return true;
                else false;
            }
            function $readOutput(entity, cnt, readOpt) {
                // var idx = cnt > 0 ? cnt - 1 : 0;
                var idx = cnt - 1;
                if (readOpt === 3 && typeof _this._outputs[idx] === 'undefined') {
                    _this.newOutput();
                }
                _this._outputs[idx].read(entity, readOpt);
            }
            function $setOutputValue(rowIdx) {
                if (typeof rowIdx !== 'number') throw new Error('option ['+i+']번째 인덱스가 숫자가 아닙니다.');
                if (_this._outputs[i].columns.count === 0) throw new Error('['+i+']번째 레코드에 컬럼이 존재하지 않습니다.');
                if (_this._outputs[i].rows.count - 1 < rowIdx) throw new Error('결과에 ['+i+']번째 레코드의 ['+rowIdx+']번째 row가 존재 하지 않습니다. ');
                _this._outputs[i].setValue(_this._outputs[i].rows[rowIdx]);
            }
        };

        /**
         * 
         * @protected
         */
        BindCommandAjax.prototype._execEnd = function(p_status, p_res) {
            try {
                if (typeof this.cbEnd === 'function' ) this.cbEnd.call(this, p_status, p_res);
                else if (typeof this._model.cbBaseEnd === 'function') this._model.cbBaseEnd.call(this, p_status, p_res);  
    
                this._onExecuted(this, this._model);
                this._model._onExecuted(this, this._model);
                
            } catch (err) {
                var msg = 'Err: _execEnd(cmd='+ this.name +') message:'+ err.message;
                this._execError(msg, p_status, p_res);
            }
        };

        /**
         * AJAX 를 기준으로 구성함 (requst는 맞춤)
         * error(xhr,status,error)
         * @param {XMLHttpRequest} p_xhr 
         * @param {string} p_status 
         * @param {string} p_error 
         * @protected
         */
        BindCommandAjax.prototype._execError = function(p_error, p_status, p_xhr) {
            var msg = p_xhr && p_xhr.statusText ? p_xhr.statusText : p_error;       // Branch:

            this._model.cbError.call(this, 'ajax error: '+ msg, p_status);
        };

        /**
         * 유효성 검사 실패
         * @param {string} p_msg 실패 메세지
         */
        BindCommandAjax.prototype._execFail = function(p_msg) {
            
            this._model.cbFail.call(this, p_msg, this, this._model);
        };

        /**
         * POINT: 오라이딩
         * @param {*} p_config 
         */
        BindCommandAjax.prototype._ajaxCall = function(p_config) {
            var _this = this;

            if (p_config.method === 'GET') {
                return axios.get(p_config.url, {
                        data: p_config.data,
                        responseType: p_config.responseType,
                    })
                    .then(function(res){
                        _this._ajaxSuccess.call(_this, res.data, res.status, res);
                    })
                    .catch(function(err){
                        _this._execError.call(_this, err, err.status, err.response);
                        _this._execEnd(err.status, err.response);
                    });

            } else if (p_config.method === 'POST') {
                return axios.post(p_config.url, {
                        data: p_config.data,
                        responseType: p_config.responseType,
                    })
                    .then(function(res){
                        _this._ajaxSuccess.call(_this, res.data, res.status, res);
                    })
                    .catch(function(err){
                        _this._execError.call(_this, err, err.status, err.response);    // Line:
                        _this._execEnd(err.status, err.response);                       // Line:
                    });
            }
        };

        /**
         * 실행 성공
         * jquery.ajax.success 콜백
         * @param {*} p_result 
         * @param {*} p_status 
         * @param {*} p_xhr 
         * @protected
         */
        BindCommandAjax.prototype._ajaxSuccess = function(p_data, p_status, p_xhr) {
            var option = this.outputOption.option;
            var data;
            
            try {

                data = typeof p_data === 'object' ? p_data : JSON.parse(JSON.stringify(p_data));

                data = this._execResult(data);

                if (option > 0) this._execOutput(data, p_status, p_xhr);
                
            } catch (error) {
                this._execError(error, p_status, p_xhr);
                
            } finally {
                this._execEnd(p_status, p_xhr);
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
        BindCommandAjax.prototype.getObject = function(p_vOpt, p_owned) {
            var obj = _super.prototype.getObject.call(this, p_vOpt, p_owned);
            var vOpt = p_vOpt || 0;
            var owned = p_owned ? [].concat(p_owned, obj) : [].concat(obj);

            obj['config'] = this.config;
            return obj;                        
        };

        /**
         * 현재 객체를 초기화 후, 지정한 guid 타입의 객체를 사용하여 설정합니다.   
         * @param {object} p_oGuid guid 타입의 객체
         * @param {object} [p_origin] 현재 객체를 설정하는 원본 guid 객체  
         * 기본값은 p_oGuid 객체와 동일
         */
        BindCommandAjax.prototype.setObject = function(p_oGuid, p_origin) {
            _super.prototype.setObject.call(this, p_oGuid, p_origin);
            
            var origin = p_origin ? p_origin : p_oGuid;
            var entity;

            this.config = p_oGuid['config'];
        };

        /**
         * 실행 
         */
        BindCommandAjax.prototype.execute = function() {
            var _this = this;

            try {

                this._execBegin();

                if (!this._execValid()) this._execEnd();
                else return this._execBind();

            } catch (err) {     // Line:
                var msg = 'Err:execue(cmd='+ _this.name +') message:'+ err.message;
                this._execError(msg);
                this._execEnd();                
            }
        };

        return BindCommandAjax;
    
    }(BindCommand));
    
    //==============================================================
    // 5. module export
    if (isNode) {     
        exports.BindCommandAjax                = BindCommandAjax;
    } else {
        _global._L.BindCommandAjax             = BindCommandAjax;
        // namespace
        _global._L.Meta.Bind.BindCommandAjax   = BindCommandAjax;
    }

}(typeof window !== 'undefined' ? window : global));