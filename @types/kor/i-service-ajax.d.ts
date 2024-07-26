import IService = require("./i-service");

/**
 * 객체 통제 인터페이스 입니다.
 * @interface
 */
declare interface IServiceAjax extends IService {

/**
     * 바인딩 기본 config 을 설정한다.
     */
    baseConfig: object;  // TODO: 타입 분리

    /**
     *  바인딩 기본 config.url 을 설정한다.
     */
    url: string;

}

export = IServiceAjax;
