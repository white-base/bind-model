import {MetaElement}            from 'logic-entity';
import {MetaColumn}             from 'logic-entity';
import {MetaTable}              from 'logic-entity';
import {MetaView}               from 'logic-entity';
import {MetaViewCollection}     from 'logic-entity';
import BaseBindModel            from './base-bind-model';

/**
* An abstract class that defines a binding command.
* This class manages the execution of bind commands and related actions.
* @abstract
*/
declare abstract class BaseBindCommand extends MetaElement {

    /**
    * The creator of the bind command.
    *
    * @param {BaseBindModel} BaseBindModel - Bind Model object.
    * @param {MetaTable} baseTable - Default table object.
    */
    constructor(BaseBindModel: BaseBindModel, baseTable: MetaTable);

    /**
     * Collection that stores output results.
     */
    _outputs: MetaViewCollection;

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
    outputOptions: object; 

    /**
     * The callback function that is called at the start of execution. 
     * 
     * @param {BaseBindcommand} cmd - current bind command object.
     */
    cbBegin: (cmd: BaseBindCommand) => void;

    /**
     * Callback function called before valid.
     * 
     * @param {MetaView} valid - object 'MetaView' to be examined.
     * @param {BaseBindcommand} cmd - current bind command object.
     * @returns {boolean} A boolean value indicating the result of the examination.
     */
    cbValid: (valid: MetaView, cmd: BaseBindCommand) => boolean;

    /**
     * Callback function called before bind.
     * 
     * @param {MetaView} bind - object 'MetaView' to be transmitted.
     * @param {BaseBindcommand} cmd - current bind command object.
     * @param {object} setup - setting object.
     */
    cbBind: (bind: MetaView, cmd: BaseBindCommand, setup: object) => void;

    /**
     * A callback function that handles binding results.
     * It is mainly used for processing result data.
     * 
     * @param {object} data - Bind result data.
     * @param {BaseBindcommand} cmd - current bind command object.
     * @param {object} response - response object.
     * @returns Processed result data.
     */
    cbResult: (data: object, cmd: BaseBindCommand, response: object) => object;

    /**
     * A callback function that outputs binding results.
     * It is mainly used for the output of lists.
     * 
     * @param {MetaViewCollection} views - Output view collection. (_outputs)
     * @param {BaseBindcommand} cmd - current bind command object.
     * @param {object} response - response object.
     */
    cbOutput:  (views: MetaViewCollection, cmd: BaseBindCommand, response: object) => void;

    /**
     *  Callback function called after execution is complete. 
     * 
     * @param {object} status - Status information.
     * @param {BaseBindcommand} cmd - current bind command object.
     * @param {object} response - response object.
     */
    cbEnd: (status: object, cmd: BaseBindCommand, response: object) => void;

    /**
     * Event listener called before the execution of the bind command.
     * 
     * @param {BaseBindcommand} cmd - current bind command object.
     */
    _onExecute(cmd: BaseBindCommand): void;

    /**
     * Event listener called after execution of the bind command.
     * 
     * @param {BaseBindcommand} cmd - current bind command object.
     * @param {object} result - Execution result data.
     */
    _onExecuted(cmd: BaseBindCommand, result: object): void;

    /**
     * Run the bind command.
     * Order of execution : valid >> bind >> result >> output >> end
     * @abstract
     */
    abstract execute(): void;

    /**
     * Adds a column and maps it to the specified view.
     * 
     * @param {string | MetaColumn} column - This column object is to be registered. It could be a string or 'MetaColumn' object.
     * @param {string | string[]} views - The name of the view entity to be added; it can be a string or an array of strings.
     * @param {string | MetaTable} [bTable] - (Optional) Default table object or table name to be mapped.
     */
    addColumn(column: string | MetaColumn, views: string | string[], bTable: string | MetaTable): void;

    /**
     * Add columns and values and map them to the specified view.
     * 
     * @param {string} name - The name of the column.
     * @param {any} value - column value.
     * @param {string | string[]} [views] - (Optional) Name of the view entity to be added.
     * @param {string | MetaTable} [bTable] - (Optional) Default table object or table name to be mapped.
     */
    addColumnValue(name: string, value: any, views?: string | string[], bTable?: string | MetaTable): void;

    /**
     * Set the column.
     * 
     * @param {string | string[]} name - column name or array of names.
     * @param {string | string[]} views - An array of view names or names to set.
     * 
     * @example
     * e.read.setColumn(['idx', 'addr'], 'valid');
     */
    setColumn(name: string | string[], views: string | string[]): void;

    /**
     * Release the column from the target entity.
     * 
     * @param {string | string[]} name - The column name or array of names to release.
     * @param {string | string[]} views - The name or array of view entities to be disabled.
     */
    release(name: string | string[], views: string | string[]): void;

    /**
     * Adds a view entity to use for the output.
     * The default name is 'output' + _outputs.count.
     * 
     * @param {string} [name] - (Optional) The name of the view to be referenced additionally.
     */
    newOutput(name?: string): void;

    /**
     * Delete the output view.
     * 
     * @param {string} name - Name of the view to delete.
     * @returns {boolean} A boolean value indicating successful deletion.
     */
    removeOutput(name: string): boolean;
}

export = BaseBindCommand;