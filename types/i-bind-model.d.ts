import type { PropertyCollection }       from 'logic-entity';
import type { BaseBindModel }            from './base-bind-model.d.ts';
import type { HTMLColumn }               from './html-column.d.ts';
import type { BindCommand }              from './bind-command.d.ts';

/**
 * Object control interface.
 */
declare interface IBindModel {

    items: PropertyCollection<HTMLColumn>;

    fn: PropertyCollection<Function>;

    command: PropertyCollection<BindCommand>;

    preRegister: (model: IBindModel) => void;

    preCheck: (model: IBindModel) => boolean;

    preReady: (model: IBindModel) => void;

}

export default IBindModel;
export { IBindModel };