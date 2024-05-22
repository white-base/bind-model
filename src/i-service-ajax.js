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
    if (isNode) {                                                               // strip:
        var _Message                    = require('logic-entity').Message;      // strip:
        var _ExtendError                = require('logic-entity').ExtendError;  // strip:
        var _Util                       = require('logic-entity').Util;         // strip:
        var _IService                   = require('./i-service').IService;      // strip:
    }                                                                           // strip:
    var $Message                    = _global._L.Message;       // modify:
    var $ExtendError                = _global._L.ExtendError;   // modify:
    var $Util                       = _global._L.Util;          // modify:
    var $IService                   = _global._L.IService;      // modify:

    var Message                 = _Message              || $Message;            // strip:
    var ExtendError             = _ExtendError          || $ExtendError;        // strip:
    var Util                    = _Util                 || $Util;               // strip:
    var IService                = _IService             || $IService;           // strip:

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
             * @member {object} _L.Interface.IAjaxService#baseConfig
             */
            this.baseConfig = [[{}]];

            /**
             * 기본 요청 url
             * @member {string} _L.Interface.IAjaxService#baseUrl
             */
            this.baseUrl = [[String]];

        }
        Util.inherits(IAjaxService, _super);
    
        IAjaxService._NS = 'Interface';    // namespace
        IAjaxService._KIND = 'interface';

        return IAjaxService;
        
    }(IService));

    //==============================================================
    // 5. module export
    if (isNode) {     
        exports.IAjaxService = IAjaxService;
    } else {
        _global._L.IAjaxService = IAjaxService;
        _global._L.Interface.IAjaxService = IAjaxService;   // namespace
    }

}(typeof window !== 'undefined' ? window : global));