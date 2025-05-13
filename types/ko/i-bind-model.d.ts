import type { PropertyCollection }      from 'logic-entity/ko';
import type { HTMLColumn }              from './html-column.d.ts';
import type { BindCommand }             from './bind-command.d.ts';

/**
 * 객체 통제 인터페이스 입니다.
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