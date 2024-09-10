import IBaseBindModel       from './i-bind-model';
import IModelCallback       from './i-model-callback';

/**
* Object control interface.
* @interface
*/
declare interface IService extends IBaseBindModel, IModelCallback {

    tables: object;

    mapping: object;
}

export = IService;