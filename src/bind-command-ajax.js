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
        var $axios                       = _global.axios;
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
                url: null,          // 요청 경로
                method: null,         // 전송 방법 : GET, POST TODO: method 교체 요망
                responseType: null,     //      TODO: responseType 으로 교체 요망
                // async: null,        // [*]비동기(ture), 동기(false) TODO: 제거 요망
                // crossDomain: null,  // 크로스 도메인    TODO: 제거 요망
                // success: null,      // 성공 콜백
                // error: null,        // 실패 콜백
                // complete: null      // 완료 콜백    // TODO: 제거 요망
                /**
                 * TODO: 필요항목
                 * - headers :
                 * - params : ?
                 * - url
                 * - method
                 * - data : put, post, patch, delete | string 으로 값만 전송가능 필요성?
                 * - timeout :
                 * - auth : 자격 증명
                 * - responseType : 'json'
                 * - responseEncoding : 'utf8'
                 * - xsrfCookieName: '...'
                 * - xsrfHeaderName: '...'
                 * - onUploadProgress : ()=>{} 업로드 진행 이벤트 => onExecute, onExecuted
                 * - onDownloadProgress : ()=>{} 다운로드 진행 이벤트
                 * - validateStatus : (status)=> status >= 200 && status < 300  성공유효성
                 * - maxRedirects: 5 리디렉션 최대값
                 * - socketPath: null
                 * - httpAgent: ...
                 * - httpsAgent: ...
                 * - proxy: {...}   프록시
                 * - cancelToken: ..
                 * - decompress : true 응답 압축여부
                 * 
                 * 
                 */
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
                        // if (typeof nVal['async'] === 'boolean')         config['async'] = nVal['async'];
                        // if (typeof nVal['crossDomain'] === 'boolean')   config['crossDomain'] = nVal['crossDomain'];
                        // if (typeof nVal['success'] === 'function')      config['success'] = nVal['success'];
                        // if (typeof nVal['error'] === 'function')        config['error'] = nVal['error'];
                        // if (typeof nVal['complete'] === 'function')     config['complete'] = nVal['complete'];
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
                // this._onExecuted(this);     // '실행 종료' 이벤트 발생
                this._model.cbFail(this, this._model);
                return false;
            }

            // 아이템 검사
            for(var i = 0; i < this.valid.columns.count; i++) {
                
                // value = this.valid.columns[i].value === null ? this.valid.columns[i].default : this.valid.columns[i].value;
                value = this.valid.columns[i].value;
                
                // 공백 && isNotNull = false    => 검사 넘어감
                // 공백 && isNotNull = true     => 오류 리턴
                // 값존재시                     => 검사 수행
                // if (value.length > 0 || this.valid.columns[i].isNotNull) {
                // if (value.length > 0 || this.valid.columns[i].isNotNull) {
                    if (typeof this.valid.columns[i].valid(value, result, 2) !== 'undefined') {
                        this._model.cbFail(this, this._model, result, this.valid.columns[i]);
                        // this._onExecuted(this);     // '실행 종료' 이벤트 발생
                        return false;
                    }
                // }
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
            // var complete = this.config.complete || this._model.baseConfig.complete || null;   // REVIEW: 사용자 설정 여부
            
            // 기본값 못가져오는 오류 변경함 
            config.url           = this.config.url || this._model.baseConfig.url;
            config.method          = this.config.method || this._model.baseConfig.method;
            config.responseType      = this.config.responseType || this._model.baseConfig.responseType;
            // config.async         = typeof this.config.async  === 'boolean' ? this.config.async : this._model.baseConfig.async;
            // config.crossDomain   = typeof this.config.crossDomain === 'boolean' ? this.config.crossDomain : this._model.baseConfig.crossDomain;
            // if (typeof complete === 'function') config.complete = complete;  // Branch:
            // config.complete      = typeof this.config.complete === 'function' ? this.config.complete : this._model.baseConfig.complete;
            
            // config.crossDomain   = this.config.crossDomain || this._model.baseConfig.crossDomain || false;
            // config.complete      = (typeof complete === 'function') ? complete.bind(this) : null;
            
            // config.success       = this._ajaxSuccess.bind(this);
            // config.error         = this._execError.bind(this);
            
            // config.complete      = this._ajaxComplete.bind(this);



            for(var i = 0; i < this.bind.columns.count; i++) {
                // if(!_isObject(config.data)) config.data = {};
                config.data = _isObject(config.data) ? config.data : {};
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
            // if (option > 0) {
                
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
            try {

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
                        throw new Error('result 는 스키마 구조를 가지고 있지 않습니다.');
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

            } catch (error) {
                this._execError(error, p_status, p_xhr);
            }

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
    
                this._onExecuted(this, this._model);     // '실행 종료' 이벤트 발생
                this._model._onExecuted(this, this._model);     // '실행 종료' 이벤트 발생
                
            } catch (err) {
                var msg = 'Err: _execEnd(cmd='+ this.name +') message:'+ err.message;
                this._execError(msg, p_status, p_res);
                // this._model.cbError('Err: _execEnd(cmd='+ this.name +') message:'+ err.message);
            }
            
        };
            
        /**
         * (WEB & NodeJs 의 어뎁터 패턴)
         * node 에서는 비동기만 반영함 (테스트 용도) =>> 필요시 개발함
         * @param {object} p_config 설정
         * @protected
         */
        // BindCommandAjax.prototype._ajaxCall = function(p_config) {
        //     var option = {};
        //     var result;
        //     var _this = this;

        //     // request VS Jquery.ajax 와 콜백 어뎁터 연결 함수
        //     if (ajax && typeof ajax === 'function') {
        //         // REVIEW:: Jquery.ajax 사용    내부에 try 문이 있을듯
        //         // ajax(p_config);
        //         var $ = jquery;
        //         var deferred = $.Deferred();

        //         // jquery.ajax(p_config);
        //         // POINT:
        //         jquery.ajax({
        //             url: p_config.url,
        //             async: p_config.async,
        //             type: p_config.type,
        //             responseType: p_config.responseType,
        //             crossDomain: p_config.crossDomain
        //         })
        //         .done(function(date, status, xhr) {
        //             p_config.success.call(this, date, status, xhr);
        //             deferred.resolve(date);
        //         })
        //         .fail(function(status, xhr) {
        //             p_config.error.call(this, status, xhr);

        //             deferred.reject(status, xhr);
        //         });

        //         // console.log('ajac call');
        //         return deferred.promise();
                

        //     } else {
        //         // if (p_config.async === false) request = sync_request;    // 동기화 처리  // Branch:
                
        //         option.uri = p_config.url;
        //         if (p_config.type === 'GET') {
        //             option.method = 'POST';
        //             option.qs = p_config.data;
        //             request.get(option, $callback);
        //         } else if (p_config.type === 'POST') {
        //             option.method = 'POST';
        //             option.form = p_config.data;
        //             request.post(option, $callback);
        //         } else {
        //             // 기타 :: 결과는 확인 안함 put, del/delete, patch
        //             request.defaults(option, $callback);
        //         }

        //         // option.uri = p_config.url;
        //         // option.method = 'POST';
        //         // option.form = p_config.data;
        //         // option.qs = p_config.data;
        //         // superagent.Request(option);

        //         // superagent
        //         //     .get(p_config.url)
        //         //     .send({ name: 'Manny', species: 'cat' })
        //         //     // .set('accept', 'json')
        //         //     .end((error, response) => {
        //         //         // console.log('1')
        //         //         $callback(error, response, response.text);
        //         //     });
        //         // superagent.then(()=>{
        //         //     console.log('1')
        //         // });
        //         // superagent.end(()=>{
        //         //     console.log('1')
        //         // });
        //     }

        //     // inner function
        //     function $callback(error, response, body) {
        //         var status = response ? response.statusCode : null;     // Branch:
        //         var msg    = response ? response.statusMessage : '';    // Branch:

        //         // 콜백
        //         try {

        //             // TODO: 파라메터 조정 필요
        //             var p_status, p_xhr;
        //             // (xhr,status) : 완료콜백
        //             // if (p_config && typeof p_config.complete === 'function') p_config.complete(response, status);

        //             if (error || response.statusCode !== 200) {    // 실패시
        //                 msg = error ? (msg + ' ' + error) : msg;        // Branch: ~
        //                 // (xhr,status,error)
        //                 p_config.error(response, status, msg);
        //                 if (typeof _this.cbEnd === 'function' ) _this.cbEnd.call(_this, p_status, p_xhr);
        //                 else if (typeof _this._model.cbBaseEnd === 'function') _this._model.cbBaseEnd.call(_this, p_status, p_xhr);
                        
        //                 _this._onExecuted(_this, _this._model);            
        //                 _this._model._onExecuted(_this, _this._model);     

        //             } else {                                        // 성공시
        //                 if (p_config.responseType === 'json') result = JSON.parse(body);
        //                 result = result || body;                        
        //                 // (result,status,xhr)
        //                 p_config.success(result, error, response);
        //             }

        //         } catch (err) {
        //             _this._ajaxError.call(_this, response, status, err);
                                
        //         } finally {
        //             if (typeof p_config.complete === 'function') p_config.complete(result, error, response);  // ~ Branch:
        //         }
        //     }
        // };
        
        /**
         * POINT: 오라이딩
         * @param {*} p_config 
         */
        BindCommandAjax.prototype._ajaxCall = function(p_config) {
            var option = {};
            var result;
            var _this = this;

            if (p_config.method === 'GET') {
                return axios.get(p_config.url, {
                        data: p_config.data,
                        responseType: p_config.responseType,
                        // validateStatus: function (status) {
                        //     return status >= 200 && status < 300; // 기본값
                        // },
                    })
                    .then(function(res){
                        // $callback(null, res, res.data);
                        // p_config.success.call(_this, res.data, res.status, res);
                        _this._ajaxSuccess.call(_this, res.data, res.status, res);
                    })
                    .catch(function(err){
                        // $callback(err);
                        // p_config.error.call(_this, err, err.status, err.response);
                        _this._execError.call(_this, err, err.status, err.response);
                        // })
                    // .finally(function(a) {
                        _this._execEnd(err.status, err.response);
                        // if (typeof _this.cbEnd === 'function' ) _this.cbEnd.call(_this);
                        // else if (typeof _this._model.cbBaseEnd === 'function') _this._model.cbBaseEnd.call(_this);  

                        // _this._onExecuted(_this, _this._model);     // '실행 종료' 이벤트 발생
                        // _this._model._onExecuted(_this, _this._model);     // '실행 종료' 이벤트 발생

                    });
            } else if (p_config.method === 'POST') {
                return axios.post(p_config.url, {
                        data: p_config.data,
                        responseType: p_config.responseType,
                    })
                    .then(function(res){
                        // $callback(null, res, res.data);
                        _this._ajaxSuccess.call(_this, res.data, res.status, res);
                        // p_config.success.call(_this, res.data, res.status, res);
                    })
                    .catch(function(err){
                        // $callback(err);
                        // p_config.error.call(_this, err, err.status, err.response);
                        _this._execError.call(_this, err, err.status, err.response);

                        _this._execEnd(err.status, err.response);

                        // if (typeof _this.cbEnd === 'function' ) _this.cbEnd.call(_this);
                        // else if (typeof _this._model.cbBaseEnd === 'function') _this._model.cbBaseEnd.call(_this);  

                        // _this._onExecuted(_this, _this._model);     // '실행 종료' 이벤트 발생
                        // _this._model._onExecuted(_this, _this._model);     // '실행 종료' 이벤트 발생
                    });
            }

            // inner function
            // function $callback(error, response, body) {
            //     var status = response ? response.statusCode : null;     // Branch:
            //     var msg    = response ? response.statusMessage : '';    // Branch:

            //     // 콜백
            //     try {

            //         // TODO: 파라메터 조정 필요
            //         var p_status, p_xhr;
            //         // (xhr,status) : 완료콜백
            //         // if (p_config && typeof p_config.complete === 'function') p_config.complete(response, status);

            //         if (error || response.status !== 200) {    // 실패시
            //             msg = error ? (msg + ' ' + error) : msg;        // Branch: ~
            //             // (xhr,status,error)
            //             p_config.error(response, status, msg);
            //             if (typeof _this.cbEnd === 'function' ) _this.cbEnd.call(_this, p_status, p_xhr);
            //             else if (typeof _this._model.cbBaseEnd === 'function') _this._model.cbBaseEnd.call(_this, p_status, p_xhr);
                        
            //             _this._onExecuted(_this, _this._model);            
            //             _this._model._onExecuted(_this, _this._model);     

            //         } else {                                        // 성공시
            //             // TODO: 검사후 변환 부분 추가해야함
            //             // if (p_config.responseType === 'json') result = JSON.parse(body);
            //             result = response.data || body;                        
            //             // (result,status,xhr)
            //             p_config.success(result, error, response);
            //         }

            //     } catch (err) {
            //         _this._ajaxError.call(_this, err, response, status);
                                
            //     } finally {
            //         if (typeof p_config.complete === 'function') p_config.complete(result, error, response);  // ~ Branch:
            //     }
            // }
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
            // var _this = this;
            var option = this.outputOption.option;
            // var index = this.outputOption.index;
            // var loadOption = option === 1 ? 3  : (option === 2 || option === 3) ? 2 : 0;
            var data;
            
            try {

                data = typeof p_data === 'object' ? p_data : JSON.parse(JSON.stringify(p_data));
                // 콜백 검사 (Result)
                if (typeof this.cbResult === 'function' ) data = this.cbResult.call(this, data) || data;
                else if (typeof this._model.cbBaseResult === 'function' ) data = this._model.cbBaseResult.call(this, data) || data;

                if (option > 0) this._execOutput(data, p_status, p_xhr);

                
            } catch (error) {
                this._execError(error, p_status, p_xhr);
                
            } finally {
                this._execEnd(p_status, p_xhr);
                // if (typeof this.cbEnd === 'function' ) this.cbEnd.call(this, p_status, p_xhr);
                // else if (typeof this._model.cbBaseEnd === 'function') this._model.cbBaseEnd.call(this, p_status, p_xhr);  

                // this._onExecuted(this, this._model);     // '실행 종료' 이벤트 발생
                // this._model._onExecuted(this, this._model);     // '실행 종료' 이벤트 발생
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
            // this._onExecuted(this);     // '실행 종료' 이벤트 발생
            // this._model._onExecuted(this);     // '실행 종료' 이벤트 발생
            
            // throw new Error(' start [dir] request fail...');
        };

        //  /**
        //  * 처리 완료시
        //  * error(xhr,status,error)
        //  * @param {XMLHttpRequest} p_xhr 
        //  * @param {string} p_status 
        //  * @protected
        //  */
        //  BindCommandAjax.prototype._ajaxComplete = function(p_xhr, p_status) {
        //     // var msg = p_xhr && p_xhr.statusText ? p_xhr.statusText : p_error;
        //     // var result;     // TODO: result 받아올 필요가 있는지 검토?
            
        //     // 콜백 검사 (End)
        //     // try {
        //     //     if (typeof this.cbEnd === 'function' ) this.cbEnd.call(this, p_status, p_xhr);
        //     //     else if (typeof this._model.cbBaseEnd === 'function') this._model.cbBaseEnd.call(this, p_status, p_xhr);    

        //     // } catch (error) {
        //     //     this._ajaxError(p_xhr, p_status, error);

        //     // } finally {
        //     //     this._onExecuted(this, this._model);     // '실행 종료' 이벤트 발생
        //     //     this._model._onExecuted(this, this._model);     // '실행 종료' 이벤트 발생
        //     // }

        //     // this._onExecuted(this, this._model);     // '실행 종료' 이벤트 발생
        //     // this._model._onExecuted(this, this._model);     // '실행 종료' 이벤트 발생
        //     // throw new Error(' start [dir] request fail...');
        // };

        

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
            // if (_global.isLog) console.log('[BindCommandAjax] %s.execute()', this.name);
            var _this = this;

            try {

                this._model._onExecute(this, this._model);  // '실행 시작' 이벤트 발생
                this._onExecute(this, this._model);  // '실행 시작' 이벤트 발생
                
                // 콜백 검사 (Begin)
                if (typeof this.cbBegin === 'function' ) this.cbBegin.call(this, this._model, this);
                else if (typeof this._model.cbBaseBegin === 'function') this._model.cbBaseBegin.call(this, this._model, this);

                if (!this._execValid()) {
                    // $execEnd();
                    this._execEnd();
                    // if (typeof this.cbEnd === 'function' ) this.cbEnd.call(this);
                    // else if (typeof this._model.cbBaseEnd === 'function') this._model.cbBaseEnd.call(this);
        
                    // this._onExecuted(this);     // '실행 종료' 이벤트 발생
                    // this._model._onExecuted(this);     // '실행 종료' 이벤트 발생

                } else {
                    return this._execBind();
                }
                

                // if (!this._execValid()) {throw new Error('_execValid() 검사 실패');
                // this._execBind();
                // if (this._execValid() === true) this._execBind();

            } catch (err) {
                // this._model.cbError('Err:execue(cmd='+ _this.name +') message:'+ err.message);
                var msg = 'Err:execue(cmd='+ _this.name +') message:'+ err.message;
                this._execError(msg);
                // if (typeof this.cbEnd === 'function' ) this.cbEnd.call(this);
                // else if (typeof this._model.cbBaseEnd === 'function') this._model.cbBaseEnd.call(this);
    
                // this._onExecuted(this);     // '실행 종료' 이벤트 발생
                // this._model._onExecuted(this);     // '실행 종료' 이벤트 발생
                this._execEnd();
            }

            // inner function
            // function $execEnd() {
            //     if (typeof _this.cbEnd === 'function' ) _this.cbEnd.call(_this);    // ~ Branch:
            //     else if (typeof _this._model.cbBaseEnd === 'function') _this._model.cbBaseEnd.call(_this);
    
            //     _this._onExecuted(_this, _this._model);
            //     _this._model._onExecuted(_this, _this._model);
            // }
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