/**** util.js | _L.Common.Util ****/
(function(_global) {
    'use strict';

    var isNode = typeof window !== 'undefined' ? false : true;
    //==============================================================
    // 1. import module
    if (isNode) {                                                               // strip:
        var _Message                    = require('logic-entity').Message;      // strip:
        var _ExtendError                = require('logic-entity').ExtendError;  // strip:
        var _Util                       = require('logic-entity').Util;         // strip:
    }                                                                           // strip:
    
    var $Message                    = _global._L.Message;           // modify:
    var $ExtendError                = _global._L.ExtendError;       // modify:
    var $Util                       = _global._L.Util;              // modify:

    var Message                 = _Message              || $Message;            // strip:
    var ExtendError             = _ExtendError          || $ExtendError;        // strip:
    var Util                    = _Util                 || $Util;               // strip:

    //==============================================================
    // 2. module dependency check
    if (!ExtendError) throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (!Util) throw new Error(Message.get('ES011', ['Util', 'util']));
    
    //==============================================================
    // 3. module implementation
    //--------------------------------------------------------------
    // implementation

    // local function
    function _isString(obj) {    // 공백아닌 문자 여부
        if (typeof obj === 'string' && obj.length > 0) return true;
        return false;
    }

    /**
     * 셀렉터의 유효성 검사 : 대상을 모두 검사하여 결과를 리턴한다.
     * 주의!! DOM(web) 에서만 작동한다.
     * @param {string} p_selector 
     * @returns {string} 없는 셀렉터, 통화하면 null 리턴
     * @memberof _L.Common.Util
     */
    var validSelector = function(p_selector) {   // COVER:
        // var selectors = [];

        // selector 얻기
        if (!_isString(p_selector)) return false;

        if (typeof document === 'object' && typeof document.querySelector === 'function') {
            if (document.querySelector(p_selector)) return true;
            return false;

        } else {
            throw new Error('[document.querySelector] module load fail...');
        }
    };


    var loadScript = function(url, callback) {
        var head;
        var script;
        
        if (typeof url !== 'string') throw new Error('url not string');
        if (typeof document !== 'object') throw new Error('document not object');

        head = document.getElementsByTagName('head')[0];
        script = document.createElement('script');

        script.type= 'text/javascript';
        // script.async = true;
        // script.async = false;
        script.defer = true;
        script.src = url;
        if (typeof callback === 'function') {
            // script.onload = callback.bind(this);
            script.addEventListener("load", function(event) { if(typeof callback == "function"){ callback(); }});
        }

        head.appendChild(script);
    };

    //==============================================================
    // 4. module export
    if (isNode) {                                   // strip:     
        exports.validSelector = validSelector;      // strip:
        exports.loadScript = loadScript;            // strip:
    }                                               // strip:

    _global._L               = _global._L || {};
    _global._L.Common        = _global._L.Common || {};
    _global._L.Common.Util   = _global._L.Common.Util || {};

    _global._L.Util.validSelector = validSelector;
    _global._L.Util.loadScript = loadScript;
    _global._L.Common.Util.validSelector = validSelector;
    _global._L.Common.Util.loadScript = loadScript;

}(typeof window !== 'undefined' ? window : global));
