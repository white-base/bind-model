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
        var _IBindModel                 = require('./i-bind-model').IBindModel;
        var _IModelCallback             = require('./i-model-callback').IModelCallback;
    } else {
        var $Message                    = _global._L.Message;
        var $ExtendError                = _global._L.ExtendError;
        var $IBindModel                 = _global._L.IBindModel;
        var $IModelCallback             = _global._L.IModelCallback;
    }
    var Message                 = _Message              || $Message;
    var ExtendError             = _ExtendError          || $ExtendError;
    var IBindModel              = _IBindModel           || $IBindModel;
    var IModelCallback          = _IModelCallback       || $IModelCallback;

    //==============================================================
    // 3. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof IBindModel === 'undefined') throw new Error(Message.get('ES011', ['IBindModel', 'i-bind-model']));
    if (typeof IModelCallback === 'undefined') throw new Error(Message.get('ES011', ['IModelCallback', 'i-model-callback']));

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


            // TODO: 인터페이스 구현 재정의 해야함
            // IBindModel
            this.items = Object;
            this.fn = Object;
            this.command = Object;
            this.preRegister = Function;
            this.preCheck = Function;
            this.preReady = Function;
            // IModelCallback
            this.cbFail = Function;
            this.cbError = Function;
            this.cbBaseValid = [[Function]];
            this.cbBaseBind = [[Function]];
            this.cbBaseResult = [[Function]];
            this.cbBaseOutput = [[Function]];
            this.cbBaseEnd = [[Function]];

            Util.implements(IService, this);
        }
        
        IService._UNION = [IBindModel, IModelCallback];
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