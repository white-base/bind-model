import type { MetaElement }          from 'logic-entity/ko';
import type { MetaColumn }           from 'logic-entity/ko';
import type { MetaTable }            from 'logic-entity/ko';
import type { MetaView }             from 'logic-entity/ko';
import type { MetaViewCollection}    from 'logic-entity/ko';
import type { BaseBindModel }        from './base-bind-model.d.ts';

/**
 * 바인드 명령을 정의하는 추상 클래스입니다.  
 * 이 클래스는 바인드 명령의 실행 및 관련 작업을 관리합니다.  
 * 
 * @abstract
 */
declare abstract class BaseBindCommand extends MetaElement {

    /**
     * 바인드 명령의 생성자입니다.
     * 
     * @param BaseBindModel - 바인드 모델 객체
     * @param baseTable - 기본 테이블 객체
     */
    constructor(BaseBindModel: BaseBindModel, baseTable: MetaTable);

    /**
     * 출력 결과를 저장하는 컬렉션입니다.
     */
    _outputs: MetaViewCollection;

    /**
     * 
     */
    _model: BaseBindModel;

    /**
     * 검사 대상 MetaView 객체입니다.
     */
    valid: MetaView;

    /**
     * 바인드 대상 MetaView 객체입니다.
     */
    bind: MetaView;

    /**
     * 동적으로 추가된 출력 MetaView 객체입니다.
     */
    output: MetaView;

    /**
     * 출력 특성 옵션입니다.  
     * - 0: 제외  
     * - 1: 모든 컬럼의 로우 가져옴  
     * - 2: 존재하는 컬럼의 로우만 가져옴  
     * - 3: 존재하는 커럼의 로우만 가져오고, value 설정  
     */
    outputOption: object;   // TODO: 타입 추출

    /**
     * 실행 시작 시 호출되는 콜백 함수입니다. 
     * 
     * @param cmd - 현재 바인드 명령 객체
     */
    cbBegin: (cmd: BaseBindCommand) => void;

    /**
     * 검사(valid) 전 호출되는 콜백 함수입니다.
     * 
     * @param valid - 검사할 `MetaView` 객체
     * @param cmd - 현재 바인드 명령 객체
     * @returns 검사 결과를 나타내는 boolean 값입니다.
     */
    cbValid: (valid: MetaView, cmd: BaseBindCommand) => boolean;

    /**
     * 바인드(bind) 전 호출되는 콜백 함수입니다.
     * 
     * @param bind - 전송할 `MetaView` 객체
     * @param cmd - 현재 바인드 명령 객체
     * @param setup - 설정 객체
     */
    cbBind: (bind: MetaView, cmd: BaseBindCommand, setup: object) => void;   // TODO: 맨뒤 this

    /**
     * 바인드 결과를 처리하는 콜백 함수입니다.
     * 주로 결과 데이터 가공에 사용됩니다.
     * 
     * @param data - 바인드 결과 데이터
     * @param cmd - 현재 바인드 명령 객체
     * @param response - response 객체
     * @returns 처리된 결과 데이터입니다.
     */
    cbResult: (data: object, cmd: BaseBindCommand, response: object) => object;

    /**
     * 바인드 결과를 출력하는 콜백 함수입니다.
     * 주로 목록의 출력에 사용됩니다.
     * 
     * @param views - 출력 뷰 컬렉션 (_outputs)
     * @param cmd - 현재 바인드 명령 객체
     * @param response - response 객체
     */
    cbOutput:  (views: MetaViewCollection, cmd: BaseBindCommand, response: object) => void;

    /**
     *  실행 완료 후 호출되는 콜백 함수입니다. 
     * 
     * @param status - 상태 정보
     * @param cmd - 현재 바인드 명령 객체
     * @param response - response 객체
     */
    cbEnd: (status: object, cmd: BaseBindCommand, response: object) => void;

    /**
     * 바인드 명령의 실행 전 호출되는 이벤트 리스너입니다.
     * 
     * @param cmd - 현재 바인드 명령 객체
     */
    _onExecute(cmd: BaseBindCommand): void;

    /**
     * 바인드 명령의 실행 후 호출되는 이벤트 리스너입니다.
     * 
     * @param cmd - 현재 바인드 명령 객체
     * @param result - 실행 결과 데이터
     */
    _onExecuted(cmd: BaseBindCommand, result: object): void;

    /**
     * 바인드 명령을 실행합니다.  
     * 실행 순서: valid >> bind >> result >> output >> end  
     * 
     * @abstract
     */
    abstract execute(): void;

    /**
     * 컬럼을 추가하고 지정한 뷰와 매핑합니다.
     * 
     * @param column - 등록할 컬럼 객체 또는 문자열
     * @param views - 추가할 뷰 엔티티 이름  (문자열 또는 문자열 배열)
     * @param bTable - (선택적) 매핑할 기본 테이블 객체 또는 테이블 이름
     */
    addColumn(column: string | MetaColumn, views: string | string[], bTable?: string | MetaTable): void;

    /**
     * 컬럼과 값을 추가하고 지정한 뷰와 매핑합니다.
     * 
     * @param name - 컬럼 이름
     * @param value - 컬럼 값
     * @param views - (선택적) 추가할 뷰 엔티티 이름
     * @param bTable - (선택적) 매핑할 기본 테이블 객체 또는 테이블 이름
     */
    addColumnValue(name: string, value: any, views?: string | string[], bTable?: string | MetaTable): void;

    /**
     * 컬럼을 설정합니다.
     * 
     * @param name - 컬럼 이름 또는 이름 배열
     * @param views - 설정할 뷰 이름 또는 이름 배열
     * 
     * @example
     * e.read.setColumn(['idx', 'addr'], 'valid');
     */
    setColumn(name: string | string[], views: string | string[]): void;

    /**
     * 대상 엔티티에서 컬럼을 해제합니다.
     * 
     * @param name - 해제할 컬럼 이름 또는 이름 배열
     * @param views - 해제할 뷰 엔티티 이름 또는 이름 배열
     */
    release(name: string | string[], views: string | string[]): void;

    /**
     * 출력에 사용할 뷰 엔티티를 추가합니다.
     * 기본 이름은 'output' + _outputs.count입니다.
     * 
     * @param name - (선택적) 추가로 참조할 뷰 이름
     */
    newOutput(name?: string): void;

    /**
     * 출력 뷰를 삭제합니다.
     * 
     * @param name - 삭제할 뷰 이름
     * @returns 삭제 성공 여부를 나타내는 boolean 값입니다.
     */
    removeOutput(name: string): boolean;
}

export default BaseBindCommand;
export { BaseBindCommand };