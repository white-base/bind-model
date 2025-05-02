// import type { MetaObject }          from 'logic-entity';
import type { EventEmitter }        from 'logic-entity';
import type { MetaTable }           from 'logic-entity';
import type { BaseBindCommand }     from './base-bind-command.d.ts';
import type { IBind }               from './i-bind.d.ts';
import type { MetaObjectType }      from "./T.d.ts";

/**
 * The 'BaseBind' class provides basic binding functions and is an extension of the 'MetaObject'.  
 * This class handles events before and after executing commands, and provides serialization and deserialization.  
 * @abstract
 */
type BaseBind = {

    /**
     * Event object.  
     * Processes the issuance and reception of events.  
     */
    $event: EventEmitter;

    /**
     * This is the collection reservation word.  
     * Defines the reserved words that you use by default.  
     */
    $KEYWORD: string[];

    /**
     * Defines the default entity.   
     * This entity represents a meta table.  
     */
    _baseTable: MetaTable;

    /**
     * An event that is called before the command is executed.
     * 
     * @event
     * @param cmd - command object to be executed.
     */
    onExecute: (cmd: BaseBindCommand) => void;

    /**
     * An event that is called after the command is executed.
     * 
     * @event
     * @param cmd - Command object executed.
     * @param result - The result object of the command execution.
     */
    onExecuted: (cmd: BaseBindCommand, result: object) => void;

    /**
     * Event listener before command execution.
     * 
     * @param cmd - command object to be executed.
     * @listens BaseBind#onExecute
     */
    _onExecute(cmd: BaseBindCommand): void;

    /**
     * Event listener after command execution.
     * 
     * @param cmd - Command object executed.
     * @param result - The result object of the command execution.
     * @listens BaseBind#onExecuted
     */
    _onExecuted(cmd: BaseBindCommand, result: object): void;

    /**
     * Method of obtaining the current object as a guide type object.  
     * (Circular references are replaced by $ref values.)  
     * 
     * @param mode - Import option.  
     * - opt=0: Reference structure (_guid: Yes, $ref: Yes)  
     * - opt=1: Redundant structure (_guid: Yes, $ref: Yes)  
     * - opt=2: Non-steep structure (_guid: No, $ref: No)  
     * @param context - Parent objects that currently own the object.
     * 
     * @example
     * a.getObject(2) == b.getObject(2)
     */
    getObject(mode?: number, context?: object | object[]): object;

    /**
     * Sets the Guid type object to the current object.  
     * (The object is reset.)  
     * 
     * @param guidObj - Object of the guid type to serialize.
     * @param guidRootObj - The source object setting the current object.
     */
    setObject(guidObj: object, guidRootObj?: object): void;

    /**
     * Adds a column to the meta table.
     * 
     * @abstract
     * @param args - properties of the column to be added.
     */
    addColumn(...args: any[]): void;
    
} & MetaObjectType & IBind;

export interface BaseBindConstructor {
    new (): BaseBind;
}

declare const BaseBind: BaseBindConstructor;

export default BaseBind;
export { BaseBind };