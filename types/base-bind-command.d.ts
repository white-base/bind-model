import type { MetaColumn }           from 'logic-entity';
import type { MetaTable }            from 'logic-entity';
import type { MetaView }             from 'logic-entity';
import type { MetaViewCollection}    from 'logic-entity';
import type { BaseBind }            from './base-bind.d.ts';
import type { BaseBindModel }       from './base-bind-model.d.ts';
import type { IBindCommand }        from './i-bind-command.js';
import type { ICommandCallback }    from './i-command-callback.js';
import type { OutputOption }        from './T.js';

/**
* An abstract class that defines a binding command.  
* This class manages the execution of bind commands and related actions.  
* 
* @abstract
*/
type BaseBindCommand = {

    /**
     * Collection that stores output results.
     */
    _outputs: MetaViewCollection<MetaView>;

    /**
     * 
     */
    _model: BaseBindModel;

    /**
     * MetaView object to be examined.
     */
    valid: MetaView;

    /**
     * Bind target MetaView object.
     */
    bind: MetaView;

    /**
     * Dynamic added output MetaView object.
     */
    output: MetaView;

    /**
     * Output attribute options.
     * - 0: Except
     * - 1: Import rows of all columns
     * - 2: Import only rows of existing columns
     * - 3: Import only the row of existing curums, set value
     */
    outputOptions: OutputOption; 

    /**
     * Output attribute options.
     * - 0: Except
     * - 1: Import rows of all columns
     * - 2: Import only rows of existing columns
     * - 3: Import only the row of existing curums, set value
     */
    outOpt: OutputOption;
    /**
     * The callback function that is called at the start of execution. 
     * 
     * @param cmd - current bind command object.
     */
    cbBegin: (cmd: BaseBindCommand) => void;

    /**
     * Callback function called before valid.
     * 
     * @param valid - object 'MetaView' to be examined.
     * @param cmd - current bind command object.
     * @returns A boolean value indicating the result of the examination.
     */
    cbValid: (valid: MetaView, cmd: BaseBindCommand) => boolean;

    /**
     * Callback function called before bind.
     * 
     * @param bind - object 'MetaView' to be transmitted.
     * @param cmd - current bind command object.
     * @param setup - setting object.
     */
    cbBind: (bind: MetaView, cmd: BaseBindCommand, setup: object) => void;

    /**
     * A callback function that handles binding results.
     * It is mainly used for processing result data.
     * 
     * @param data - Bind result data.
     * @param cmd - current bind command object.
     * @param {object} response - response object.
     * @returns Processed result data.
     */
    cbResult: (data: object, cmd: BaseBindCommand, response: object) => object;

    /**
     * A callback function that outputs binding results.
     * It is mainly used for the output of lists.
     * 
     * @param views - Output view collection. (_outputs)
     * @param cmd - current bind command object.
     * @param response - response object.
     */
    cbOutput:  (views: MetaViewCollection, cmd: BaseBindCommand, response: object) => void;

    /**
     *  Callback function called after execution is complete. 
     * 
     * @param status - Status information.
     * @param cmd - current bind command object.
     * @param response - response object.
     */
    cbEnd: (status: object, cmd: BaseBindCommand, response: object) => void;

    /**
     * Event listener called before the execution of the bind command.
     * 
     * @param cmd - current bind command object.
     */
    _onExecute(cmd: BaseBindCommand): void;

    /**
     * Event listener called after execution of the bind command.
     * 
     * @param cmd - current bind command object.
     * @param result - Execution result data.
     */
    _onExecuted(cmd: BaseBindCommand, result: object): void;

    /**
     * Run the bind command.
     * Order of execution : valid >> bind >> result >> output >> end
     * @abstract
     */
    execute(): void;

    /**
     * Adds a column and maps it to the specified view.
     * 
     * @param column - This column object is to be registered. It could be a string or 'MetaColumn' object.
     * @param views - The name of the view entity to be added; it can be a string or an array of strings.
     * @param bTable - (Optional) Default table object or table name to be mapped.
     * @returns Added column
     */
    addColumn(column: string | MetaColumn, views: string | string[], bTable?: string | MetaTable): MetaColumn;

    /**
     * Add columns and values and map them to the specified view.
     * 
     * @param name - The name of the column.
     * @param value - column value.
     * @param views - (Optional) Name of the view entity to be added.
     * @param bTable - (Optional) Default table object or table name to be mapped.
     * @returns Added column
     */
    addColumnValue(name: string, value: any, views?: string | string[], bTable?: string | MetaTable): MetaColumn;

    /**
     * Set the column.
     * 
     * @param name - column name or array of names.
     * @param views - An array of view names or names to set.
     * 
     * @example
     * e.read.setColumn(['idx', 'addr'], 'valid');
     */
    setColumn(name: string | string[], views: string | string[]): void;

    /**
     * Release the column from the target entity.
     * 
     * @param name - The column name or array of names to release.
     * @param views - The name or array of view entities to be disabled.
     */
    release(name: string | string[], views: string | string[]): void;

    /**
     * Adds a view entity to use for the output.
     * The default name is 'output' + _outputs.count.
     * 
     * @param name - (Optional) The name of the view to be referenced additionally.
     * @returns Added MetaView
     */
    newOutput(name?: string): MetaView;

    /**
     * Delete the output view.
     * 
     * @param name - Name of the view to delete.
     * @returns A boolean value indicating successful deletion.
     */
    removeOutput(name: string): boolean;

} & {
    [key: string]: MetaView;
} & BaseBind & IBindCommand & ICommandCallback;

export interface BaseBindCommandConstructor {
    /**
    * The creator of the bind command.
    *
    * @param BaseBindModel - Bind Model object.
    * @param baseTable - Default table object.
    */
    new (BaseBindModel: BaseBindModel, baseTable: MetaTable): BaseBindCommand;
}

declare const BaseBindCommand: BaseBindCommandConstructor;

export default BaseBindCommand;
export { BaseBindCommand };