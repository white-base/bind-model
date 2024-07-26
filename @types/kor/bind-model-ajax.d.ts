import BindModel           = require("./bind-model");
import IServiceAjax         = require("./i-service-ajax");
import BaseColumnCollection = require("logic-entity/base-column-collection");
import MetaTable            = require("logic-entity/meta-table");
import BindCommand          = require("./bind-command");

/**
 * 바인드모델 Ajax
 */
declare class BindModelAjax extends BindModel {

    /**
     * 바인드모델 Ajax
     * @param service 
     */
    constructor(service: IServiceAjax);

    /**
     * 바인딩 기본 config 을 설정한다.
     */
    baseConfig: object;  // TODO: 타입 분리

    /**
     *  바인딩 기본 config.url 을 설정한다.
     * @example
     * const bm = new BindModelAjax();
     * bm.url = '/user';
     */
    url: string;

    /**
     * 동적 생성, _tables[0]
     */
    first: MetaTable;

    /**
     * 셀렉터 검사
     * @param collection 
     */
    checkSelector(collection: BaseColumnCollection): boolean;

    /**
     * 셀렉터 검사 결과 얻기
     * @param cmd command 명칭들
     * @param isLog 기본값 true
     * @param collection 지정된 컬렉션에서 검사한다.
     * @example
     * var bm = new BindModelAjax();
     * ...
     * bm.validSelector();           // 전체 셀렉터 목록 리턴
     * bm.validSelector([], true);   // 전체 셀렉터 목록 리턴 및 로그 출력
     * bm.validSelector('list');     // 지정한 단일 command 셀렉터 검사
     * bm.validSelector(['list', 'read'], true);         // 지정한 복수 command 셀렉터 검사
     * bm.validSelector([], true, secondCollection);     // 검사 대상 컬렉션 변경 (this.items)
     */
    validSelector(cmd: string | string[], isLog: true, collection: BaseColumnCollection): object | undefined;

    /**
     * 명령 추가
     * @param name 
     * @param option 
     * @param baseTable 기본엔테티
     */
    addCommand(name: string, option: number, baseTable: MetaTable): BindCommand;

    /**
     * 서비스를 설정한다.
     * @param service 서비스객체
     * @param isRead 서비스 내의 prop 를 item 으로 로딩힌다. (기본값: true)
     */
    setService(service: IServiceAjax, isRead: boolean);

}

export = BindModelAjax;