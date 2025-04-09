/**** i-model-callback.js | IModelCallback ****/
//==============================================================
import { ExtendError }                  from 'logic-entity';

var IModelCallback  = (function () {
    /**
     * 내보내기 제어 인터페이스 입니다.
     * @constructs _L.Interface.IModelCallback
     * @interface
     */
    function IModelCallback() {

        /**
         * 실패 콜백
         * @member {function} _L.Interface.IModelCallback#cbFail
         */
        this.cbFail = [[Function]];

        /**
         * 오류 콜백
         * @member {function} _L.Interface.IModelCallback#cbError
         */
        this.cbError = [[Function]];

        /**
         * 기본 시작 콜백
         * @member {function} _L.Interface.IModelCallback#cbBaseBegin
         */
        this.cbBaseBegin = [[Function]];

        /**
         * 기본 유효성 콜백
         * @member {function} _L.Interface.IModelCallback#cbBaseValid
         */
        this.cbBaseValid = [[Function]];

        /**
         * 기본 바인드 콜백
         * @member {function} _L.Interface.IModelCallback#cbBaseBind
         */
        this.cbBaseBind = [[Function]];

        /**
         * 기본 결과 콜백
         * @member {function} _L.Interface.IModelCallback#cbBaseResult
         */
        this.cbBaseResult = [[Function]];

        /**
         * 기본 출력 콜백
         * @member {function} _L.Interface.IModelCallback#cbBaseOutput
         */
        this.cbBaseOutput = [[Function]];

        /**
         * 기본 실행 종료 콜백
         * @member {function} _L.Interface.IModelCallback#cbBaseEnd
         */
        this.cbBaseEnd = [[Function]];

    }

    IModelCallback._NS = 'Interface';    // namespace
    IModelCallback._KIND = 'interface';

    return IModelCallback;
    
}());

export default IModelCallback;
export { IModelCallback };