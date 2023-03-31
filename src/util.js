/**
 * namespace _L.Common.Util
 * TODO: validSelector() 상위에서 중복 발생 시 경고 또는 중복해서 호출할경우? 
 * 
 */
(function(global) {
    'use strict';

    //==============================================================
    // 1. 의존 모듈 선언
    global._L               = global._L || {};
    global._L.Common        = global._L.Common || {};
    global._L.Common.Util   = global._L.Common.Util || {};

    //==============================================================
    // 2. 모듈 가져오기 (node | web)
    var Util;

    if (typeof module === 'object' && typeof module.exports === 'object') {     
        Util                = require('./util');
    } else {
        Util                = global._L.Common.Util
    }

    //==============================================================
    // 3. 의존성 검사
    if (typeof Util === 'undefined') throw new Error('[Util] module load fail...');    
    
    //==============================================================
    // 4. 모듈 구현    

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
    // 5. 모듈 내보내기 (node | web)
    if (typeof module === 'object' && typeof module.exports === 'object') {     
        module.exports.validSelector = validSelector;   // node 에서는 테스트 불가능!
    } else {    // COVER:
        global._L.Common.Util.validSelector = validSelector;
    }

}(typeof module === 'object' && typeof module.exports === 'object' ? global : window));