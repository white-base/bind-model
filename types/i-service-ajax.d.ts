import type { IService }    from './i-service.d.ts';

/**
 * Object control interface.
 */
declare interface IServiceAjax extends IService {

    baseConfig: object; // TODO: Type isolation

    url: string;
}

export default IServiceAjax;
export { IServiceAjax };