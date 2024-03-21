/**
 * namespace _L.Meta.Bind.BindCommandAjax
 */
(function(global) {
    
    'use strict';

    //==============================================================
    // 1. 모듈 네임스페이스 선언
    global._L                   = global._L || {};
    global._L.Meta              = global._L.Meta || {};
    global._L.Meta.Bind         = global._L.Meta.Bind || {};
    
    //==============================================================
    // 2. 모듈 가져오기 (node | web)
    var Util;
    var BindCommand;
    var entityView;
    var MetaView;
    var MetaViewCollection;
    var request;        // node 전용
    var sync_request;   // node 전용
    var jquery;
    var ajax;

    if (typeof module === 'object' && typeof module.exports === 'object') {     
        BindCommand             = require('./bind-command');
        Util                    = require('logic-core').Util;
        MetaView                = require('logic-entity').MetaView;
        MetaViewCollection      = require('logic-entity').MetaViewCollection;
        // Util                    = require('Util');
        // BindCommand             = require('./bind-command');
        // entityView              = require('./entity-view');
        // MetaView              = entityView.MetaView;
        // MetaViewCollection    = entityView.MetaViewCollection;  // TODO: 제거 , 사용안함
        request                 = require('request');
        sync_request            = require('sync-request');
    } else {
        Util                    = global._L.Common.Util;
        BindCommand             = global._L.Meta.Bind.BindCommand;
        MetaView                = global._L.Meta.Entity.MetaView;
        MetaViewCollection      = global._L.Meta.Entity.MetaViewCollection;
        jquery                  = global.jQuery || global.$;     // jquery 로딩 REVIEW:: 로딩 확인
        ajax                    = jquery.ajax;
    }

    //==============================================================
    // 3. 모듈 의존성 검사
    if (typeof Util === 'undefined') throw new Error('[Util] module load fail...');
    if (typeof BindCommand === 'undefined') throw new Error('[BindCommand] module load fail...');
    if (typeof MetaView === 'undefined') throw new Error('[MetaView] module load fail...');
    if (typeof MetaViewCollection === 'undefined') throw new Error('[MetaViewCollection] module load fail...');

    //==============================================================
    // 4. 모듈 구현    
    var BindCommandAjax  = (function (_super) {
        
        /**
         * 바인드 명령 Ajax 
         * @constructs _L.Meta.Bind.BindCommandAjax
         * @extends _L.Meta.Bind.BindCommand
         * @param {BindModel} p_bindModel 
         * @param {Number} p_outputOption 
         * @param {Entity} p_baseEntity 
         */
        function BindCommandAjax(p_bindModel, p_outputOption, p_baseEntity) {
            _super.call(this, p_bindModel, p_baseEntity);

            var __ajaxSetup = {
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
                get: function() { return __ajaxSetup; },
                configurable: true,
                enumerable: true
            });
            
            /**
             * ajaxSetup.url 의 값에 설정한다.
             * @member {String} _L.Meta.Bind.BindCommandAjax#url 
             */
            Object.defineProperty(this, 'url', 
            {
                get: function() { return __ajaxSetup.url; },
                set: function(newValue) { 
                    if (!(typeof newValue === 'string')) throw new Error('Only [url] type "string" can be added');
                    __ajaxSetup.url = newValue;
                },
                configurable: true,
                enumerable: true
            }); 

            // outputOption 설정
            if (typeof p_outputOption === 'number') this.outputOption = p_outputOption;

            // 예약어 등록

            this._symbol = this._symbol.concat(['ajaxSetup', 'url']);
            this._symbol = this._symbol.concat(['_execValid', '_execBind', '_execSuccess', '_execError', '_ajaxAdapter']);
        }
        Util.inherits(BindCommandAjax, _super);

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
            
            var loadOption = this.outputOption === 3 ? 2  : this.outputOption;

            var result = typeof p_result === 'object' ? p_result : JSON.parse(JSON.stringify(p_result));

            // 콜백 검사 (Result)
            if (typeof this.cbResult === 'function' ) result = this.cbResult.call(this, result);
            else if (typeof this._model.cbBaseResult === 'function' ) result = this._model.cbBaseResult.call(this, result);

            // ouputOption = 1,2,3  : 출력모드의 경우
            if (this.outputOption > 0) {
                
                // 1. 초기화 : opt = 1
                for (var i = 0; this._output.count > i; i++) {
                    if (loadOption === 1) this._output[i].clear();  // 전체 초기화 (item, rows)
                    else this._output[i].rows.clear();              // Row 초기화
                }
                
                // 2. 결과 MetaView 에 로딩
                if(typeof result['entity'] !== 'undefined' || typeof result['table'] !== 'undefined' ) {    // 단일 출력
                    this._output[0].load(result, loadOption); // this['output']
                } else if (Array.isArray(result['entities'])) {                                             // 복합 출력

                    for(var i = 0; result['entities'].length > i && typeof this._output[i] !== 'undefined'; i++) {
                        this._output[i].clear();
                        this._output[i].load(result['entities'][i], loadOption);
                    }
                }
                
                // 3. 존재하는 아이템 중에 지정된 값으로 설정
                if (this.outputOption === 3) {
                    for (var i = 0; this._output.count > i; i++) {
                        if (this._output[i].columns.count > 0 && this._output[i].rows.count > 0)
                        this._output[i].setValue(this._output[i].rows[0]);
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
            


            // 임시코드 POINT:
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
            function callback(error, response, body) {

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
                    if (global.isLog) {
                        console.error('NAME : '+ _err.name);
                        console.error('MESSAGE : '+ _err.message);
                        console.error('TARGET : '+ JSON.stringify(_err.target));
                        console.error('STACK : '+ _err.stack);
                    }
// POINT:
                    if (global.isThrow) throw _err;       // 에러 던지기
                    // throw _err;
                }             
            }

            if (ajax && typeof ajax === 'function') {

                // REVIEW:: Jquery.ajax 사용
                ajax(p_ajaxSetup);

            } else {

                option.uri = p_ajaxSetup.url;

                if (p_ajaxSetup.async === false) request = sync_request;    // 동기화 처리

                if (p_ajaxSetup.type === 'GET') {
                    option.method = 'POST';
                    option.qs = p_ajaxSetup.data;
                    request.get(option, callback);
                } else if (p_ajaxSetup.type === 'POST') {
                    option.method = 'POST';
                    option.form = p_ajaxSetup.data;
                    request.post(option, callback);
                } else {
                    // 기타 :: 결과는 확인 안함
                    request(option, callback);
                }
            }
        };

        /**
         * 상속 클래스에서 오버라이딩 필요!! 
         * @override 
         */
        // BindCommandAjax.prototype.getTypes  = function() {
                    
        //     var type = ['BindCommandAjax'];
            
        //     return type.concat(typeof _super !== 'undefined' && _super.prototype && _super.prototype.getTypes ? _super.prototype.getTypes() : []);
        // };

        /**
         * 실행 
         */
        BindCommandAjax.prototype.execute = function() {
            if (global.isLog) console.log('[BindCommandAjax] %s.execute()', this.name);

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
                if (global.isLog) {
                    console.error('NAME : '+ _err.name);
                    console.error('MESSAGE : '+ _err.message);
                    console.error('TARGET : '+ JSON.stringify(_err.target));
                    console.error('STACK : '+ _err.stack);
                }
                if (global.isThrow) throw _err;       // 에러 던지기
            }            
        };

        return BindCommandAjax;
    
    }(BindCommand));
    

    //==============================================================
    // 5. 모듈 내보내기 (node | web)
    if (typeof module === 'object' && typeof module.exports === 'object') {     
        module.exports = BindCommandAjax;
    } else {
        global._L.Meta.Bind.BindCommandAjax = BindCommandAjax;
    }

}(typeof module === 'object' && typeof module.exports === 'object' ? global : window));