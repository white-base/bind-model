import type { MetaTable }            from 'logic-entity';
import type { BaseBindCommand }     from './base-bind-command.d.ts';
import type { BaseBindModel }        from './base-bind-model.d.ts';
import type { OutputOption }        from './T.js';

/**
* Classes that implement bind commands through AJAX.  
* The class handles data communication with the server and executes binding commands in the AJAX manner.  
*
* @class
*/
type BindCommand = {

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
     * @returns Object 'Promise' indicating completion of asynchronous operation.
     */
    _execBind(): Promise<void>;

    /**
     * Called if the AJAX request is successfully completed.
     * 
     * @param result - result data received from the server.
     * @param status - Request status.
     * @param xhr - 'XMLHttpRequest' object.
     */
    _ajaxSuccess(result: object, status: object, xhr: object): void;

    /**
     * Called if the AJAX request fails.
     * 
     * @param xhr - 'XMLHttpRequest' object.
     * @param status - Request status.
     * @param error - Error information.
     */
    _execError(xhr: object, status: object, error: object): void;

    /**
     * Implement the AJAX adapter pattern.  
     * Used in web and Node.js environments.  
     * 
     * @param setup - 'axios' setting object.
     * @returns 'Promise' object representing the result of the call.
     * 
     */
    _ajaxCall(setup: object): Promise<void>;

    /**
     * Run the bind command.  
     * Performs the entire execution process, including validation, binding, result processing, success, and error callback.  
     * 
     * @param outputOption - Output option setting: 0: Exclusion, 1: Import only rows of existing columns, value setting, 2: Import all columns, 3: Import only rows of existing columns
     * @param config axios settings object or url
     * @Returns Object 'Promise' representing the execution result.
     */
    execute(outputOption?: OutputOption, config?: object | string): Promise<void>;

    /**
     * Run the bind command.  
     * Performs the entire execution process, including validation, binding, result processing, success, and error callback.  
     * 
     * @param outputOption - Output option setting: 0: Exclusion, 1: Import only rows of existing columns, value setting, 2: Import all columns, 3: Import only rows of existing columns
     * @param config axios settings object or url
     * @Returns Object 'Promise' representing the execution result.
     */
    exec(outputOption?: OutputOption, config?: object | string): Promise<void>;

    /**
     * Obtain the current object as a guide type object.  
     * (Circular references are replaced by $ref values.)  
     * 
     * @param mode - is the import option. Default is 0.
     * - opt=0: Reference structure (_guid: Yes, $ref: Yes)
     * - opt=1: Redundant structure (_guid: Yes, $ref: Yes)
     * - opt=2: Non-tidal structure (_guid: No, $ref: No)
     * @param context - Parent objects that currently own the object.
     * @returns Returns serialized objects.
     * 
     * @example
     * a.getObject(2) == b.getObject(2)
     */
    getObject(mode?: number, context?: object | object[]): object;

    /**
     * Sets the Guid type object to the current object.  
     * (The object will be reset.)  
     * 
     * @param guidObj - Object of the guid type to serialize.
     * @param guidRootObj - The source object setting the current object. (Optional)
     */
    setObject(guidObj: object, guidRootObj?: object): void;

} & BaseBindCommand;

export interface BindCommandConstructor {
    /**
     * Creates a bind command AJAX object.
     * 
     * @param BaseBindModel - Bind Model object.
     * @param outputOpt - Output option setting.
     * @param baseTable - Default table object.
     */
    new (BaseBindModel: BaseBindModel, outputOpt: OutputOption, baseTable: MetaTable): BindCommand;
}

declare const BindCommand: BindCommandConstructor;

export default BindCommand;
export { BindCommand };