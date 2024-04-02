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
        var _MetaView                   = require('logic-entity').MetaView;
        var _MetaViewCollection         = require('logic-entity').MetaViewCollection;
        var _BindCommand                = require('./bind-command').BindCommand;
        var _request                    = require('request');
        var _sync_request               = require('sync-request');
        var _jquery;
        var _ajax;
    } else {
        var $Message                    = _global._L.Message;
        var $ExtendError                = _global._L.ExtendError;
        var $Util                       = _global._L.Util;
        var $MetaView                   = _global._L.MetaView;
        var $MetaViewCollection         = _global._L.MetaViewCollection;
        var $BindCommand                = _global._L.BindCommand;
        var $request;
        var $sync_request;
        var $jquery                     = _global.jQuery || _global.$;     // jquery 로딩 REVIEW:: 로딩 확인
        var $ajax                       = $jquery.ajax;
    }
    var Message                 = _Message              || $Message;
    var ExtendError             = _ExtendError          || $ExtendError;
    var Util                    = _Util                 || $Util;
    var MetaView                = _MetaView             || $MetaView;
    var MetaViewCollection      = _MetaViewCollection   || $MetaViewCollection;
    var BindCommand             = _BindCommand          || $BindCommand;
    var request                 = _request              || $request;   // node 전용
    var sync_request            = _sync_request         || $sync_request;  // node 전용
    var jquery                  = _jquery               || $jquery;
    var ajax                    = _ajax                 || $ajax;

    //==============================================================
    // 3. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    if (typeof MetaView === 'undefined') throw new Error(Message.get('ES011', ['MetaView', 'meta-view']));
    if (typeof MetaViewCollection === 'undefined') throw new Error(Message.get('ES011', ['MetaViewCollection', 'meta-view']));
    if (typeof BindCommand === 'undefined') throw new Error(Message.get('ES011', ['BindCommand', 'bind-command']));

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

            var ajaxSetup = {
                url: null,          // 요청 경로
                type: null,         // 전송 방법 : GET, POST
                dataType: null,     //
                async: null,        // [*]비동기(ture), 동기(false)
                crossDomain: null,  // 크로스 도메인
                success: null,      // 성공 콜백
                error: null,        // 실패 콜백
                complete: null      // 완료 콜백
            };
            
            /**
             * ajaxSetup 설정값 (jquery의 ajaxSetup 과 동일)
             * @member {Object} _L.Meta.Bind.BindCommandAjax#ajaxSetup 
             */
            Object.defineProperty(this, 'ajaxSetup', 
            {
                get: function() { return ajaxSetup; },
                configurable: true,
                enumerable: true
            });
            
            /**
             * ajaxSetup.url 의 값에 설정한다.
             * @member {String} _L.Meta.Bind.BindCommandAjax#url 
             */
            Object.defineProperty(this, 'url', 
            {
                get: function() { return ajaxSetup.url; },
                set: function(newValue) { 
                    if (!(typeof newValue === 'string')) throw new Error('Only [url] type "string" can be added');
                    ajaxSetup.url = newValue;
                },
                configurable: true,
                enumerable: true
            }); 

            // outputOption 설정
            if (p_outputOption) this.outputOption = p_outputOption;

            // 예약어 등록
            this.$KEYWORD = ['ajaxSetup', 'url'];
            this.$KEYWORD = ['_execValid', '_execBind', '_execSuccess', '_execError', '_ajaxAdapter'];
        }
        Util.inherits(BindCommandAjax, _super);

        BindCommandAjax._UNION = [];
        BindCommandAjax._NS = 'Meta.Bind';
        BindCommandAjax._PARAMS = ['_model', 'outputOption', '_baseTable'];
        
        // local function
        function _isObject(obj) {    // 객체 여부
            if (typeof obj === 'object' && obj !== null) return true;
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
            else if (typeof this._model.cbBaseValid  === 'function') bReturn= this._model.cbBaseValid.call(this, this.valid);

            // valid 검사 결과
            if (!bReturn) {
                this._onExecuted(this);     // '실행 종료' 이벤트 발생
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
                        this._model.cbFail(result, this.valid.columns[i]);
                        this._onExecuted(this);     // '실행 종료' 이벤트 발생
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
            var item;
            var ajaxSetup = {};
            var complete = this.ajaxSetup.complete || this._model.baseAjaxSetup.complete || null;
            
            // ajaxSetup.url           = this.ajaxSetup.url || this._model.baseAjaxSetup.url;
            // ajaxSetup.type          = this.ajaxSetup.type || this._model.baseAjaxSetup.type || 'GET';
            // ajaxSetup.dataType      = this.ajaxSetup.dataType || this._model.baseAjaxSetup.dataType || 'json';
            // ajaxSetup.async         = this.ajaxSetup.async || this._model.baseAjaxSetup.async || true;      
            // ajaxSetup.crossDomain   = this.ajaxSetup.crossDomain || this._model.baseAjaxSetup.crossDomain || false;
            // 기본값 못가져오는 오류 변경함 
            ajaxSetup.url           = this.ajaxSetup.url || this._model.baseAjaxSetup.url;
            ajaxSetup.type          = this.ajaxSetup.type || this._model.baseAjaxSetup.type || 'GET';
            ajaxSetup.dataType      = this.ajaxSetup.dataType || this._model.baseAjaxSetup.dataType || 'json';
            ajaxSetup.async         = typeof this.ajaxSetup.async  === 'boolean' ? this.ajaxSetup.async : this._model.baseAjaxSetup.async;
            ajaxSetup.crossDomain   = typeof this.ajaxSetup.crossDomain === 'boolean' ? this.ajaxSetup.crossDomain : this._model.baseAjaxSetup.crossDomain;

            
            ajaxSetup.crossDomain   = this.ajaxSetup.crossDomain || this._model.baseAjaxSetup.crossDomain || false;
            ajaxSetup.complete      = (typeof complete === 'function') ? complete.bind(this) : null;
            ajaxSetup.success       = this._execSuccess.bind(this);
            ajaxSetup.error         = this._execError.bind(this);

            for(var i = 0; i < this.bind.columns.count; i++) {
                if(typeof ajaxSetup.data !== 'object') ajaxSetup.data = {};
                item = this.bind.columns[i];
                value = item.value || item.default;     // 값이 없으면 기본값 설정
                
                //ajaxSetup.data[item.name] = value;
                ajaxSetup.data[item.alias] = value;     // 별칭에 설정, 없을시 기본 name
            }
            
            // 콜백 검사 (bind)
            if (typeof this.cbBind === 'function') this.cbBind.call(this, ajaxSetup, this);
            else if (typeof this._model.cbBaseBind === 'function') this._model.cbBaseBind.call(this, ajaxSetup, this);
            
            this._ajaxAdapter(ajaxSetup);       // Ajax 호출 (web | node)
        };

        /**
         * 실행 성공
         * @param {*} p_result 
         * @param {*} p_status 
         * @param {*} p_xhr 
         * @protected
         */
        BindCommandAjax.prototype._execSuccess = function(p_result, p_status, p_xhr) {
            var _this = this;
            var option = this.outputOption.option;
            var index = this.outputOption.index;
            var loadOption = option === 1 ? 3  : (option === 2 || option === 3) ? 2 : 0;
            var result = typeof p_result === 'object' ? p_result : JSON.parse(JSON.stringify(p_result));
            var entity;

            // 콜백 검사 (Result)
            if (typeof this.cbResult === 'function' ) result = this.cbResult.call(this, result);
            else if (typeof this._model.cbBaseResult === 'function' ) result = this._model.cbBaseResult.call(this, result);

            // ouputOption = 1,2,3  : 출력모드의 경우
            if (option > 0) {
                
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
                        throw new Error('result 는 스키마 구조를 가지고 있지 않습니다.');   
                    }
                }
                
                // 3. 존재하는 아이템 중에 지정된 값으로 설정
                if (option === 3) {
                    if (typeof index === 'number') {
                        var rowIdx = index;
                        if (typeof rowIdx !== 'number') throw new Error('outputOption.index 값이 숫자가 아닙니다.');   
                        for (var i = 0; this._outputs.count > i; i++) {
                            if (this._outputs[i].columns.count > 0) {
                                if (this._outputs[i].rows.count >= rowIdx) {
                                    console.warn('결과에 ['+rowIdx+']번째 row가 존재 하지 않습니다. ');
                                } else this._outputs[i].setValue(this._outputs[i].rows[rowIdx]);
                            }
                        }
                    } else if (Array.isArray(index)) {
                        for (var i = 0; i < this._outputs.count && i < index.length; i++) {
                            var rowIdx = index[i];
                            if (typeof rowIdx !== 'number') throw new Error('option ['+i+']번째 인덱스가 숫자가 아닙니다.');   
                            if (this._outputs[i].columns.count > 0 && this._outputs[i].rows.count >= rowIdx) {
                                if (this._outputs[i].rows.count >= rowIdx) {
                                    console.warn('결과에 ['+i+']번째 레코드의 ['+rowIdx+']번째 row가 존재 하지 않습니다. ');
                                } else this._outputs[i].setValue(this._outputs[i].rows[rowIdx]);
                            }
                        }
                    }
                }

                // 콜백 검사 (Output)
                if (typeof this.cbOutput === 'function' ) this.cbOutput.call(this, result);
                else if (typeof this._model.cbBaseOutput === 'function' ) this._model.cbBaseOutput.call(this, result);
            }

            // 콜백 검사 (End)
            if (typeof this.cbEnd === 'function' ) this.cbEnd.call(this, result, p_status, p_xhr);
            else if (typeof this._model.cbBaseEnd === 'function') this._model.cbBaseEnd.call(this, result, p_status, p_xhr);
            
            this._onExecuted(this, result);  // '실행 종료' 이벤트 발생


            // inner function
            function $isEntitySchema(target) {
                if (target['rows'] || target['columns'] ) return true;
                else false;
            }
            function $readOutput(entity, cnt, readOpt) {
                var idx = cnt > 0 ? cnt - 1 : 0;
                if (readOpt === 1 && typeof _this._outputs[idx] === 'undefined') {
                    _this.newOutput();
                }
                _this._outputs[idx].read(entity, readOpt);
            }
        };

        /**
         * AJAX 를 기준으로 구성함 (requst는 맞춤)
         * error(xhr,status,error)
         * @param {*} p_xhr 
         * @param {*} p_status 
         * @param {*} p_error 
         * @protected
         */
        BindCommandAjax.prototype._execError = function(p_xhr, p_status, p_error) {
            
            var msg = p_xhr && p_xhr.statusText ? p_xhr.statusText : p_error;

            this._model.cbError.call(this, msg, p_status);
            this._onExecuted(this);     // '실행 종료' 이벤트 발생
            
            // throw new Error(' start [dir] request fail...');
        };

        /**
         * (WEB & NodeJs 의 어뎁터 패턴)
         * node 에서는 비동기만 반영함 (테스트 용도) =>> 필요시 개발함
         * @param {Object} p_ajaxSetup 
         * @protected
         */
        BindCommandAjax.prototype._ajaxAdapter = function(p_ajaxSetup) {
            
            var option = {};
            var result;
            var _this = this;

            // request VS Jquery.ajax 와 콜백 어뎁터 연결 함수
            

            if (ajax && typeof ajax === 'function') {

                // REVIEW:: Jquery.ajax 사용
                ajax(p_ajaxSetup);

            } else {

                option.uri = p_ajaxSetup.url;

                if (p_ajaxSetup.async === false) request = sync_request;    // 동기화 처리

                if (p_ajaxSetup.type === 'GET') {
                    option.method = 'POST';
                    option.qs = p_ajaxSetup.data;
                    request.get(option, $callback);
                } else if (p_ajaxSetup.type === 'POST') {
                    option.method = 'POST';
                    option.form = p_ajaxSetup.data;
                    request.post(option, $callback);
                } else {
                    // 기타 :: 결과는 확인 안함
                    request(option, $callback);
                }
            }

            // inner function
            function $callback(error, response, body) {

                var status = response ? response.statusCode : null;
                var msg    = response ? response.statusMessage : '';

                // 콜백
                try {

                    // (xhr,status) : 완료콜백
                    if (p_ajaxSetup && typeof p_ajaxSetup.complete === 'function') p_ajaxSetup.complete(response, status);

                    if (error || response.statusCode !== 200) {    // 실패시
                        msg = error ? (msg + ' ' + error) : msg;
                        // (xhr,status,error)
                        p_ajaxSetup.error(response, status, msg);
                    } else {                                        // 성공시
                        if (p_ajaxSetup.dataType === 'json') result = JSON.parse(body);
                        result = result || body;
                        // (result,status,xhr)
                        p_ajaxSetup.success(result, error, response);
                    }                

                } catch (err) {
                    var _err = {
                        name: err.name || 'throw',
                        message: err.message || err,
                        target: err.target || '',
                        stack: err.stack || '',
                    };
                    _this._model.cbError('Err:callback(cmd='+ _this.name +') message:'+ _err.message);
                    _this._onExecuted(_this);     // '실행 종료' 이벤트 발생
                    if (_global.isLog) {
                        console.error('NAME : '+ _err.name);
                        console.error('MESSAGE : '+ _err.message);
                        console.error('TARGET : '+ JSON.stringify(_err.target));
                        console.error('STACK : '+ _err.stack);
                    }
                    if (_global.isThrow) throw _err;       // 에러 던지기
                    // throw _err;
                }             
            }
        };

        /**
         * 실행 
         */
        BindCommandAjax.prototype.execute = function() {
            if (_global.isLog) console.log('[BindCommandAjax] %s.execute()', this.name);

            try {
                var _this = this;
                this._onExecute(this);  // '실행 시작' 이벤트 발생
                if (!this._execValid()) throw new Error('_execValid() 검사 실패');
                this._execBind();
            } catch (err) {
                var _err = {
                    name: err.name || 'throw',
                    message: err.message || err,
                    target: err.target || '',
                    stack: err.stack || '',
                };
                this._model.cbError('Err:execue(cmd='+ _this.name +') message:'+ _err.message);
                this._onExecuted(this);     // '실행 종료' 이벤트 발생
                if (_global.isLog) {
                    console.error('NAME : '+ _err.name);
                    console.error('MESSAGE : '+ _err.message);
                    console.error('TARGET : '+ JSON.stringify(_err.target));
                    console.error('STACK : '+ _err.stack);
                }
                if (_global.isThrow) throw _err;       // 에러 던지기
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