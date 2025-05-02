import type { PropertyCollection }      from 'logic-entity';
import type { BaseColumnCollection }    from 'logic-entity';
import type { MetaTable }               from 'logic-entity';
import type { BaseBindModel }           from './base-bind-model.d.ts';
import type { IServiceAjax }            from './i-service-ajax.d.ts';
import type { BaseBindCommand }         from './base-bind-command.d.ts';
import type { HTMLColumn }              from './html-column.d.ts';
import type { OutputOption }                from './T.js';

/**
* Bind Model Ajax Class  
* This class inherits BaseBindModel and provides additional functionality for Ajax communication.  
*/
type BindModel = {

    /**
     * Set the binding default config.
     */
    baseConfig: object; // TODO: Type isolation

    /**
     * Set the binding default config.url.
     * 
     * @example
     * const bm = new BindModel(service);
     * bm.url = '/user';
     */
    url: string;

    /**
     * Examine the selector.
     * 
     * @param collection - Collection of columns to be inspected.
     * @returns A boolean value indicating the result of the examination.
     */
    checkSelector(collection: BaseColumnCollection<HTMLColumn>): boolean;

    /**
     * Obtain a list of destination selectors.
     * 
     * @param collection - This is the collection of properties to examine. The default is items.
     * @returns Object array representing the selector list.
     */
    getSelector(collection?: PropertyCollection<HTMLColumn>): object[];

    /**
     * Add a command.
     * 
     * @param name - Command name.
     * @param option - Output option.
     * @param baseTable - (Optional) Default table object.
     * @returns Added bind command object.
     */
    addCommand(name: string, option: OutputOption, baseTable?: MetaTable): BaseBindCommand;

    /**
     * Examine the DOM and add 'selector' to the column of the specified type.
     * 
     * @param name Column name
     * @param selector selector indicator
     * @param cmds Item command to add, [] Full command selected when entered
     * @param views View entity to add
     * @param bTable Default Table
     */
    addSelector(name: string, selector: string | object, cmds?: string | string[], views?: string | string[], bTable?: string | MetaTable): void;

    /**
     * Set up the service.
     * 
     * @param service - service object.
     * @param isRead - A boolean value that indicates whether prop within the service should be loaded as item.
     */
    setService(service: IServiceAjax, isRead?: boolean): void;

} & BaseBindModel;

export interface BindModelConstructor {
    /**
     * This is the creator of 'BindModel'.
     * 
     * @param service - Object providing Ajax service.
     */
    new (service?: IServiceAjax): BindModel;
}

declare const BindModel: BindModelConstructor;


export default BindModel;
export { BindModel };