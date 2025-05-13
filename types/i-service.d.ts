import type { IBindModel }      from './i-bind-model.d.ts';
import type { IModelCallback }      from './i-model-callback.d.ts';

/**
* Object control interface.
*/
declare interface IService extends IBindModel, IModelCallback {

    tables: object;

    mapping: object;
}

export default IService;
export { IService };