import BindModel           = require("./bind-model");
import IServiceAjax         = require("./i-service-ajax");
import BaseColumnCollection = require("logic-entity/base-column-collection");
import MetaTable            = require("logic-entity/meta-table");
import BindCommand          = require("./bind-command");

/**
 * 바인드모델 Ajax 클래스
 * 이 클래스는 BindModel을 상속하며, Ajax 통신을 위한 기능을 추가로 제공합니다.
 */
declare class BindModelAjax extends BindModel {

    /**
     * 바인드모델 Ajax 생성자
     * @param {IServiceAjax} service - Ajax 서비스를 제공하는 객체
     */
    constructor(service: IServiceAjax);

    /**
     * 바인딩 기본 config을 설정합니다.
     */
    baseConfig: object;  // TODO: 타입 분리

    /**
     * 바인딩 기본 config.url을 설정합니다.
     * @example
     * const bm = new BindModelAjax(service);
     * bm.url = '/user';
     */
    url: string;

    /**
     * 동적으로 생성된 첫 번째 메타 테이블입니다.
     */
    first: MetaTable;

    /**
     * 셀렉터를 검사합니다.
     * @param {BaseColumnCollection} collection - 컬럼 컬렉션
     * @returns {boolean} 검사 결과
     */
    checkSelector(collection: BaseColumnCollection): boolean;

    /**
     * 셀렉터 검사 결과를 얻습니다.
     * @param {string | string[]} cmd - 검사할 command 명칭들
     * @param {boolean} [isLog=true] - 로그 출력 여부
     * @param {BaseColumnCollection} [collection] - 지정된 컬렉션에서 검사합니다. 기본값은 this.items입니다.
     * @returns {object[]} 검사 결과 객체, 성공시 length == 0
     * @example
     * var bm = new BindModelAjax();
     * ...
     * bm.validSelector();           // 전체 셀렉터 목록 리턴
     * bm.validSelector([], true);   // 전체 셀렉터 목록 리턴 및 로그 출력
     * bm.validSelector('list');     // 지정한 단일 command 셀렉터 검사
     * bm.validSelector(['list', 'read'], true);         // 지정한 복수 command 셀렉터 검사
     * bm.validSelector([], true, secondCollection);     // 검사 대상 컬렉션 변경 (this.items)
     */
    validSelector(cmd: string | string[], isLog: true, collection: BaseColumnCollection): object[];

    /**
     * 명령을 추가합니다.
     * @param {string} name - 명령 이름
     * @param {number} option - 명령 옵션
     * @param {MetaTable} [baseTable] - 기본 테이블
     * @returns {BindCommand} 추가된 바인드 명령 객체
     */
    addCommand(name: string, option: number, baseTable: MetaTable): BindCommand;

    /**
     * 서비스를 설정합니다.
     * @param {IServiceAjax} service - 서비스 객체
     * @param {boolean} [isRead=true] - 서비스 내의 prop를 item으로 로딩합니다.
     */
    setService(service: IServiceAjax, isRead: boolean): void;

}

export = BindModelAjax;