import MetaTable            = require("logic-entity/meta-table");
import MetaObject           = require("./bind-command");
import BindModel            = require("./bind-model");

/**
 *  바인드 명령 Ajax 
 */
declare class BindCommandAjax extends MetaObject {

    /**
     *  바인드 명령 Ajax 
     * @param bindModel 
     * @param outputOpt 
     * @param baseTable 
     */
    constructor(bindModel: BindModel, outputOpt: object, baseTable: MetaTable);

    /**
     * config 설정값 (jquery의 config 과 동일)
     */
    config: object;  // TODO: 타입 추출

    /**
     * config.url 의 값에 설정한다.
     */
    url: string;

    /**
     * valid.columns.. 검사한다.
     */
    _execValid();

    /**
     * Ajax 바인딩 구현
     */
    _execBind();

    /**
     * 실행 성공
     * @param result 
     * @param status 
     * @param xhr 
     */
    _execSuccess(result: object, status: object, xhr: object);

    /**
     * AJAX 를 기준으로 구성함 (requst는 맞춤)
     *  error(xhr,status,error)
     * @param xhr 
     * @param status 
     * @param error 
     */
    _execError(xhr: object, status: object, error: object);

    /**
     * (WEB & NodeJs 의 어뎁터 패턴)
     *  node 에서는 비동기만 반영함 (테스트 용도) =>> 필요시 개발함
     * @param setup 설정
     */
    _ajaxAdapter(setup: object);

    /**
     * 실행 
     */
    execute();

}

export = BindCommandAjax;