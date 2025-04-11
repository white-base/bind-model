/**** i-bind-model.js | IBindModel ****/
//==============================================================
// import { ExtendError }                  from 'logic-entity';

var IBindModel  = (function () {
    /**
     * 내보내기 제어 인터페이스 입니다.
     * @constructs _L.Interface.IBindModel
     * @interface
     */
    function IBindModel() {
        
        /**
         * 아이템
         * @member {object} _L.Interface.IBindModel#items
         */
        this.items = [[{}]];

        /**
         * 지역 함수
         * @member {object} _L.Interface.IBindModel#fn
         */
        this.fn = [[{}]];

        /**
         * 바인드 명령
         * @member {object} _L.Interface.IBindModel#command
         */
        this.command = [[{}]];

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
    }

    IBindModel._NS = 'Interface';    // namespace
    IBindModel._KIND = 'interface';

    return IBindModel;
    
}());

export default IBindModel;
export { IBindModel };