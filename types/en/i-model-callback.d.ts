import {MetaView}             from 'logic-entity';
import {MetaColumn}           from 'logic-entity';

/**
 * Object control interface.
 * @interface
 */
declare interface IModelCallback {

    /**
     * Callback when failed in valid
     */
    cbFail: (_this: any, result: object, column: MetaColumn)=>void;

    /**
     * Callback in case of an error in valid
     */
    cbError: (_this: any, msg: string, status: object)=>void;

    /**
     * Default callback at valid (without cbValid callback function)
     */
    cbBaseValid: (_this: any, valid: MetaView)=>boolean;

    /**
     * Default callback at valid (without cbBind callback function)
     */
    cbBaseBind: (_this: any, setup: object)=>void;

    /**
     * Default callback to receive bind results (without cbResult callback function)
     */
    cbBaseResult: (_this: any, result: object)=>object;

    /**
     * Output default callback (without cbOutput callback function)
     */
    cbBaseOutput: (_this: any, result: object)=>void;

    /**
     * Default callback at execution completion (without cbEnd callback function)
     */
    cbBaseEnd: (_this: any, msg: string, status: object, xhr: object)=>void;

}

export = IModelCallback;