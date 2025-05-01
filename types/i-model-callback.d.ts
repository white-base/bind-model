// import type { MetaView }        from 'logic-entity';
// import type { MetaColumn }      from 'logic-entity';

/**
 * Object control interface.
 * 
 * @interface
 */
declare interface IModelCallback {

/**
     * Callback when failed in valid
     */
cbFail: (result: object, column: object) => void; // TODO: _this is all models and down..

/**
 * Callback in case of an error in valid
 */
cbError: (msg: string, status: object, response: object) => void; // TODO: _this 검토 필요

    /**
 * Default callback function called at the start of execution (used when cbBegin callback function is not present)
 * 
 * @paramc ommand - current bind command object
 */
cbBaseBegin: (command: object) => void;

/**
 * Default callback function called before valid (used without cbValid callback function)
 * 
 * @param valid - 'MetaView' object to be examined
 * @param command - current bind command object
 * @returns A boolean value indicating the test result.
 */
cbBaseValid: (valid: object, command: object) => boolean;

/**
 *  Default callback function called before bind (used when cbBind callback function is not present)
 * 
 * @param bind - 'MetaView' object to bind
 * @param command - current bind command object
 * @param config - setting object.
 */
cbBaseBind: (bind: object, command: object, config: object) => void;

/**
 * Callback function that handles binding results (used in the absence of the cbResult callback function)
 * 
 * @param data - Bind result data object
 * @param command - current bind command object
 * @param response - response object
 * @returns Returns the processed result object.
 */
cbBaseResult: (data: object, command: object, response: object) => object;

/**
 * Default callback function to output bind results (used when cbOutput callback function is not present)
 * 
 * @param outputs - Metabiew Collection
 * @param command - current bind command object
 * @param response - response object
 * @returns Returns the processed result object.
 */
cbBaseOutput: (outputs: object, command: object, response: object) => void;

/**
 * Default callback function called after completion of execution (used when cbEnd callback function is not present)
 * 
 * @param status - Objects containing status information
 * @param command - current bind command object
 * @param response - response object
 */
cbBaseEnd: (status: object, command: object, response: object) => void;

}

export default IModelCallback;
export { IModelCallback };