import {MetaColumn}                 from 'logic-entity';
import {MetaTable}                  from 'logic-entity';
import {MetaView}                   from 'logic-entity';
import {MetaTableCollection}        from 'logic-entity';
import {PropertyCollection}         from 'logic-entity';
import {MetaTableColumnCollection}  from 'logic-entity';
import {MetaViewCollection}         from 'logic-entity';
import Basebind                     from './base-bind';
import IServiceAjax                 from './i-service-ajax';
import BaseBindCommand              from './base-bind-command';

/**
* Bind Model Abstract Class
* This class provides a framework for data binding, command execution, and event management.
*
* @abstract
*/
declare abstract class BaseBindModel extends Basebind {

    /**
     * This is a meta table collection.
     * Manage multiple meta tables.
     */
    _tables: MetaTableCollection;

    /**
     * A collection of mapping properties.
     */
    _mapping: PropertyCollection;

    /**
     * Sets the column type.
     */
    _columnType: MetaColumn;

    /**
     * It's an item collection.
     */
    items: PropertyCollection;

    /**
     * A collection of bound model functions. (Internal function + Exposure function)
     */
    fn: PropertyCollection;

    /**
     * A collection of binding commands.
     */
    command: PropertyCollection;

    /**
     * Alias for command.
     */
    cmd: PropertyCollection;

    /**
     * Collection of columns.
     * Indicates the column of the _baseTable.
     */
    columns: MetaTableColumnCollection;

    /**
     * This is the first dynamically generated meta table.
     */
    first: MetaTable;

    /**
     * Callback function called upon failure by valid.
     * 
     * @param {object} result - object containing the results of the examination.
     * @param {MetaColumn} column - object 'MetaColumn' used in the examination.
     */
    cbFail: (result: object, column: MetaColumn) => void;

    /**
     * The callback function that is called in the event of an error.
     * 
     * @param{string} msg - Error message.
     * @param {object} status - Object containing status information.
     * @param {object} response - response object.
     */    
    cbError: (msg: string, status: object, response: object) => void;

    /**
     * Default callback function called at the start of execution (used when cbBegin callback function is not present)
     * 
     * @param {BaseBindcommand} command - The current bound command object.
     */
    cbBaseBegin: (command: BaseBindCommand) => void;

    /**
     * Default callback function called before valid (used without cbValid callback function)
     * 
     * @param {MetaView} valid - object 'MetaView' to be examined.
     * @param {BaseBindcommand} command - The current bound command object.
     * @returns {boolean} A boolean value indicating the result of the examination.
     */
    cbBaseValid: (valid: MetaView, command: BaseBindCommand) => boolean;

    /**
     *  Default callback function called before bind (used when cbBind callback function is not present)
     * 
     * @param {MetaView} bind - object 'MetaView' to bind.
     * @param {BaseBindcommand} command - The current bound command object.
     * @param {object} config - setting object.
     */
    cbBaseBind: (bind: MetaView, command: BaseBindCommand, config: object) => void;

    /**
     * Callback function that handles binding results (used in the absence of the cbResult callback function)
     * 
     * @param {object} data - Bind result data object.
     * @param {BaseBindcommand} command - The current bound command object.
     * @param {object} response - response object.
     * @returns {object} Returns the processed result object.
     */
    cbBaseResult: (data: object, command: BaseBindCommand, response: object) => object;

    /**
     * Default callback function to output bind results (used when cbOutput callback function is not present)
     * 
     * @param {MetaViewCollection} outputs - Metabiew Collection.
     * @param {BaseBindcommand} command - The current bound command object.
     * @param {object} response - response object.
     * @returns {object} Returns the processed result object.
     */
    cbBaseOutput: (outputs: MetaViewCollection, command: BaseBindCommand, response: object) => object;

    /**
     * Default callback function called after completion of execution (used when cbEnd callback function is not present)
     * 
     * @param {object} status - Object containing status information.
     * @param {BaseBindcommand} command - The current bound command object.
     * @param {object} response - response object.
     */
    cbBaseEnd: (status: object, command: BaseBindCommand, response: object) => void;

    /**
     * The callback function that is initially called upon init() call.
     * 
     * @param {BaseBindModel} model - The current bound model object.
     */
    preRegister: (model: BaseBindModel) => void;

    /**
     * Callback function that returns boolean on init() call.
     * 
     * @param {BaseBindModel} model - The current bound model object.
     * @returns {boolean} A boolean value indicating the result of the examination.
     */
    preCheck: (model: BaseBindModel)=>boolean;

    /**
     * Callback function called when preCheck callback function result is true when invoking init().
     * 
     * @param {BaseBindModel} model - The current bound model object.
     */
    preReady: (model: BaseBindModel) => void;

    /**
     * Register (load) the property to the _baseTable or the specified MetaTable.
     * 
     * @param {string | string[]} [items] - The name of the item to read. It can be string or string array.
     * @param {MetaTable} [baseEntity] - Default table object. (Optional)
     */
    _readItem(items?: string | string[], baseEntity?: MetaTable): void;

    /**
     * Obtain the current object as a guide type object.
     * (Circular references are replaced by $ref values.)
     * 
     * @param {number} [vOpt=0] - is the import option. Default is 0.
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

    /**
     * Performs the initialization operation.
     * Internally, call 'preRegister()' -> 'preCheck()' -> 'preReady()'.
     */
    init(): void;

    /**
     * Register the table.
     * 
     * @param {string} name - The name of the table to register.
     * @returns {MetaTable} Returns a registered meta table object.
     */
    addTable(name: string): MetaTable;

    /**
     * Add columns and map them to commands.
     * 
     * @param {string | MetaColumn} column - This column object is to be registered. It could be a string or 'MetaColumn' object.
     * @param {string | string[]} [cmds] - (Optional) Command that specifies the location of the view. It can be a string or string array.
     * @param {string | string[]} [views] - (Optional) The name of the view entity to be added. It can be a string or an array of strings.
     * @param {string | MetaTable} [bTable] - (Optional) Default table object or table name to be mapped.
     */
    addColumn(column: MetaColumn, cmds?: string | string[], views?: string | string[], bTable?: string | MetaTable): void;

    /**
     * Add columns and values, add them to the specified table, and register the reference to the column in BaseBindcommand's valid, bind, and output MetaView.
     * 
     * @param{string} name - The name of the column.
     * @param{any} value - column value.
     * @param {string | string[]} [cmds] - This command specifies the location of the view. It can be a string or an array of strings.
     * @param {string | string[]} [views] - The name of the view entity to be added. It can be a string or an array of strings.
     * @param {string | MetaTable} [bTable] - (Optional) Default table object or table name to be mapped.
     */
    addColumnValue(name: string, value: any, cmds?: string | string[], views?: string | string[], bTable?: string | MetaTable): void;

    /**
     * Map columns.
     * 
     * @param {PropertyCollection | object} mapping - an object or collection to map to MetaColumn
     * @param {string | MetaTable} [baseTable] - (Optional) Default table object or table name to map.
     */
    setMapping(mapping: PropertyCollection | object, baseTable?: string | MetaTable): void;

    /**
     * Add command (abstract class) must be inherited and implemented.
     * 
     * @param {string} name - The name of the command to be added.
     * @param {number} option - Output option for the command.
     * @param {string | MetaTable} [baseTable] - Default table.
     */
    abstract addCommand(name: string, option: number, baseTable?: string | MetaTable): void;

    /**
     * Set up the service.
     * 
     * @param {IServiceAjax} service - service object.
     * @param {booklan} [passTypeChk=false] - Whether or not the service object type inspection has passed. (Default: false)
     */
    setService(service: IServiceAjax, passTypeChk: boolean): void;

}

export = BaseBindModel;