/**** i-service-ajax.js | IAjaxService ****/
//==============================================================
import { IService }                     from './i-service.js';

/**
 * AJAX 서비스 인터페이스입니다.
 * 
 * @interface
 * @extends IService
 * @constructs IAjaxService
 */
class IAjaxService extends IService {
    
    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';

    constructor() {
        super();
    }

    /**
     * 기본 AJAX Setup 객체
     * 
     * @member {object[][]}
     */
    baseConfig = [[{}]];

    /**
     * 기본 요청 url
     * 
     * @member {string[][]}
     */
    url = [[String]];
}

export default IAjaxService;
export { IAjaxService };