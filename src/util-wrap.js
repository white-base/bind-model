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
 * 
 * @param {string} p_selector 
 * @returns {boolean} selector 유효성 여부
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

/**
 * 스크립트를 로드한다.
 * 
 * @param {*} url 
 * @param {*} callback 
 */
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
        script.addEventListener('load', function() { if(typeof callback === 'function'){ callback(); }});
    }

    head.appendChild(script);
};

/**
 * DOM 말단(leaf) 요소의 텍스트를 수집하고
 * 불필요한 중간 태그·:nth-child(1) 을 정리한 셀렉터 목록을 반환합니다.
 * 각 단계는 공백(자손 선택자)으로 구분됩니다.
 *
 * @returns {string[]}  예) #sod_fin_orderer tr:nth-child(1) td | text | 홍길동
 */
Util.extractSelector = function extractSelector() {
    var results = [];
    var seen = {};
    var SKIP_TAGS = {
        table: true, tbody: true, thead: true, tfoot: true,
        form: true, fieldset: true, legend: true,
        main: true, aside: true, article: true, section: true,
        ul: true, div: true
    };
    var KEEP_NTH_CHILD_TAGS = { tr: true, li: true, option: true };

    try {
        var all = document.querySelectorAll('body *');
        for (var i = 0; i < all.length; i++) {
            var el = all[i];
            if (!isLeaf(el)) continue;

            var text = el.innerText || el.textContent;
            if (text && text.trim()) pushResult(el, text.trim());
        }
        return results;
    } catch (e) {
        console.error(e);
        return [];
    }

    // inner function
    /** 중간 태그 생략 여부 */
    function shouldSkip(el) {
        if (!(el instanceof Element)) return false;
        var tag = el.tagName.toLowerCase();
        if (tag === 'script') return true;                 // <script> 제거
        if (!SKIP_TAGS[tag]) return false;                 // 목록에 없으면 keep
        if ((tag === 'div' || tag === 'section' || tag === 'article')
             && (el.id || el.className.trim())) return false; // 식별자 있으면 keep
        return true;                                       // 그 외 생략
    }
    /** leaf 판정 */
    function isLeaf(el) {
        return el instanceof Element &&
               el.tagName.toLowerCase() !== 'script' &&
               el.children.length === 0;
    }
    /** raw 셀렉터 생성(공백 구분) */
    function getRawSelector(el) {
        var path = [];
        var cur = el;

        while (cur && cur.nodeType === 1) {
            if (shouldSkip(cur)) { cur = cur.parentNode; continue; }

            var tag = cur.tagName.toLowerCase();
            var part = tag;

            if (cur.id) {                     // id 발견 시 경로 종결
                path.unshift('#' + cur.id);
                break;
            }

            // class 포함
            var cls = cur.className.trim();
            if (cls) part += '.' + cls.split(/\s+/).join('.');

            // 형제 위치 계산
            var parent = cur.parentNode;
            if (parent) {
                var idx = 1;
                for (var s = parent.children[0]; s && s !== cur; s = s.nextElementSibling) {
                    if (s.tagName === cur.tagName) idx++;
                }
                part += ':nth-child(' + idx + ')';
            }
            path.unshift(part);
            cur = cur.parentNode;
        }
        return path.join(' ');
    }
    /** 2차 가공: 중간 태그 제거 + 필요 없는 :nth-child(1) 삭제 */
    function simplifySelector(sel) {
        var segs = sel.split(/\s+/);      // 공백 단위 분리
        var out = [];

        if (segs.length) {
            out.push(segs[0]);            // #id 또는 루트 태그

            for (var i = 1; i < segs.length; i++) {
                var seg = segs[i];
                var tag = (seg.match(/^([a-zA-Z0-9_-]+)/) || [])[1] || '';

                // 중간 생략 대상이면 skip
                if (SKIP_TAGS[tag]) continue;

                // :nth-child(1) 삭제 (단, KEEP 대상 태그는 보존)
                if (!KEEP_NTH_CHILD_TAGS[tag])
                    seg = seg.replace(/:nth-child\(1\)/g, '');

                out.push(seg);
            }
        }
        return out.join(' ');
    }
    /** 결과 저장 */
    function pushResult(el, txt) {
        var rawSel = getRawSelector(el);
        if (!rawSel) return;

        var sel = simplifySelector(rawSel);
        var val = txt.substring(0, 10);        // 앞 10자
        var key = sel + '|text|' + val;
        if (!seen[key]) {
            seen[key] = true;
            results.push(sel + ' | text | ' + val);
        }
    }
};

export default Util;
export { Util };