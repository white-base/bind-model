/**** i-service.js | IService ****/
//==============================================================
import { ExtendError }                  from 'logic-entity';
import { Util }                         from './util-wrap.js';
import { IBindModel }                   from './i-bind-model.js';
import { IModelCallback }               from './i-model-callback.js';

var IService  = (function () {
    /**
     * 내보내기 제어 인터페이스 입니다.
     * @constructs _L.Interface.IService
     * @interface
     */
    function IService() {

        /**
         * 테이블
         * @member {object} _L.Interface.IService#tables
         */
        this.tables = [[ String, [String], {} ]];

        /**
         * 매핑 컬렉션
         * @member {Funciton} _L.Interface.IService#mapping
         */
        this.mapping = [[{}]];


        // TODO: 인터페이스 구현 재정의 해야함
        // IBindModel
        this.items = [[{}]];
        this.fn = [[{}]];
        this.command = [[{}]];
        // this.preRegister = [[Function]];
        // this.preCheck = [[Function]];
        // this.preReady = [[Function]];
        // IModelCallback
        this.cbFail = [[Function]];
        this.cbError = [[Function]];
        this.cbBaseBegin = [[Function]];
        this.cbBaseValid = [[Function]];
        this.cbBaseBind = [[Function]];
        this.cbBaseResult = [[Function]];
        this.cbBaseOutput = [[Function]];
        this.cbBaseEnd = [[Function]];

        /**
         * 초기화 이전 등록
         * @member {Function} _L.Interface.IBindModel#preRegister
         */
        this.preRegister = [[Function]];

        /**
         * 초기화 이전 검사
         * @member {Function} _L.Interface.IBindModel#preCheck
         */
        this.preCheck = [[Function]];

        /**
         * 초기화 이전 준비완료
         * @member {Function} _L.Interface.IBindModel#preReady
         */
        this.preReady = [[Function]];

        Util.implements(IService, this);        // strip:
    }
    
    IService._UNION = [IBindModel, IModelCallback];
    IService._NS = 'Interface';    // namespace
    IService._KIND = 'interface';

    // /**
    //  * 초기화 전 등록
    //  * @returns {any}
    //  * @abstract
    //  */
    // IService.prototype.preRegister  = function() {
    //     throw new ExtendError(/EL02311/, null, ['IService']);
    // };

    // /**
    //  * 초기화 전 검사
    //  * @returns {any}
    //  * @abstract
    //  */
    // IService.prototype.preCheck  = function() {
    //     throw new ExtendError(/EL02311/, null, ['IService']);
    // };

    // /**
    //  * 초기화 전 준비
    //  * @returns {any}
    //  * @abstract
    //  */
    // IService.prototype.preReady  = function() {
    //     throw new ExtendError(/EL02311/, null, ['IService']);
    // };

    return IService;
    
}());

export default IService;
export { IService };