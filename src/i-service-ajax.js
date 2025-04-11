/**** i-service-ajax.js | IAjaxService ****/
//==============================================================
// import { ExtendError }                  from 'logic-entity';
import { Util }                         from './util-wrap.js';
import { IService }                     from './i-service.js';

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
         * @member {string} _L.Interface.IAjaxService#url
         */
        this.url = [[String]];

    }
    Util.inherits(IAjaxService, _super);

    IAjaxService._NS = 'Interface';    // namespace
    IAjaxService._KIND = 'interface';

    return IAjaxService;
    
}(IService));

export default IAjaxService;
export { IAjaxService };