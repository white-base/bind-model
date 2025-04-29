import type { PropertyCollection }      from 'logic-entity/ko';
import type { HTMLColumn }              from './html-column.d.ts';
import type { BindCommand }             from './bind-command.d.ts';

/**
 * 객체 통제 인터페이스 입니다.
 * 
 * @interface
 */
declare interface IBindModel {

    /**
     * items
     */
    items: PropertyCollection<HTMLColumn>;

    /**
     * 바인드모델 함수 (내부함수 + 노출함수)
     */
    fn: PropertyCollection<Function>;

    /**
     *  바인딩 command 
     */
    command: PropertyCollection<BindCommand>;

    /**
     *  초기화시 등록 preRegister
     */
    preRegister: (model: IBindModel) => void;

    /**
     * 초기화시 검사 preCheck
     */
    preCheck: (model: IBindModel) => boolean;

    /**
     * 초기화시 준비 완료 preReady
     */
    preReady: (model: IBindModel) => void;

}

export default IBindModel;
export { IBindModel };