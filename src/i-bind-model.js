/**** i-bind-model.js | IBindModel ****/
//==============================================================

/**
 * 바인드 모델 인터페이스입니다.
 * 
 * @interface
 * @constructs _L.Interface.IBindModel
 */
class IBindModel {

    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';

    constructor() {
    }

    /**
     * 아이템
     * 
     * @member {object[][]}
     */
    items = [[{}]];

    /**
     * 지역 함수
     * 
     * @member {object[][]}
     */
    fn = [[{}]];

    /**
     * 바인드 명령
     * 
     * @member {object[][]}
     */
    command = [[{}]];

    /**
     * 초기화 이전 등록
     * 
     * @member {Function[][]}
     */
    preRegister = [[Function]];

    /**
     * 초기화 이전 검사
     * 
     * @member {Function[][]}
     */
    preCheck = [[Function]];

    /**
     * 초기화 이전 준비완료
     * 
     * @member {Function[][]}
     */
    preReady = [[Function]];
}

export default IBindModel;
export { IBindModel };