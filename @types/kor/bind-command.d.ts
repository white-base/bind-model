import MetaTable            = require("logic-entity/meta-table");
import MetaObject           = require("./base-bind-command");
import BaseBindModel            = require("./base-bind-model");

/**
 * 바인드 명령을 AJAX를 통해 구현하는 클래스입니다.
 * 이 클래스는 서버와의 데이터 통신을 처리하고, 바인드 명령을 AJAX 방식으로 실행합니다.
 */
declare class BindCommand extends MetaObject {

    /**
     * 바인드 명령 AJAX 객체를 생성합니다.
     * 
     * @param {BaseBindModel} BaseBindModel - 바인드 모델 객체입니다.
     * @param {object} outputOpt - 출력 옵션 설정입니다.
     * @param {MetaTable} baseTable - 기본 테이블 객체입니다.
     */
    constructor(BaseBindModel: BaseBindModel, outputOpt: object, baseTable: MetaTable);

     /**
     * AJAX 요청에 대한 설정값입니다.
     * axios 의 `config`와 동일한 형식입니다.
     */
    config: object;  // TODO: 타입 추출

    /**
     * AJAX 요청의 URL을 설정합니다.
     */
    url: string;

    /**
     * 유효성 검사를 수행합니다. 
     * 검사할 컬럼은 `valid.columns` 속성을 통해 설정됩니다.
     */
    _execValid(): boolean;

    /**
     * AJAX 바인딩을 구현합니다.
     * 서버와의 데이터 통신을 설정하고 요청을 처리합니다.
     * 
     * @returns {Promise<void>} 비동기 작업의 완료를 나타내는 `Promise` 객체입니다.
     */
    _execBind(): Promise<void>;

    /**
     * AJAX 요청이 성공적으로 완료된 경우 호출됩니다.
     * 
     * @param {object} result - 서버로부터 받은 결과 데이터입니다.
     * @param {object} status - 요청 상태입니다.
     * @param {object} xhr - `XMLHttpRequest` 객체입니다.
     */
    _ajaxSuccess(result: object, status: object, xhr: object): void;

    /**
     * AJAX 요청이 실패한 경우 호출됩니다.
     * 
     * @param {object} xhr - `XMLHttpRequest` 객체입니다.
     * @param {object} status - 요청 상태입니다.
     * @param {object} error - 오류 정보입니다.
     */
    _execError(xhr: object, status: object, error: object): void;

    /**
     * AJAX 어댑터 패턴을 구현합니다.
     * 웹 및 Node.js 환경에서 사용됩니다.
     * 
     * @param {object} setup - `axios` 설정 객체입니다.
     * @returns {Promise<object>} `axios` 호출 결과를 나타내는 `Promise` 객체입니다.
     * 
     */
    _ajaxCall(setup: object): Promise<void>;;

    /**
     * 바인드 명령을 실행합니다.
     * 유효성 검사, 바인딩, 결과 처리, 성공 및 오류 콜백을 포함한 전체 실행 프로세스를 수행합니다.
     * 
     * @returns {Promise<void>} 실행 결과를 나타내는 `Promise` 객체입니다.
     */
    execute(): Promise<void>;

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

}

export = BindCommand;