import IBindModel       = require("./i-bind-model");
import IModelCallback   = require("./i-model-callback");

/**
 * 객체 통제 인터페이스 입니다.
 * @interface
 */
declare interface IService extends IBindModel, IModelCallback {

    tables: object;

    mapping: object;
}

export = IService;