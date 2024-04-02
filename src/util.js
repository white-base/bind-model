/**** html-column.js | _L.Meta.Entity.HTMLColumn ****/

// TODO: validSelector() 상위에서 중복 발생 시 경고 또는 중복해서 호출할경우? 

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
    /**
     * 셀렉터의 유효성 검사 : 대상을 모두 검사하여 결과를 리턴한다.
     * 주의!! DOM(web) 에서만 작동한다.
     * @param {String | Object | Array<Object>} p_obj 
     * @returns {String} 없는 셀렉터, 통화하면 null 리턴
     * @memberof _L.Common.Util
     */
    var validSelector = function(p_obj, p_isJQuery) {   // COVER:
        var selectors = [];

        // 입력형식에 따른 배열에 삽입
        if (typeof p_obj === 'string') selectors.push(p_obj);
        else if (typeof p_obj === 'array') {
            selectors = p_obj;
        } else if (typeof p_obj === 'object') {
            for(var prop in p_obj) {
                if (p_obj.hasOwnProperty(prop)) {
                    if (Array.isArray(p_obj[prop])) {
                        selectors = selectors.concat(p_obj[prop]);
                    } else { 
                        selectors.push(p_obj[prop]);
                    }
                }
            }
        }

        if (typeof document === 'object' && typeof document.querySelector === 'function') {     
            // 유효성 검사
            for(var i = 0; selectors.length > i; i++) {
                if (typeof selectors[i] !== 'string') throw new Error('Only [selectors] type "string" can be added');

                if (p_isJQuery === true && jQuery(selectors[i]).length === 0) {
                    return selectors[i];
                } else if (document.querySelector(selectors[i]) === null) {
                    return selectors[i];
                }
            }
        } else {
            throw new Error('[document.querySelector] module load fail...');
        }
        return null;
    };


    //==============================================================
    // 5. module export
    if (isNode) {     
        exports.validSelector               = validSelector;
    } else {
        _global._L.validSelector            = validSelector;
        // namespace
        _global._L.Common.Util              = validSelector;
    }

}(typeof window !== 'undefined' ? window : global));
