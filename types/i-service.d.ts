import type { IBaseBindModel }      from './i-bind-model.d.ts';
import type { IModelCallback }      from './i-model-callback.d.ts';

/**
* Object control interface.
* @interface
*/
declare interface IService extends IBaseBindModel, IModelCallback {

    tables: object;

    mapping: object;
}

export default IService;
export { IService };