import IService     from './i-service';

/**
 * Object control interface.
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

export = IServiceAjax;