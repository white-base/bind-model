import type { IService }    from './i-service.d.ts';

/**
 * 객체 통제 인터페이스 입니다.
 */
declare interface IServiceAjax extends IService {

    baseConfig: object;  // TODO: 타입 분리

    url: string;

}

export default IServiceAjax;
export { IServiceAjax };
