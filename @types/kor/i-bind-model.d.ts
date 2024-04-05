import PropertyCollection   = require("logic-core/collection-property");
import BindModel            = require("./bind-model");

/**
 * 객체 통제 인터페이스 입니다.
 * @interface
 */
declare interface IBindModel {

    /**
     * items
     */
    items: PropertyCollection;

    /**
     * 바인드모델 함수 (내부함수 + 노출함수)
     */
    fn: PropertyCollection;

    /**
     *  바인딩 command 
     */
    command: PropertyCollection;

    /**
     *  초기화시 등록 preRegister
     */
    preRegister: (model: BindModel)=>void;

    /**
     * 초기화시 검사 preCheck
     */
    preCheck: (model: BindModel)=>boolean;

    /**
     * 초기화시 준비 완료 preReady
     */
    preReady: (model: BindModel)=>void;


}

export = IBindModel;