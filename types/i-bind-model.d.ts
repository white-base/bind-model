import type { PropertyCollection }       from 'logic-entity';
import type { BaseBindModel }            from './base-bind-model.d.ts';
import type { HTMLColumn }               from './html-column.d.ts';
import type { BindCommand }              from './bind-command.d.ts';

/**
 * Object control interface.
 * 
 * @interface
 */
declare interface IBaseBindModel {

    /**
     * items
     */
    items: PropertyCollection<HTMLColumn>;

    /**
     * Bind model function (internal function + exposure function)
     */
    fn: PropertyCollection<Function>;

    /**
     *  Binding command 
     */
    command: PropertyCollection<BindCommand>;

    /**
     *  Register at initialization
     */
    preRegister: (model: BaseBindModel)=>void;

    /**
     * Inspection preCheck at Initialization
     */
    preCheck: (model: BaseBindModel)=>boolean;

    /**
     * Ready ready to initialize
     */
    preReady: (model: BaseBindModel)=>void;

}

export default IBaseBindModel;
export { IBaseBindModel };