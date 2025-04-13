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
     * @param cmd - 실행할 명령 객체입니다.
     */
    onExecute: (cmd: BaseBindCommand) => void;

    /**
     * 명령 실행 후 호출되는 이벤트입니다.
     * 
     * @event
     * @param cmd - 실행한 명령 객체입니다.
     * @param result - 명령 실행 결과 객체입니다.
     */
    onExecuted: (cmd: BaseBindCommand, result: object) => void;

    /**
     * 명령 실행 전 이벤트 리스너입니다.
     * 
     * @param cmd - 실행할 명령 객체입니다.
     * @listens BaseBind#onExecute
     */
    _onExecute(cmd: BaseBindCommand): void;

    /**
     * 명령 실행 후 이벤트 리스너입니다.
     * 
     * @param cmd - 실행한 명령 객체입니다.
     * @param result - 명령 실행 결과 객체입니다.
     * @listens BaseBind#onExecuted
     */
    _onExecuted(cmd: BaseBindCommand, result: object): void;

    /**
     * 현재 객체를 직렬화(guid 타입) 객체로 얻는 메서드입니다.  
     * (순환참조는 $ref 값으로 대체됩니다.)  
     * 
     * @param vOpt - 가져오기 옵션입니다.  
     * - opt=0 : 참조 구조(_guid:Yes, $ref:Yes)  
     * - opt=1 : 중복 구조(_guid:Yes, $ref:Yes)  
     * - opt=2 : 비침조 구조(_guid:No, $ref:No)  
     * @param owned - 현재 객체를 소유하는 상위 객체들입니다.
     * 
     * @example
     * a.getObject(2) == b.getObject(2)
     */
    getObject(vOpt?: number, owned?: object | Array<object>): object;

    /**
     * 직렬화(guid 타입) 객체를 현재 객체에 설정합니다.  
     * (객체는 초기화 된다.)  
     * 
     * @param oGuid - 직렬화 할 guid 타입의 객체입니다.
     * @param origin - 현재 객체를 설정하는 원본 객체입니다.
     */
    setObject(oGuid: object, origin?: object): void;

    /**
     * 메타테이블에 컬럼을 추가합니다.
     * 
     * @abstract
     * @param args - 추가할 컬럼의 속성들입니다.
     */
    abstract addColumn(...args): void;
}

export default BaseBind;
export { BaseBind };