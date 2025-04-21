import type { MetaObject }          from 'logic-entity/ko';
import type { EventEmitter }        from 'logic-entity/ko';
import type { MetaTable }           from 'logic-entity/ko';
import type { BaseBindCommand }     from './base-bind-command.d.ts';

/**
 * `BaseBind` 클래스는 기본 바인드 기능을 제공하며, `MetaObject`를 확장한 클래스입니다.  
 * 이 클래스는 명령을 실행하기 전후에 이벤트를 처리하고, 직렬화 및 역직렬화 기능을 제공합니다.  
 * @abstract
 */
declare abstract class BaseBind extends MetaObject {

    /**
     * 이벤트 객체입니다.  
     * 이벤트의 발행 및 수신을 처리합니다.  
     */
    $event: EventEmitter;

    /**
     * 컬렉션 예약어입니다.  
     * 기본적으로 사용하는 예약어들을 정의합니다.  
     */
    $KEYWORD: string[];

    /**
     * 기본 엔티티를 정의합니다.   
     * 이 엔티티는 메타테이블을 나타냅니다.  
     */
    _baseTable: MetaTable;

    /**
     * 명령 실행 전 호출되는 이벤트입니다.
     * 
     * @event
     * @param cmd - 실행할 명령 객체
     */
    onExecute: (cmd: BaseBindCommand) => void;

    /**
     * 명령 실행 후 호출되는 이벤트입니다.
     * 
     * @event
     * @param cmd - 실행한 명령 객체
     * @param result - 명령 실행 결과 객체
     */
    onExecuted: (cmd: BaseBindCommand, result: object) => void;

    /**
     * 명령 실행 전 이벤트 리스너입니다.
     * 
     * @param cmd - 실행할 명령 객체
     * @listens BaseBind#onExecute
     */
    _onExecute(cmd: BaseBindCommand): void;

    /**
     * 명령 실행 후 이벤트 리스너입니다.
     * 
     * @param cmd - 실행한 명령 객체
     * @param result - 명령 실행 결과 객체
     * @listens BaseBind#onExecuted
     */
    _onExecuted(cmd: BaseBindCommand, result: object): void;

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
     * 메타테이블에 컬럼을 추가합니다.
     * 
     * @abstract
     * @param args - 추가할 컬럼의 속성들
     */
    abstract addColumn(...args): void;
}

export default BaseBind;
export { BaseBind };