/**** i-command-callback.js | ICommandCallback ****/
//==============================================================

/**
 * 명령 콜백 인터페이스입니다.
 * 
 * @interface
 * @constructs _L.Interface.ICommandCallback
 */
class ICommandCallback {

    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';

    constructor() {
    }

    /**
     * 시작 콜백
     * 
     * @member {function[][]}
     */
    cbBegin = [[Function]];

    /**
     * 유효성 콜백
     * 
     * @member {function[][]}
     */
    cbValid = [[Function]];

    /**
     * 바인드 콜백
     * 
     * @member {function[][]}
     */
    cbBind = [[Function]];

    /**
     * 결과 콜백
     * 
     * @member {function[][]}
     */
    cbResult = [[Function]];

    /**
     * 출력 콜백
     * 
     * @member {function[][]}
     */
    cbOutput = [[Function]];

    /**
     * 실행 종료 콜백
     * 
     * @member {function[][]}
     */
    cbEnd = [[Function]];
}

export default ICommandCallback;
export { ICommandCallback };