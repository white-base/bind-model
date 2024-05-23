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
    if (isNode) {                                                                       // strip:
        var _Message                    = require('logic-entity').Message;              // strip:
        var _ExtendError                = require('logic-entity').ExtendError;          // strip:
        var _Util                       = require('logic-entity').Util;                 // strip:
        var _IBindModel                 = require('./i-bind-model').IBindModel;         // strip:
        var _IModelCallback             = require('./i-model-callback').IModelCallback; // strip:
    }                                                                                   // strip:
    var $Message                    = _global._L.Message;           // modify:
    var $ExtendError                = _global._L.ExtendError;       // modify:
    var $Util                       = _global._L.Util;              // modify:
    var $IBindModel                 = _global._L.IBindModel;        // modify:
    var $IModelCallback             = _global._L.IModelCallback;    // modify:

    var Message                 = _Message              || $Message;                    // strip:
    var ExtendError             = _ExtendError          || $ExtendError;                // strip:
    var Util                    = _Util                 || $Util;                       // strip:
    var IBindModel              = _IBindModel           || $IBindModel;                 // strip:
    var IModelCallback          = _IModelCallback       || $IModelCallback;             // strip:

    //==============================================================
    // 3. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
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
            this.tables = [[ String, [String], {} ]];

            /**
             * 매핑 컬렉션
             * @member {Funciton} _L.Interface.IService#mapping
             */
            this.mapping = [[{}]];


            // TODO: 인터페이스 구현 재정의 해야함
            // IBindModel
            this.items = [[{}]];
            this.fn = [[{}]];
            this.command = [[{}]];
            // this.preRegister = [[Function]];
            // this.preCheck = [[Function]];
            // this.preReady = [[Function]];
            // IModelCallback
            this.cbFail = [[Function]];
            this.cbError = [[Function]];
            this.cbBaseBegin = [[Function]];
            this.cbBaseValid = [[Function]];
            this.cbBaseBind = [[Function]];
            this.cbBaseResult = [[Function]];
            this.cbBaseOutput = [[Function]];
            this.cbBaseEnd = [[Function]];

            /**
             * 초기화 이전 등록
             * @member {Function} _L.Interface.IBindModel#preRegister
             */
            this.preRegister = [[Function]];

            /**
             * 초기화 이전 검사
             * @member {Function} _L.Interface.IBindModel#preCheck
             */
            this.preCheck = [[Function]];

            /**
             * 초기화 이전 준비완료
             * @member {Function} _L.Interface.IBindModel#preReady
             */
            this.preReady = [[Function]];

            Util.implements(IService, this);        // strip:
        }
        
        IService._UNION = [IBindModel, IModelCallback];
        IService._NS = 'Interface';    // namespace
        IService._KIND = 'interface';

        // /**
        //  * 초기화 전 등록
        //  * @returns {any}
        //  * @abstract
        //  */
        // IService.prototype.preRegister  = function() {
        //     throw new ExtendError(/EL02311/, null, ['IService']);
        // };

        // /**
        //  * 초기화 전 검사
        //  * @returns {any}
        //  * @abstract
        //  */
        // IService.prototype.preCheck  = function() {
        //     throw new ExtendError(/EL02311/, null, ['IService']);
        // };

        // /**
        //  * 초기화 전 준비
        //  * @returns {any}
        //  * @abstract
        //  */
        // IService.prototype.preReady  = function() {
        //     throw new ExtendError(/EL02311/, null, ['IService']);
        // };
    
        return IService;
        
    }());

    //==============================================================
    // 5. module export
    if (isNode) exports.IService = IService;        // strip:
    
    _global._L.IService = IService;
    _global._L.Interface.IService = IService;

}(typeof window !== 'undefined' ? window : global));