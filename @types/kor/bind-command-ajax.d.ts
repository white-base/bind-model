import MetaTable            = require("logic-entity/meta-table");
import MetaObject           = require("./bind-command");
import BindModel            = require("./bind-model");

/**
 * 바인드 명령을 AJAX를 통해 구현하는 클래스입니다.
 * 이 클래스는 서버와의 데이터 통신을 처리하고, 바인드 명령을 AJAX 방식으로 실행합니다.
 */
declare class BindCommandAjax extends MetaObject {

    /**
     * 바인드 명령 AJAX 객체를 생성합니다.
     * @param {BindModel} bindModel - 바인드 모델 객체입니다.
     * @param {object} outputOpt - 출력 옵션 설정입니다.
     * @param {MetaTable} baseTable - 기본 테이블 객체입니다.
     */
    constructor(bindModel: BindModel, outputOpt: object, baseTable: MetaTable);

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
     * @returns {Promise<void>} 비동기 작업의 완료를 나타내는 `Promise` 객체입니다.
     */
    _execBind(): Promise<void>;

    /**
     * AJAX 요청이 성공적으로 완료된 경우 호출됩니다.
     * @param {object} result - 서버로부터 받은 결과 데이터입니다.
     * @param {object} status - 요청 상태입니다.
     * @param {object} xhr - `XMLHttpRequest` 객체입니다.
     */
    _ajaxSuccess(result: object, status: object, xhr: object): void;

    /**
     * AJAX 요청이 실패한 경우 호출됩니다.
     * @param {object} xhr - `XMLHttpRequest` 객체입니다.
     * @param {object} status - 요청 상태입니다.
     * @param {object} error - 오류 정보입니다.
     */
    _execError(xhr: object, status: object, error: object): void;

    /**
     * AJAX 어댑터 패턴을 구현합니다.
     * 웹 및 Node.js 환경에서 사용됩니다.
     * @param {object} setup - `axios` 설정 객체입니다.
     * @returns {Promise<object>} `axios` 호출 결과를 나타내는 `Promise` 객체입니다.
     * 
     */
    _ajaxCall(setup: object): Promise<void>;;

    /**
     * 바인드 명령을 실행합니다.
     * 유효성 검사, 바인딩, 결과 처리, 성공 및 오류 콜백을 포함한 전체 실행 프로세스를 수행합니다.
     * @returns {Promise<void>} 실행 결과를 나타내는 `Promise` 객체입니다.
     */
    execute(): Promise<void>;

}

export = BindCommandAjax;