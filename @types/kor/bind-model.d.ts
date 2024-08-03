import MetaColumn           = require("logic-entity/meta-column");
import MetaTable            = require("logic-entity/meta-table");
import MetaView             = require("logic-entity/meta-view");
import MetaTableCollection  = require("logic-entity/collection-meta-table");
import PropertyCollection   = require("logic-core/collection-property");
import Basebind             = require("./base-bind");
import MetaViewCollection   = require("logic-entity/collection-meta-view");
import IServiceAjax         = require("./i-service-ajax");
import BindCommand          = require("./bind-command");

/**
 * 바인드모델 추상클래스
 * 이 클래스는 데이터 바인딩, 명령 실행 및 이벤트 관리를 위한 기본 구조를 제공합니다.
 * @abstract
 */
declare abstract class BindModel extends Basebind {

    /**
     * 메타 테이블 컬렉션입니다.
     * 여러 메타 테이블을 관리합니다.
     */
    _tables: MetaTableCollection;

    /**
     * 매핑 속성 컬렉션입니다.
     */
    _mapping: PropertyCollection;

    /**
     * 아이템 타입을 설정합니다.
     */
    _columnType: MetaColumn;

    /**
     * 아이템 컬렉션입니다.
     */
    items: PropertyCollection;

    /**
     * 바인드모델 함수 컬렉션입니다. (내부함수 + 노출함수)
     */
    fn: PropertyCollection;

    /**
     * 바인딩 명령 컬렉션입니다.
     */
    command: PropertyCollection;

    /**
     * 바인딩 명령의 별칭 컬렉션입니다.
     */
    cmd: PropertyCollection;

    /**
     * 컬럼 컬렉션입니다.
     * _baseTable의 컬럼을 나타냅니다.
     */
    columns: PropertyCollection;

    /**
     * valid 에서 실패시 호출되는 콜백입니다.
     * @param {object} result - 결과 객체
     * @param {MetaColumn} column - 메타 컬럼
     */
    cbFail: (result: object, column: MetaColumn) => void;

    /**
     * 오류발생시 호출되는 콜백입니다.
     * @param {string} msg - 오류 메시지
     * @param {object} status - 상태 객체
     * @param {object} response - 응답 객체
     */    
    cbError: (msg: string, status: object, response: object) => void; // TODO: _this 검토 필요

    /**
     * 시작전 기본 콜백 (cbBegin 콜백함수가 없을 경우)
     * @param {BindCommand} command - 바인드 명령 객체
     */
    cbBaseBegin: (command: BindCommand) => void;

    /**
     * 검사(valid)시 기본 콜백 (cbValid 콜백함수가 없을 경우)
     * @param {MetaView} valid - 메타 뷰 객체
     * @param {BindCommand} command - 바인드 명령 객체
     * @returns {boolean} 검사 결과
     */
    cbBaseValid: (valid: MetaView, command: BindCommand) => boolean;

    /**
     * 바인드(valid)시 기본 콜백 (cbBind 콜백함수가 없을 경우)
     * @param {MetaView} bind - 메타 뷰 객체
     * @param {BindCommand} command - 바인드 명령 객체
     * @param {object} config - 설정 객체
     */
    cbBaseBind: (bind: MetaView, command: BindCommand, config: object) => void;

    /**
     * 바인드 결과 수신 기본 콜백 (cbResult 콜백함수가 없을 경우)
     * @param {object} data - 데이터 객체
     * @param {BindCommand} command - 바인드 명령 객체
     * @param {object} response - 응답 객체
     * @returns {object} 처리된 결과 객체
     */
    cbBaseResult: (data: object, command: BindCommand, response: object) => object;

    /**
     * 출력 기본 콜백 (cbOutput 콜백함수가 없을 경우)
     * @param {MetaViewCollection} outputs - 메타 뷰 컬렉션
     * @param {BindCommand} command - 바인드 명령 객체
     * @param {object} response - 응답 객체
     * @returns {object} 처리된 결과 객체
     */
    cbBaseOutput: (outputs: MetaViewCollection, command: BindCommand, response: object) => object;

    /**
     * 실행 완료시 기본 콜백 (cbEnd 콜백함수가 없을 경우)
     * @param {object} status - 상태 객체
     * @param {BindCommand} command - 바인드 명령 객체
     * @param {object} response - 응답 객체
     */
    cbBaseEnd: (status: object, command: BindCommand, response: object) => void;

    /**
     * 초기화시 등록 preRegister
     * @param {BindModel} model - 바인드 모델 객체
     */
    preRegister: (model: BindModel) => void;

    /**
     * 초기화시 검사 preCheck
     * @param {BindModel} model - 바인드 모델 객체
     * @returns {boolean} 검사 결과
     */
    preCheck: (model: BindModel)=>boolean;

    /**
     * 초기화시 준비 완료 preReady
     * @param {BindModel} model - 바인드 모델 객체
     */
    preReady: (model: BindModel) => void;

    /**
     * 속성을 _baseTable 또는 지정 MetaTable 에 등록(로딩)합니다.
     * @param {string | string[]} [items] - 읽을 아이템
     * @param {MetaTable} [baseEntity] - 기본 테이블
     */
    _readItem(items?: string | string[], baseEntity?: MetaTable): void;

    /**
     * 현재 객체를 직렬화(guid 타입) 객체로 얻습니다.
     * (순환참조는 $ref 값으로 대체됩니다.)
     * @param {number} [vOpt=0] 가져오기 옵션
     * - opt=0 : 참조 구조(_guid:Yes, $ref:Yes)
     * - opt=1 : 중복 구조(_guid:Yes, $ref:Yes)
     * - opt=2 : 비참조 구조(_guid:No, $ref:No)
     * @param {object | Array<object>} [owned={}] 현재 객체를 소유하는 상위 객체들
     * @returns {object} 직렬화된 객체
     * @example
     * a.getObject(2) == b.getObject(2)
     */
    getObject(vOpt?: number, owned?: object | Array<object>): object;

    /**
     * 직렬화(guid 타입) 객체를 현재 객체에 설정합니다.
     * (객체는 초기화 됩니다.)
     * @param {object} oGuid 직렬화 할 guid 타입의 객체
     * @param {object} [origin=oGuid] 현재 객체를 설정하는 원본 객체
     */
    setObject(oGuid: object, origin?: object): void;

    /**
     * 초기화
     * 내부적으로 preRegister() -> preCheck() -> preReady() 순서로 실행됩니다.
     */
    init(): void;

    /**
     * 테이블을 등록합니다.
     * @param {string} name - 테이블 이름
     * @returns {MetaTable} 등록된 메타 테이블
     */
    addTable(name: string): MetaTable;

    /**
     * 아이템을 추가하고 명령과 매핑합니다.
     * @param {MetaColumn} column - 등록할 아이템
     * @param {string | string[]} [cmds] - 추가할 아이템 명령
     * @param {string | string[]} [views] - 추가할 뷰 엔티티
     * @param {string | MetaTable} [bTable] 매핑할 기본 테이블
     */
    addColumn(column: MetaColumn, cmds?: string | string[], views?: string | string[], bTable?: string | MetaTable): void;

    /**
     * 컬럼과 값을 추가하고 지정된 테이블에 추가하며, 컬럼의 참조를 BindCommand의 valid, bind, output MetaView에 등록합니다.
     * @param {string} name - 컬럼 이름
     * @param {any} value - 컬럼 값
     * @param {string | string[]} cmds - 명령 목록
     * @param {string | string[]} [views] - 추가할 뷰 엔티티
     * @param {string | MetaTable} [bTable] 매핑할 기본 테이블
     */
    addColumnValue(name: string, value: any, cmds: string | string[], views?: string | string[], bTable?: string | MetaTable): void;

    /**
     * 아이템을 매핑합니다.
     * @param {PropertyCollection | object} mapping - MetaColumn에 매핑할 객체 또는 컬렉션
     * @param {string | MetaTable} baseTable - 대상 기본 엔티티
     */
    setMapping(mapping: PropertyCollection | object, baseTable?: string | MetaTable): void;

    /**
     * 명령을 추가합니다. (추상클래스) 상속하여 구현해야 합니다.
     * @param {string} name - 명령 이름
     * @param {number} option - 옵션
     * @param {string | MetaTable} [baseTable] - 기본 테이블
     */
    abstract addCommand(name: string, option: number, baseTable?: string | MetaTable): void;

    /**
     * 서비스를 설정합니다.
     * @param {IServiceAjax} service - 서비스 객체
     * @param {boolean} isRead - 서비스 내의 prop를 item으로 로딩합니다. (기본값: true)
     */
    setService(service: IServiceAjax, isRead: boolean): void;

}

export = BindModel;