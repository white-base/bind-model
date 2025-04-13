/**** i-service.js | IService ****/
//==============================================================
import { IBindModel }                   from './i-bind-model.js';
import { IModelCallback }               from './i-model-callback.js';

/**
 * 서비스 인터페이스입니다.
 * 
 * @interface
 * @constructs _L.Interface.IService
 */
class IService {

    static _UNION = [IBindModel, IModelCallback];
    static _NS = 'Interface';
    static _KIND = 'interface';

    constructor() {
    }

    /**
     * 테이블
     * 
     * @member {object[][]}
     */
    tables = [[ String, [String], {} ]];

    /**
     * 매핑 컬렉션
     * 
     * @member {object[][]}
     */
    mapping = [[{}]];

    // IBindModel 구성 요소
    items = [[{}]];
    fn = [[{}]];
    command = [[{}]];
    preRegister = [[Function]];
    preCheck = [[Function]];
    preReady = [[Function]];

    // IModelCallback 구성 요소
    cbFail = [[Function]];
    cbError = [[Function]];
    cbBaseBegin = [[Function]];
    cbBaseValid = [[Function]];
    cbBaseBind = [[Function]];
    cbBaseResult = [[Function]];
    cbBaseOutput = [[Function]];
    cbBaseEnd = [[Function]];
}

export default IService;
export { IService };