import type { IBindModel }      from './i-bind-model.d.ts';
import type { IModelCallback }  from './i-model-callback.d.ts';

/**
 * 객체 통제 인터페이스 입니다.
 */
declare interface IService extends IBindModel, IModelCallback {

    tables: object;

    mapping: object;
}

export default IService;
export { IService };