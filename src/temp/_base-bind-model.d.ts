import type { MetaColumn }                  from 'logic-entity/ko';
import type { MetaTable }                   from 'logic-entity/ko';
import type { MetaView }                    from 'logic-entity/ko';
import type { MetaTableCollection }         from 'logic-entity/ko';
import type { PropertyCollection }          from 'logic-entity/ko';
import type { MetaTableColumnCollection }   from 'logic-entity/ko';
import type { MetaViewCollection }          from 'logic-entity/ko';
import type { BaseBind }                    from './base-bind.d.ts';
import type { IServiceAjax }                from './i-service-ajax.d.ts';
import type { BaseBindCommand }             from './base-bind-command.d.ts';
import type { HTMLColumn }                  from './html-column.js';
import type { BindCommand }                 from './bind-command.js';

/**
 * 바인드모델 추상클래스
 * 이 클래스는 데이터 바인딩, 명령 실행 및 이벤트 관리를 위한 기본 구조를 제공합니다.
 * 
 * @abstract
 */
declare abstract class BaseBindModel extends BaseBind {

    /**
     * 메타 테이블 컬렉션입니다.  
     * 여러 메타 테이블을 관리합니다.  
     */
    _tables: MetaTableCollection;

    /**
     * 매핑 속성 컬렉션입니다.
     */
    _mapping: PropertyCollection<object>;

    /**
     * 컬럼 타입을 설정합니다.
     */
    _columnType: MetaColumn;

    /**
     * 아이템 컬렉션입니다.
     */
    items: PropertyCollection<HTMLColumn>;

    /**
     * 바인드모델 함수 컬렉션입니다. (내부함수 + 노출함수)
     */
    fn: PropertyCollection<Function>;

    /**
     * 바인딩 명령 컬렉션입니다.
     */
    command: PropertyCollection<BindCommand>;

    /**
     * command 의 별칭입니다.
     */
    cmd: PropertyCollection<BindCommand>;

    /**
     * 컬럼 컬렉션입니다.
     * _baseTable의 컬럼을 나타냅니다.
     */
    columns: MetaTableColumnCollection<HTMLColumn>;

    /**
     * 동적으로 생성된 첫 번째 메타 테이블입니다.
     */
    first: MetaTable;

    /**
     * 검사(valid)에서 실패 시 호출되는 콜백 함수입니다.
     * 
     * @param result - 검사 결과를 담은 객체
     * @param column - 검사에 사용된 `MetaColumn` 객체
     */
    cbFail: (result: object, column: MetaColumn) => void;

    /**
     * 오류 발생 시 호출되는 콜백 함수입니다.
     * 
     * @param msg - 오류 메시지
     * @param status - 상태 정보를 담은 객체
     * @param response - 응답 객체
     */    
    cbError: (msg: string, status: object, response: object) => void; // TODO: _this 검토 필요

    /**
     * 실행 시작 시 호출되는 기본 콜백 함수입니다. (cbBegin 콜백 함수가 없을 경우 사용됨)
     * 
     * @param command - 현재 바인드 명령 객체
     */
    cbBaseBegin: (command: BaseBindCommand) => void;

    /**
     * 검사(valid) 전 호출되는 기본 콜백 함수입니다. (cbValid 콜백 함수가 없을 경우 사용됨)
     * 
     * @param valid - 검사할 `MetaView` 객체
     * @param command - 현재 바인드 명령 객체
     * @returns 검사 결과를 나타내는 boolean 값입니다.
     */
    cbBaseValid: (valid: MetaView, command: BaseBindCommand) => boolean;

    /**
     *  바인드(bind) 전 호출되는 기본 콜백 함수입니다. (cbBind 콜백 함수가 없을 경우 사용됨)
     * 
     * @param bind - 바인드할 `MetaView` 객체
     * @param command - 현재 바인드 명령 객체
     * @param config - 설정 객체입니다.
     */
    cbBaseBind: (bind: MetaView, command: BaseBindCommand, config: object) => void;

    /**
     * 바인드 결과를 처리하는 콜백 함수입니다. (cbResult 콜백 함수가 없을 경우 사용됨)
     * 
     * @param data - 바인드 결과 데이터 객체
     * @param command - 현재 바인드 명령 객체
     * @param response - 응답 객체
     * @returns 처리된 결과 객체를 반환합니다.
     */
    cbBaseResult: (data: object, command: BaseBindCommand, response: object) => object;

    /**
     * 바인드 결과를 출력하는 기본 콜백 함수입니다. (cbOutput 콜백 함수가 없을 경우 사용됨)
     * 
     * @param outputs - 메타 뷰 컬렉션
     * @param command - 현재 바인드 명령 객체
     * @param response - 응답 객체
     * @returns 처리된 결과 객체를 반환합니다.
     */
    cbBaseOutput: (outputs: MetaViewCollection, command: BaseBindCommand, response: object) => object;

    /**
     * 실행 완료 후 호출되는 기본 콜백 함수입니다. (cbEnd 콜백 함수가 없을 경우 사용됨)
     * 
     * @param status - 상태 정보를 담은 객체
     * @param command - 현재 바인드 명령 객체
     * @param response - 응답 객체
     */
    cbBaseEnd: (status: object, command: BaseBindCommand, response: object) => void;

    /**
     * init() 호출시 처음에 호출되는 콜백 함수입니다.
     * 
     * @param model - 현재 바인드 모델 객체
     */
    preRegister: (model: BaseBindModel) => void;

    /**
     * init() 호출시 boolean 을 리턴하는 콜백 함수입니다.
     * 
     * @param model - 현재 바인드 모델 객체
     * @returns 검사 결과를 나타내는 boolean 값입니다.
     */
    preCheck: (model: BaseBindModel)=>boolean;

    /**
     * init() 호출시 preCheck 콜백 함수 결과가 true 일때 호출되는 콜백 함수입니다.
     * 
     * @param model - 현재 바인드 모델 객체
     */
    preReady: (model: BaseBindModel) => void;

    /**
     * 속성을 _baseTable 또는 지정 MetaTable 에 등록(로딩)합니다.
     * 
     * @param items - 읽을 아이템의 이름 (문자열 또는 문자열 배열)
     * @param baseEntity - 기본 테이블 객체 (선택적)
     */
    _readItem(items?: string | string[], baseEntity?: MetaTable): void;

    /**
     * 객체를 GUID 타입의 객체 리터럴로 반환합니다.
     * 
     * @param mode - 가져오기 모드  
     * mode=0 : 참조 구조(_guid:Yes, $ref:Yes)  
     * mode=1 : 중복 구조(_guid:Yes, $ref:Yes)  
     * mode=2 : 비침조 구조(_guid:No,  $ref:No)   
     * @param context - 현재 객체를 포함(소유)하는 상위 객체
     * @returns GUID 타입의 객체 리터럴
     */
    getObject(mode?: number, context?: object | object[]): object;

    /**
     * GUID 타입의 객체 리터럴을 인스턴스 객체로 변환하여 설정합니다.
     * 
     * @param guidObj - 설정할 GUID 타입의 객체 리터럴
     * @param guidRootObj - 변환 과정에서 참조되는 초기 GUID 리터럴 객체  
     */
    setObject(guidObj: object, guidRootObj?: object): void;


    /**
     * 초기화 작업을 수행합니다.
     * 내부적으로 `preRegister()` -> `preCheck()` -> `preReady()` 순서로 호출합니다.
     */
    init(): void;

    /**
     * 테이블을 등록합니다.
     * 
     * @param name - 등록할 테이블의 이름
     * @returns 등록된 메타 테이블 객체를 반환합니다.
     */
    addTable(name: string): MetaTable;

    /**
     * 컬럼을 추가하고 명령과 매핑합니다.
     * 
     * @param column -  등록할 컬럼 객체 또는 문자열
     * @param cmds - (선택적) 뷰의 위치를 지정하는 명령 (문자열 또는 문자열 배열)
     * @param views - (선택적) 추가할 뷰 엔티티 이름 (문자열 또는 문자열 배열일)
     * @param bTable - (선택적) 매핑할 기본 테이블 객체 또는 테이블 이름
     */
    addColumn(column: MetaColumn, cmds?: string | string[], views?: string | string[], bTable?: string | MetaTable): void;

    /**
     * 컬럼과 값을 추가하고 지정된 테이블에 추가하며, 컬럼의 참조를 BaseBindCommand의 valid, bind, output MetaView에 등록합니다.
     * 
     * @param name - 컬럼 이름
     * @param value - 컬럼 값
     * @param cmds - 뷰의 위치를 지정하는 명령 (문자열 또는 문자열 배열)
     * @param views - 추가할 뷰 엔티티 이름입니다. (문자열 또는 문자열 배열)
     * @param bTable - (선택적) 매핑할 기본 테이블 객체 또는 테이블 이름
     */
    addColumnValue(name: string, value: any, cmds?: string | string[], views?: string | string[], bTable?: string | MetaTable): void;

    /**
     * 컬럼을 매핑합니다.
     * 
     * @param mapping - MetaColumn에 매핑할 객체 또는 컬렉션
     * @param baseTable - (선택적) 매핑할 기본 테이블 객체 또는 테이블 이름
     */
    setMapping(mapping: PropertyCollection<object> | object, baseTable?: string | MetaTable): void;

    /**
     * 명령을 추가합니다. (추상클래스) 상속하여 구현해야 합니다.
     * 
     * @param name - 추가할 명령의 이름
     * @param option - 명령의 출력옵션
     * @param baseTable - 기본 테이블
     */
    abstract addCommand(name: string, option: number, baseTable?: string | MetaTable): void;

    /**
     * 서비스를 설정합니다.
     * 
     * @param service - 서비스 객체
     * @param passTypeChk - 서비스객체 type 검사 통과 유무 (기본값: false)
     */
    setService(service: IServiceAjax, passTypeChk?: boolean): void;

}

export default BaseBindModel;
export { BaseBindModel };