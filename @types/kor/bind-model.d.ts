import MetaColumn           = require("logic-entity/meta-column");
import MetaTable            = require("logic-entity/meta-table");
import MetaView             = require("logic-entity/meta-view");
import MetaTableCollection  = require("logic-entity/collection-meta-table");
import PropertyCollection   = require("logic-core/collection-property");
import MetaObject           = require("logic-core/meta-object");
import IServiceAjax         = require("./i-service-ajax");

/**
 * 바인드모델 추상클래스
 */
declare abstract class BindModel extends MetaObject {

    /**
     * _tables 
     */
    _tables: MetaTableCollection;

    /**
     * mapping 속성
     */
    _mapping: PropertyCollection;

    /**
     * 아이템 타입을 설정한다.
     */
    _columnType: MetaColumn;

    /**
     * items
     */
    items: PropertyCollection;

    /**
     * 바인드모델 함수 (내부함수 + 노출함수)
     */
    fn: PropertyCollection;

    /**
     *  바인딩 command 
     */
    command: PropertyCollection;

    /**
     *  바인딩 cmd = command (별칭)
     */
    cmd: PropertyCollection;

    /**
     * columns = _baseTable.columns
     */
    columns: PropertyCollection;

    /**
     * valid 에서 실패시 콜백
     */
    cbFail: (result: object, column: MetaColumn)=>void;

    /**
     * valid 에서 오류발생시 콜백
     */
    cbError: (_this: any, msg: string, status: object)=>void; // TODO: _this 검토 필요

    /**
     * 검사(valid)시 기본 콜백 (cbValid 콜백함수가 없을 경우)
     */
    cbBaseValid: (_this: any, valid: MetaView)=>boolean;

    /**
     * 바인드(valid)시 기본 콜백 (cbBind 콜백함수가 없을 경우)
     */
    cbBaseBind: (_this: any, setup: object)=>void;

    /**
     * 바인드 결과 수신 기본 콜백 (cbResult 콜백함수가 없을 경우)
     */
    cbBaseResult: (_this: any, result: object)=>object;

    /**
     * 출력 기본 콜백 (cbOutput 콜백함수가 없을 경우)
     */
    cbBaseOutput: (_this: any, result: object)=>object;

    /**
     * 실행완료시 기본 콜백 (cbEnd 콜백함수가 없을 경우)
     */
    cbBaseEnd: (_this: any, msg: string, status: object, xhr: object)=>void;

    /**
     *  초기화시 등록 preRegister
     */
    preRegister: (model: BindModel)=>void;

    /**
     * 초기화시 검사 preCheck
     */
    preCheck: (model: BindModel)=>boolean;

    /**
     * 초기화시 준비 완료 preReady
     */
    preReady: (model: BindModel)=>void;

    /**
     * 속성을 baseEntiey 또는 지정 Entity에  등록(로딩)한다.
     * @param prop 
     * @param baseEntity 기본엔티티
     */
    _readItem(prop?: object, baseEntity?: MetaTable);

    /**
     * 초기화  
     * 내부적으로 preRegister() >>  preCheck() >> preRedy() 실행한다.
     */
    init();

    /**
     * 테이블 등록
     * @param name 
     */
    addTable(name: string): MetaTable;

    /**
     * 아이템을 추가하고 명령과 매핑한다.
     * @param items 등록할 아이템
     * @param cmds <선택> 추가할 아이템 명령
     * @param views <선택> 추가할 뷰 엔티티
     */
    addColumn(items: MetaColumn, cmds?: string | string[], views?: string | string[]);

    /**
     * p_name으로 아이템을 p_views(String | String)에 다중 등록한다.
     * @param name 
     * @param value 
     * @param cmds 
     * @param views <선택> 추가할 뷰 엔티티
     */
    addColumnValue(name: string, value: any, cmds: string | string[], views?: string | string[]);

    /**
     * 아이템을 매핑한다.
     * @param mapping MetaColumn 에 매핑할 객체 또는 컬렉션
     * @param baseTable 대상 기본 엔티티 
     */
    setMapping(mapping: PropertyCollection | object, baseTable: MetaTable);

    /**
     * 명령 추가 (추상클래스) 상속하여 구현해야 함
     * @param name 
     * @param option 
     * @param baseTable 
     */
    abstract addCommand(name: string, option: number, baseTable?: MetaTable);

    /**
     * 서비스를 설정한다.
     * @param service 서비스객체
     * @param isRead 서비스 내의 prop 를 item 으로 로딩힌다. (기본값: true)
     */
    setService(service: IServiceAjax, isRead: boolean);

}

export = BindModel;