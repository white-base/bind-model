/**** i-command-callback.js | ICommandCallback ****/
//==============================================================
// import { ExtendError }                  from 'logic-entity';

var ICommandCallback  = (function () {
    /**
     * 내보내기 제어 인터페이스 입니다.
     * @constructs _L.Interface.ICommandCallback
     * @interface
     */
    function ICommandCallback() {

        /**
         * 시작 콜백
         * @member {function} _L.Interface.ICommandCallback#cbBegin
         */
        this.cbBegin = [[Function]];

        /**
         * 유효성 콜백
         * @member {function} _L.Interface.ICommandCallback#cbValid
         */
        this.cbValid = [[Function]];

        /**
         * 바인드 콜백
         * @member {function} _L.Interface.ICommandCallback#cbBind
         */
        this.cbBind = [[Function]];

        /**
         * 결과 콜백
         * @member {function} _L.Interface.ICommandCallback#cbResult
         */
        this.cbResult = [[Function]];

        /**
         * 출력 콜백
         * @member {function} _L.Interface.ICommandCallback#cbOutput
         */
        this.cbOutput = [[Function]];

        /**
         * 실행 종료 콜백
         * @member {function} _L.Interface.ICommandCallback#cbEnd
         */
        this.cbEnd = [[Function]];

    }
    ICommandCallback._NS = 'Interface';    // namespace
    ICommandCallback._KIND = 'interface';

    return ICommandCallback;
    
}());

export default ICommandCallback;
export { ICommandCallback };