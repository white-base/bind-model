import type { IService }    from './i-service.d.ts';

/**
 * Object control interface.
 * 
 * @interface
 */
declare interface IServiceAjax extends IService {

    /**
     * Set the binding default config.
     */
    baseConfig: object; // TODO: Type isolation

    /**
     *  Set the binding default config.url.
     */
    url: string;
}

export default IServiceAjax;
export { IServiceAjax };