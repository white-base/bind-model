import {MetaTable}          from 'logic-entity';
import {MetaObject}         from 'logic-entity';
import BaseBindModel        from './base-bind-model';

/**
* Classes that implement bind commands through AJAX.
* The class handles data communication with the server and executes binding commands in the AJAX manner.
*/
declare class BindCommand extends MetaObject {

    /**
     * Creates a bind command AJAX object.
     * 
     * @param {BaseBindModel} BaseBindModel - Bind Model object.
     * @param {object} outputOpt - Output option setting.
     * @param {MetaTable} baseTable - Default table object.
     */
    constructor(BaseBindModel: BaseBindModel, outputOpt: object, baseTable: MetaTable);

     /**
     * This is the setting for the AJAX request.
     * Same format as 'config' in axios.
     */
    config: object; // TODO: Type extraction

    /**
     * Sets the URL for the AJAX request.
     */
    url: string;

    /**
     * Perform a validation. 
     * The column to be examined is set through the 'valid.column' property.
     */
    _execValid(): boolean;

    /**
     * Implement AJAX bindings.
     * Establish data communication with the server and process requests.
     * 
     * @returns {Promise<void>} Object 'Promise' indicating completion of asynchronous operation.
     */
    _execBind(): Promise<void>;

    /**
     * Called if the AJAX request is successfully completed.
     * 
     * @param {object} result - result data received from the server.
     * @param {object} status - Request status.
     * @param {object} xhr - 'XMLHttpRequest' object.
     */
    _ajaxSuccess(result: object, status: object, xhr: object): void;

    /**
     * Called if the AJAX request fails.
     * 
     * @param {object} xhr - 'XMLHttpRequest' object.
     * @param {object} status - Request status.
     * @param {object} error - Error information.
     */
    _execError(xhr: object, status: object, error: object): void;

    /**
     * Implement the AJAX adapter pattern.
     * Used in web and Node.js environments.
     * 
     * @param {object} setup - 'axios' setting object.
     * @returns {Promise<object>} 'Promise' object representing the result of the call.
     * 
     */
    _ajaxCall(setup: object): Promise<void>;;

    /**
     * Run the bind command.
     * Performs the entire execution process, including validation, binding, result processing, success, and error callback.
     * 
     * @Returns {Promise<void>} Object 'Promise' representing the execution result.
     */
    execute(): Promise<void>;

    /**
     * Obtain the current object as a guide type object.
     * (Circular references are replaced by $ref values.)
     * 
     * @param{number} [vOpt=0] - is the import option. Default is 0.
     * - opt=0: Reference structure (_guid: Yes, $ref: Yes)
     * - opt=1: Redundant structure (_guid: Yes, $ref: Yes)
     * - opt=2: Non-tidal structure (_guid: No, $ref: No)
     * @param {object | Array<object>} [own={}] - Parent objects that currently own the object.
     * @returns {object} Returns serialized objects.
     * 
     * @example
     * a.getObject(2) == b.getObject(2)
     */
    getObject(vOpt?: number, owned?: object | Array<object>): object;

    /**
     * Sets the Guid type object to the current object.
     * (The object will be reset.)
     * 
     * @param {object} oGuid - Object of the guid type to serialize.
     * @param {object} [origin=oGuid] - The source object setting the current object. (Optional)
     */
    setObject(oGuid: object, origin?: object): void;

}

export = BindCommand;