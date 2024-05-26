import MetaObject           = require("logic-core/meta-object");
import Observer             = require("logic-entity/object-column");
import MetaTable            = require("logic-entity/meta-table");
import BindCommand          = require("./bind-command");

/**
 * 기본 바인드 (최상위)
 */
declare abstract class BaseBind extends MetaObject {

    /**
     * 이벤트 객체
     */
    $event: Observer;

    /**
     * 컬렉션 예약어
     */
    $KEYWORD: string[];

    /**
     * 기본 엔티티
     */
    _baseTable: MetaTable;

    /**
     * 실행 전 이벤트
     * @event
     */
    onExecute: (cmd: BindCommand)=>void;

    /**
     * 실행 후 이벤트
     * @event
     */
    onExecuted: (cmd: BindCommand, result: object)=>void;

    /**
     * 실행 후 이벤트 리스너
     * @param cmd 
     * @listens BaseBind#onExecute
     */
    _onExecute(cmd: BindCommand);

    /**
     * 실행 후 이벤트 리스너
     * @param cmd 
     * @param result 
     * @listens BaseBind#onExecuted
     */
    _onExecuted(cmd: BindCommand, result: object);

    /**
     * 현재 객체를 직렬화(guid 타입) 객체로 얻습니다. 
     * (순환참조는 $ref 값으로 대체된다.) 
     * @param vOpt [p_vOpt=0] 가져오기 옵션
     * - opt=0 : 참조 구조(_guid:Yes, $ref:Yes)  
     * - opt=1 : 중복 구조(_guid:Yes, $ref:Yes)  
     * - opt=2 : 비침조 구조(_guid:No,  $ref:No) 
     * @param owned [p_owned={}] 현재 객체를 소유하는 상위 객체들
     * @example
     * a.getObject(2) == b.getObject(2
     */
    getObject(vOpt?: number, owned?: object | Array<object>): object;

    /**
     * 직렬화(guid 타입) 객체를 현재 객체에 설정합니다.  
     * (객체는 초기화 된다.)
     * @param oGuid 직렬화 할 guid 타입의 객체
     * @param origin [p_origin=p_oGuid] 현재 객체를 설정하는 원본 객체  
     */
    setObject(oGuid: object, origin?: object);

    /**
     * 메타테이블에 컬럼을 추가합니다.
     */
    abstract addColumn();
}

export = BaseBind;