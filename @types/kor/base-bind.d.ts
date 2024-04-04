import MetaObject           = require("logic-core/meta-object");
import Observer             = require("logic-entity/object-column");
import { MetaTable } from "logic-entity";
import BindCommand from "./bind-command";

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
     * 실행전 이벤트
     * @event
     */
    onExecute: (cmd: BindCommand)=>void;

    /**
     * 실행후 이벤트
     * @event
     */
    onExecuted: (cmd: BindCommand, result: object)=>void;

    /**
     * 실행후 이벤트 리스너
     * @param cmd 
     * @listens BaseBind#onExecute
     */
    _onExecute(cmd: BindCommand);

    /**
     * 실행후 이벤트 리스너
     * @param cmd 
     * @param result 
     * @listens BaseBind#onExecuted
     */
    _onExecuted(cmd: BindCommand, result: object);

    /**
     * 컬럼 추가
     */
    abstract addColumn();
}

export = BaseBind;