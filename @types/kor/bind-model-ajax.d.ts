import PropertyCollection   = require("logic-core/collection-property");
import BaseColumnCollection = require("logic-entity/base-column-collection");
import MetaTable            = require("logic-entity/meta-table");
import BindModel            = require("./bind-model");
import IServiceAjax         = require("./i-service-ajax");
import BindCommand          = require("./bind-command");

/**
 * 바인드모델 Ajax 클래스
 * 이 클래스는 BindModel을 상속하며, Ajax 통신을 위한 기능을 추가로 제공합니다.
 */
declare class BindModelAjax extends BindModel {

    /**
     * `BindModelAjax` 생성자입니다.
     * 
     * @param {IServiceAjax} service - Ajax 서비스를 제공하는 객체입니다.
     */
    constructor(service: IServiceAjax);

    /**
     * 바인딩 기본 config을 설정합니다.
     */
    baseConfig: object;  // TODO: 타입 분리

    /**
     * 바인딩 기본 config.url을 설정합니다.
     * 
     * @example
     * const bm = new BindModelAjax(service);
     * bm.url = '/user';
     */
    url: string;

    /**
     * 셀렉터를 검사합니다.
     * 
     * @param {BaseColumnCollection} collection - 검사할 컬럼 컬렉션입니다.
     * @returns {boolean} 검사 결과를 나타내는 boolean 값입니다.
     */
    checkSelector(collection: BaseColumnCollection): boolean;

    /**
     * 셀렉터 검사 결과를 얻습니다.
     * 
     * @param {string | string[]} cmd - 검사할 command 명칭입니다. 문자열 또는 문자열 배열일 수 있습니다.
     * @param {boolean} [isLog=true] - 로그 출력 여부를 나타내는 boolean 값입니다.
     * @param {BaseColumnCollection} [collection] - 지정된 컬렉션에서 검사합니다. 기본값은 `this.items`입니다.
     * @returns {object[]} 검사 결과를 나타내는 객체 배열입니다. 성공 시 배열의 길이는 0입니다.
     * 
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
     * 대상 셀렐터 목록을 얻습니다.
     * 
     * @param {PropertyCollection} [collection=this.items] - 검사할 속성 컬렉션입니다.
     * @returns {object[]} 셀렉터 목록을 나타내는 객체 배열입니다.
     */
    getSelector(collection: PropertyCollection): object[];

    /**
     * 명령을 추가합니다.
     * 
     * @param {string} name - 명령 이름입니다.
     * @param {number} option - 명령 옵션입니다.
     * @param {MetaTable} [baseTable] - (선택적) 기본 테이블 객체입니다.
     * @returns {BindCommand} 추가된 바인드 명령 객체입니다.
     */
    addCommand(name: string, option: number, baseTable: MetaTable): BindCommand;

    /**
     * 서비스를 설정합니다.
     * 
     * @param {IServiceAjax} service - 서비스 객체입니다.
     * @param {boolean} [isRead=true] - 서비스 내의 prop를 item으로 로딩할지 여부를 나타내는 boolean 값입니다.
     */
    setService(service: IServiceAjax, isRead: boolean): void;

}

export = BindModelAjax;