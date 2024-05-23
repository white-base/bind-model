/**** html-column.js | _L.Meta.Entity.HTMLColumn ****/
(function(_global) {
    'use strict';

    var isNode = typeof window !== 'undefined' ? false : true;

    //==============================================================
    // 1. 의존 모듈 선언
    _global._L               = _global._L || {};
    _global._L.Common        = _global._L.Common || {};
    _global._L.Common.Util   = _global._L.Common.Util || {};

    //==============================================================
    // 2. import module
    if (isNode) {  
        var _Message                    = require('logic-entity').Message;
        var _ExtendError                = require('logic-entity').ExtendError;
        var _Util                       = require('logic-entity').Util;
    } else {
        var $Message                    = _global._L.Message;
        var $ExtendError                = _global._L.ExtendError;
        var $Util                       = _global._L.Util;
    }
    var Message                 = _Message              || $Message;
    var ExtendError             = _ExtendError          || $ExtendError;
    var Util                    = _Util                 || $Util;

    //==============================================================
    // 3. module dependency check
    if (typeof ExtendError === 'undefined') throw new Error(Message.get('ES011', ['ExtendError', 'extend-error']));
    if (typeof Util === 'undefined') throw new Error(Message.get('ES011', ['Util', 'util']));
    
    //==============================================================
    // 4. module implementation
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
    // 5. module export
    if (isNode) {                                   // strip:     
        exports.validSelector = validSelector;      // strip:
        exports.loadScript = loadScript;            // strip:
    }                                               // strip:

    _global._L.Util.validSelector           = validSelector;
    _global._L.Util.loadScript              = loadScript;
    _global._L.Common.Util.validSelector    = validSelector;
    _global._L.Common.Util.loadScript       = loadScript;

}(typeof window !== 'undefined' ? window : global));
