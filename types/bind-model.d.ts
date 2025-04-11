import type { PropertyCollection }      from 'logic-entity';
import type { BaseColumnCollection }    from 'logic-entity';
import type { MetaTable }               from 'logic-entity';
import type { BaseBindModel }           from './base-bind-model.d.ts';
import type { IServiceAjax }            from './i-service-ajax.d.ts';
import type { BaseBindCommand }         from './base-bind-command.d.ts';
import type { HTMLColumn }              from './html-column.d.ts';
/**
* Bind Model Ajax Class
* This class inherits BaseBindModel and provides additional functionality for Ajax communication.
*/
declare class BindModel extends BaseBindModel {

    /**
     * This is the creator of 'BindModel'.
     * 
     * @param {IServiceAjax} service - Object providing Ajax service.
     */
    constructor(service: IServiceAjax);

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
     * @param {BaseColumnCollection} collection - Collection of columns to be inspected.
     * @returns {boolean} A boolean value indicating the result of the examination.
     */
    checkSelector(collection: BaseColumnCollection<HTMLColumn>): boolean;

    /**
     * Obtain a list of destination selectors.
     * 
     * @param {PropertyCollection} [collection=items] - This is the collection of properties to examine. The default is items.
     * @returns {object[]} Object array representing the selector list.
     */
    getSelector(collection: PropertyCollection<HTMLColumn>): object[];

    /**
     * Add a command.
     * 
     * @param {string} name - Command name.
     * @param {number} option - Output option.
     * @param {MetaTable} [baseTable] - (Optional) Default table object.
     * @returns {BaseBindcommand} Added bind command object.
     */
    addCommand(name: string, option: number, baseTable: MetaTable): BaseBindCommand;

    /**
     * Set up the service.
     * 
     * @param {IServiceAjax} service - service object.
     * @param {booklan} [isRead=true] - A boolean value that indicates whether prop within the service should be loaded as item.
     */
    setService(service: IServiceAjax, isRead: boolean): void;

}

export default BindModel;
export { BindModel };