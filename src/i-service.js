/**** i-service.js | _L.Interface.IService ****/

(function(_global) {
    'use strict';

    var isNode = typeof window !== 'undefined' ? false : true;

    //==============================================================
    // 1. namespace declaration
    _global._L                      = _global._L || {};
    _global._L.Interface            = _global._L.Interface || {};    
    
    //==============================================================
    // 2. import module
    if (isNode) {     
        var _Message                    = require('logic-entity').Message;
        var _ExtendError                = require('logic-entity').ExtendError;
    } else {
        var $Message                    = _global._L.Message;
        var $ExtendError                = _global._L.ExtendError;
    }
    var Message                 = _Message              || $Message;
    var ExtendError             = _ExtendError          || $ExtendError;

    //==============================================================
    // 3. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));

    //==============================================================
    // 4. module implementation   
    var IService  = (function () {
        /**
         * 내보내기 제어 인터페이스 입니다.
         * @constructs _L.Interface.IService
         * @interface
         */
        function IService() {

            /**
             * 테이블
             * @member {object} _L.Interface.IService#tables
             */
            this.tables = Object;

            /**
             * 매핑 컬렉션
             * @member {Funciton} _L.Interface.IService#mapping
             */
            this.mapping = Object;

        }
    
        IService._NS = 'Interface';    // namespace
        IService._KIND = 'interface';

        /**
         * 초기화 전 등록
         * @returns {any}
         * @abstract
         */
        IService.prototype.preRegister  = function() {
            throw new ExtendError(/EL02311/, null, ['IService']);
        };

        /**
         * 초기화 전 검사
         * @returns {any}
         * @abstract
         */
        IService.prototype.preCheck  = function() {
            throw new ExtendError(/EL02311/, null, ['IService']);
        };

        /**
         * 초기화 전 준비
         * @returns {any}
         * @abstract
         */
        IService.prototype.preReady  = function() {
            throw new ExtendError(/EL02311/, null, ['IService']);
        };
    
        return IService;
        
    }());

    //==============================================================
    // 5. module export
    if (isNode) {     
        exports.IService = IService;
    } else {
        _global._L.IService = IService;
        _global._L.Interface.IService = IService;   // namespace
    }

}(typeof window !== 'undefined' ? window : global));