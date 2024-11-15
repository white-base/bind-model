import {MetaColumn}                 from 'logic-entity';
import {MetaTable}                  from 'logic-entity';
import {MetaView}                   from 'logic-entity';
import {MetaTableCollection}        from 'logic-entity';
import {PropertyCollection}         from 'logic-entity';
import {MetaTableColumnCollection}  from 'logic-entity';
import {MetaViewCollection}         from 'logic-entity';
import Basebind                     from './base-bind';
import IServiceAjax                 from './i-service-ajax';
import BaseBindCommand              from './base-bind-command';

/**
 * 바인드모델 추상클래스
 * 이 클래스는 데이터 바인딩, 명령 실행 및 이벤트 관리를 위한 기본 구조를 제공합니다.
 * 
 * @abstract
 */
declare abstract class BaseBindModel extends Basebind {

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
     * 컬럼 타입을 설정합니다.
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
     * command 의 별칭입니다.
     */
    cmd: PropertyCollection;

    /**
     * 컬럼 컬렉션입니다.
     * _baseTable의 컬럼을 나타냅니다.
     */
    columns: MetaTableColumnCollection;

    /**
     * 동적으로 생성된 첫 번째 메타 테이블입니다.
     */
    first: MetaTable;


    /**
     * 검사(valid)에서 실패 시 호출되는 콜백 함수입니다.
     * 
     * @param {object} result - 검사 결과를 담은 객체입니다.
     * @param {MetaColumn} column - 검사에 사용된 `MetaColumn` 객체입니다.
     */
    cbFail: (result: object, column: MetaColumn) => void;

    /**
     * 오류 발생 시 호출되는 콜백 함수입니다.
     * 
     * @param {string} msg - 오류 메시지입니다.
     * @param {object} status - 상태 정보를 담은 객체입니다.
     * @param {object} response - 응답 객체입니다.
     */    
    cbError: (msg: string, status: object, response: object) => void; // TODO: _this 검토 필요

    /**
     * 실행 시작 시 호출되는 기본 콜백 함수입니다. (cbBegin 콜백 함수가 없을 경우 사용됨)
     * 
     * @param {BaseBindCommand} command - 현재 바인드 명령 객체입니다.
     */
    cbBaseBegin: (command: BaseBindCommand) => void;

    /**
     * 검사(valid) 전 호출되는 기본 콜백 함수입니다. (cbValid 콜백 함수가 없을 경우 사용됨)
     * 
     * @param {MetaView} valid - 검사할 `MetaView` 객체입니다.
     * @param {BaseBindCommand} command - 현재 바인드 명령 객체입니다.
     * @returns {boolean} 검사 결과를 나타내는 boolean 값입니다.
     */
    cbBaseValid: (valid: MetaView, command: BaseBindCommand) => boolean;

    /**
     *  바인드(bind) 전 호출되는 기본 콜백 함수입니다. (cbBind 콜백 함수가 없을 경우 사용됨)
     * 
     * @param {MetaView} bind - 바인드할 `MetaView` 객체입니다.
     * @param {BaseBindCommand} command - 현재 바인드 명령 객체입니다.
     * @param {object} config - 설정 객체입니다.
     */
    cbBaseBind: (bind: MetaView, command: BaseBindCommand, config: object) => void;

    /**
     * 바인드 결과를 처리하는 콜백 함수입니다. (cbResult 콜백 함수가 없을 경우 사용됨)
     * 
     * @param {object} data - 바인드 결과 데이터 객체입니다.
     * @param {BaseBindCommand} command - 현재 바인드 명령 객체입니다.
     * @param {object} response - 응답 객체입니다.
     * @returns {object} 처리된 결과 객체를 반환합니다.
     */
    cbBaseResult: (data: object, command: BaseBindCommand, response: object) => object;

    /**
     * 바인드 결과를 출력하는 기본 콜백 함수입니다. (cbOutput 콜백 함수가 없을 경우 사용됨)
     * 
     * @param {MetaViewCollection} outputs - 메타 뷰 컬렉션입니다.
     * @param {BaseBindCommand} command - 현재 바인드 명령 객체입니다.
     * @param {object} response - 응답 객체입니다.
     * @returns {object} 처리된 결과 객체를 반환합니다.
     */
    cbBaseOutput: (outputs: MetaViewCollection, command: BaseBindCommand, response: object) => object;

    /**
     * 실행 완료 후 호출되는 기본 콜백 함수입니다. (cbEnd 콜백 함수가 없을 경우 사용됨)
     * 
     * @param {object} status - 상태 정보를 담은 객체입니다.
     * @param {BaseBindCommand} command - 현재 바인드 명령 객체입니다.
     * @param {object} response - 응답 객체입니다.
     */
    cbBaseEnd: (status: object, command: BaseBindCommand, response: object) => void;

    /**
     * init() 호출시 처음에 호출되는 콜백 함수입니다.
     * 
     * @param {BaseBindModel} model - 현재 바인드 모델 객체입니다.
     */
    preRegister: (model: BaseBindModel) => void;

    /**
     * init() 호출시 boolean 을 리턴하는 콜백 함수입니다.
     * 
     * @param {BaseBindModel} model - 현재 바인드 모델 객체입니다.
     * @returns {boolean} 검사 결과를 나타내는 boolean 값입니다.
     */
    preCheck: (model: BaseBindModel)=>boolean;

    /**
     * init() 호출시 preCheck 콜백 함수 결과가 true 일때 호출되는 콜백 함수입니다.
     * 
     * @param {BaseBindModel} model - 현재 바인드 모델 객체입니다.
     */
    preReady: (model: BaseBindModel) => void;

    /**
     * 속성을 _baseTable 또는 지정 MetaTable 에 등록(로딩)합니다.
     * 
     * @param {string | string[]} [items] - 읽을 아이템의 이름입니다. 문자열 또는 문자열 배열일 수 있습니다.
     * @param {MetaTable} [baseEntity] - 기본 테이블 객체입니다. (선택적)
     */
    _readItem(items?: string | string[], baseEntity?: MetaTable): void;

    /**
     * 현재 객체를 직렬화(guid 타입) 객체로 얻습니다.
     * (순환참조는 $ref 값으로 대체됩니다.)
     * 
     * @param {number} [vOpt=0] - 가 가져오기 옵션입니다. 기본값은 0 입니다.
     * - opt=0 : 참조 구조(_guid:Yes, $ref:Yes)
     * - opt=1 : 중복 구조(_guid:Yes, $ref:Yes)
     * - opt=2 : 비참조 구조(_guid:No, $ref:No)
     * @param {object | Array<object>} [owned={}] - 현재 객체를 소유하는 상위 객체들입니다.
     * @returns {object} 직렬화된 객체를 반환합니다.
     * 
     * @example
     * a.getObject(2) == b.getObject(2)
     */
    getObject(vOpt?: number, owned?: object | Array<object>): object;

    /**
     * 직렬화(guid 타입) 객체를 현재 객체에 설정합니다.
     * (객체는 초기화 됩니다.)
     * 
     * @param {object} oGuid - 직렬화할 guid 타입의 객체입니다.
     * @param {object} [origin=oGuid] - 현재 객체를 설정하는 원본 객체입니다. (선택적)
     */
    setObject(oGuid: object, origin?: object): void;

    /**
     * 초기화 작업을 수행합니다.
     * 내부적으로 `preRegister()` -> `preCheck()` -> `preReady()` 순서로 호출합니다.
     */
    init(): void;

    /**
     * 테이블을 등록합니다.
     * 
     * @param {string} name - 등록할 테이블의 이름입니다.
     * @returns {MetaTable} 등록된 메타 테이블 객체를 반환합니다.
     */
    addTable(name: string): MetaTable;

    /**
     * 컬럼을 추가하고 명령과 매핑합니다.
     * 
     * @param {string | MetaColumn} column -  등록할 컬럼 객체입니다. 문자열 또는 `MetaColumn` 객체일 수 있습니다.
     * @param {string | string[]} [cmds] - (선택적) 뷰의 위치를 지정하는 명령입니다. 문자열 또는 문자열 배열일 수 있습니다.
     * @param {string | string[]} [views] - (선택적) 추가할 뷰 엔티티 이름입니다. 문자열 또는 문자열 배열일 수 있습니다.
     * @param {string | MetaTable} [bTable] - (선택적) 매핑할 기본 테이블 객체 또는 테이블 이름입니다.
     */
    addColumn(column: MetaColumn, cmds?: string | string[], views?: string | string[], bTable?: string | MetaTable): void;

    /**
     * 컬럼과 값을 추가하고 지정된 테이블에 추가하며, 컬럼의 참조를 BaseBindCommand의 valid, bind, output MetaView에 등록합니다.
     * 
     * @param {string} name - 컬럼 이름입니다.
     * @param {any} value - 컬럼 값입니다.
     * @param {string | string[]} [cmds] - 뷰의 위치를 지정하는 명령입니다. 문자열 또는 문자열 배열일 수 있습니다.
     * @param {string | string[]} [views] - 추가할 뷰 엔티티 이름입니다. 문자열 또는 문자열 배열일 수 있습니다.
     * @param {string | MetaTable} [bTable] - (선택적) 매핑할 기본 테이블 객체 또는 테이블 이름입니다.
     */
    addColumnValue(name: string, value: any, cmds?: string | string[], views?: string | string[], bTable?: string | MetaTable): void;

    /**
     * 컬럼을 매핑합니다.
     * 
     * @param {PropertyCollection | object} mapping - MetaColumn에 매핑할 객체 또는 컬렉션
     * @param {string | MetaTable} [baseTable] - (선택적) 매핑할 기본 테이블 객체 또는 테이블 이름입니다.
     */
    setMapping(mapping: PropertyCollection | object, baseTable?: string | MetaTable): void;

    /**
     * 명령을 추가합니다. (추상클래스) 상속하여 구현해야 합니다.
     * 
     * @param {string} name - 추가할 명령의 이름입니다.
     * @param {number} option - 명령의 출력옵션입니다.
     * @param {string | MetaTable} [baseTable] - 기본 테이블입니다.
     */
    abstract addCommand(name: string, option: number, baseTable?: string | MetaTable): void;

    /**
     * 서비스를 설정합니다.
     * 
     * @param {IServiceAjax} service - 서비스 객체입니다.
     * @param {boolean} [passTypeChk=false] - 서비스객체 type 검사 통과 유무입니다. (기본값: false)
     */
    setService(service: IServiceAjax, passTypeChk: boolean): void;

}

export = BaseBindModel;