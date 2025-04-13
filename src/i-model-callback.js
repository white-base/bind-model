/**** i-model-callback.js | IModelCallback ****/
//==============================================================

/**
 * 모델 콜백 인터페이스입니다.
 * 
 * @interface
 * @constructs _L.Interface.IModelCallback
 */
class IModelCallback {

    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';

    constructor() {
    }

    /**
     * 실패 콜백
     * 
     * @member {function[][]}
     */
    cbFail = [[Function]];

    /**
     * 오류 콜백
     * 
     * @member {function[][]}
     */
    cbError = [[Function]];

    /**
     * 기본 시작 콜백
     * 
     * @member {function[][]}
     */
    cbBaseBegin = [[Function]];

    /**
     * 기본 유효성 콜백
     * 
     * @member {function[][]}
     */
    cbBaseValid = [[Function]];

    /**
     * 기본 바인드 콜백
     * 
     * @member {function[][]}
     */
    cbBaseBind = [[Function]];

    /**
     * 기본 결과 콜백
     * 
     * @member {function[][]}
     */
    cbBaseResult = [[Function]];

    /**
     * 기본 출력 콜백
     * 
     * @member {function[][]}
     */
    cbBaseOutput = [[Function]];

    /**
     * 기본 실행 종료 콜백
     * 
     * @member {function[][]}
     */
    cbBaseEnd = [[Function]];
}

export default IModelCallback;
export { IModelCallback };