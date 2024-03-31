/**** i-service-ajax.js | _L.Interface.IAjaxService ****/

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
        var _Util                       = require('./util');
        var _IService                   = require('./i-service').IService;
    } else {
        var $Message                    = _global._L.Message;
        var $ExtendError                = _global._L.ExtendError;
        var $Util                       = _global._L.Util;
        var $IService                   = _global._L.IService;
    }
    var Message                 = _Message              || $Message;
    var ExtendError             = _ExtendError          || $ExtendError;
    var IService                = _IService             || $IService;

    //==============================================================
    // 3. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    if (typeof IService === 'undefined') throw new Error(Message.get('ES011', ['IService', 'i-service']));

    //==============================================================
    // 4. module implementation   
    var IAjaxService  = (function (_super) {
        /**
         * 내보내기 제어 인터페이스 입니다.
         * @constructs _L.Interface.IAjaxService
         * @extends  _L.Interface.IService
         * @interface
         */
        function IAjaxService() {
            _super.call(this);

            /**
             * 기본 AJAX Setup 객체
             * @member {object} _L.Interface.IAjaxService#baseAjaxSetup
             */
            this.baseAjaxSetup = Object;

            /**
             * 기본 요청 url
             * @member {string} _L.Interface.IAjaxService#baseUrl
             */
            this.baseUrl = String;

        }
        Util.inherits(IAjaxService, _super);
    
        IAjaxService._NS = 'Interface';    // namespace
        IAjaxService._KIND = 'interface';

        /**
         * 대상을 내보냅니다. (쓰기)
         * @returns {any}
         * @abstract
         */
        IAjaxService.prototype.write  = function() {
            throw new ExtendError(/EL02311/, null, ['IAjaxService']);
        };
    
        return IAjaxService;
        
    }());

    //==============================================================
    // 5. module export
    if (isNode) {     
        exports.IAjaxService = IAjaxService;
    } else {
        _global._L.IAjaxService = IAjaxService;
        _global._L.Interface.IAjaxService = IAjaxService;   // namespace
    }

}(typeof window !== 'undefined' ? window : global));