import MetaElement          = require("logic-core/meta-element");
import BindModel            = require("./bind-model");
import MetaColumn           = require("logic-entity/meta-column");
import MetaTable            = require("logic-entity/meta-table");
import MetaView             = require("logic-entity/meta-view");
import MetaViewCollection   = require("logic-entity/collection-meta-view");

/**
 * 바인드 명령 
 */
declare abstract class BindCommand extends MetaElement {

    /**
     * 바인드 명령 
     * @param bindModel 
     * @param baseTable 
     */
    constructor(bindModel: BindModel, baseTable: MetaTable);

    /**
     * _outputs 컬렉션
     */
    _outputs: MetaViewCollection;

    /**
     * _model 바인드모델
     */
    _model: BindModel;

    /**
     * 이벤트 전파 유무
     * @default true
     */
    _eventPropagation: boolean;

    /**
     * 검사대상 MetaView
     */
    valid: MetaView;

    /**
     * 바인드 MetaView
     */
    bind: MetaView;

    /**
     * 동적 추가됨
     */
    output: MetaView;

    /**
     * 출력(output) 특성
     * 0: 제외(edit),  1: View 오버로딩 , 2: 있는자료만 , 3: 존재하는 자료만 
     */
    outputOption: object;   // TODO: 타입 추출

    /**
     * 검사(valid) 전 콜백
     */
    cbValid: (valid: MetaView)=>boolean;

    /**
     * 바인드(bind) 전 콜백
     */
    cbBind: (cmd: BindCommand, setup: object, _this: this)=>void;   // TODO: 맨뒤 this

    /**
     * 바인드(bind) 결과 콜백 (주요 : 회신자료의 가공의 역활)
     */
    cbResult: (cmd: BindCommand, result: object)=>void;

    /**
     * 바인드 결과 출력 콜백 (주요: 목록의 출력)
     */
    cbOutput:  (cmd: BindCommand, result: object)=>void;

    /**
     * 바인드 처리 종료 후 콜백 (주요: 다른 이벤트 또는 명령과의 연결)
     */
    cbEnd: (cmd: BindCommand, result: object, status: object, xhr: object)=>void;

    /**
     * BindCommand의 실행 전 이벤트 리스너
     * @param cmd 
     */
    _onExecute(cmd: BindCommand);

    /**
     *  BindCommand의 실행 후 이벤트 리스너
     * @param cmd 
     * @param result 
     */
    _onExecuted(cmd: BindCommand, result: object);

    /**
     * 실행 ( valid >> bind >> result >> output >> end )
     */
    abstract execute();

    /**
     * 아이템을 추가하고 명령과 매핑한다.
     * @param column 등록할 아이템
     * @param views 추가할 뷰 엔티티
     */
    addColumn(column: MetaColumn, views: string | string[]);


    /**
     * p_name으로 아이템을 p_entitys(String | String)에 다중 등록한다.
     * @param name 
     * @param value 
     * @param views <선택> 추가할 뷰 엔티티
     */
    addColumnValue(name: string, value: any, views?: string | string[]);

    /**
     * 컬럼 설정
     * @param name 아이템명
     * @param views 설정할 뷰이름
     * @example
     * e.read.setEntity(['idx', 'addr'], 'valid');
     */
    setColumn(name: string | string[], views: string | string[]);

    /**
     * 대상엔티티에서 해제
     * @param name 해제할 아이템명
     * @param views 'valid', 'bind', 'output' 해제할 뷰 엔티티 지정
     */
    release(name: string | string[], views:  string | string[]);

    /**
     * 출력에 사용할 엔티티를 추가한다.
     * 기본 이름 =  'output' + _outout.count
     * @param name 추가로 참조를 지정할 뷰 이름
     */
    newOutput(name?: string)

    /**
     * output View 삭제
     * @param name 
     */
    removeOutput(name: string): boolean;
}

export = BindCommand;