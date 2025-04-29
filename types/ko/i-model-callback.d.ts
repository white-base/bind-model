// import type { MetaView }        from 'logic-entity/ko';
// import type { MetaColumn }      from 'logic-entity/ko';

/**
 * 객체 통제 인터페이스 입니다.
 * 
 * @interface
 */
declare interface IModelCallback {

    /**
     * valid 에서 실패시 콜백
     */
    cbFail: (result: object, column: object) => void; // TODO: _this 는 모두 model 임  아래쪽도 ..

    /**
     * valid 에서 오류발생시 콜백
     */
    cbError: (msg: string, status: object, response: object) => void; // TODO: _this 검토 필요

        /**
     * 실행 시작 시 호출되는 기본 콜백 함수입니다. (cbBegin 콜백 함수가 없을 경우 사용됨)
     * 
     * @param command - 현재 바인드 명령 객체
     */
    cbBaseBegin: (command: object) => void;

    /**
     * 검사(valid) 전 호출되는 기본 콜백 함수입니다. (cbValid 콜백 함수가 없을 경우 사용됨)
     * 
     * @param valid - 검사할 `MetaView` 객체
     * @param command - 현재 바인드 명령 객체
     * @returns 검사 결과를 나타내는 boolean 값입니다.
     */
    cbBaseValid: (valid: object, command: object) => boolean;

    /**
     *  바인드(bind) 전 호출되는 기본 콜백 함수입니다. (cbBind 콜백 함수가 없을 경우 사용됨)
     * 
     * @param bind - 바인드할 `MetaView` 객체
     * @param command - 현재 바인드 명령 객체
     * @param config - 설정 객체입니다.
     */
    cbBaseBind: (bind: object, command: object, config: object) => void;

    /**
     * 바인드 결과를 처리하는 콜백 함수입니다. (cbResult 콜백 함수가 없을 경우 사용됨)
     * 
     * @param data - 바인드 결과 데이터 객체
     * @param command - 현재 바인드 명령 객체
     * @param response - 응답 객체
     * @returns 처리된 결과 객체를 반환합니다.
     */
    cbBaseResult: (data: object, command: object, response: object) => object;

    /**
     * 바인드 결과를 출력하는 기본 콜백 함수입니다. (cbOutput 콜백 함수가 없을 경우 사용됨)
     * 
     * @param outputs - 메타 뷰 컬렉션
     * @param command - 현재 바인드 명령 객체
     * @param response - 응답 객체
     * @returns 처리된 결과 객체를 반환합니다.
     */
    cbBaseOutput: (outputs: object, command: object, response: object) => void;

    /**
     * 실행 완료 후 호출되는 기본 콜백 함수입니다. (cbEnd 콜백 함수가 없을 경우 사용됨)
     * 
     * @param status - 상태 정보를 담은 객체
     * @param command - 현재 바인드 명령 객체
     * @param response - 응답 객체
     */
    cbBaseEnd: (status: object, command: object, response: object) => void;

}

export default IModelCallback;
export { IModelCallback };