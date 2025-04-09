/**** util-wrap.js | Util ****/
//==============================================================
import { ExtendError }                  from 'logic-entity';
import { Util }                         from 'logic-entity';

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
Util.validSelector = function validSelector(p_selector) {   // COVER:
    // var selectors = [];

    // selector 얻기
    if (!_isString(p_selector)) return false;

    if (typeof document === 'object' && typeof document.querySelector === 'function') {
        if (document.querySelector(p_selector)) return true;
        return false;

    } else {
        throw new ExtendError(/EL01611/, null, []);
    }
};

Util.loadScript = function loadScript(url, callback) {
    var head;
    var script;
    
    if (typeof url !== 'string') throw new ExtendError(/EL01612/, null, []);
    if (typeof document !== 'object') throw new ExtendError(/EL01613/, null, []);

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

export default Util;
export { Util };