import type { PropertyCollection }       from 'logic-entity';
import type { BaseBindModel }            from './base-bind-model.d.ts';
import type { HTMLColumn }               from './html-column.d.ts';
import type { BindCommand }              from './bind-command.d.ts';

/**
 * Object control interface.
 * 
 * @interface
 */
declare interface IBindModel {

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
    preRegister: (model: IBindModel) => void;

    /**
     * Inspection preCheck at Initialization
     */
    preCheck: (model: IBindModel) => boolean;

    /**
     * Ready ready to initialize
     */
    preReady: (model: IBindModel) => void;

}

export default IBindModel;
export { IBindModel };