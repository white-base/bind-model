import {PropertyCollection}     from 'logic-core';
import BaseBindModel            from './base-bind-model';

/**
 * 객체 통제 인터페이스 입니다.
 * @interface
 */
declare interface IBaseBindModel {

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
    preRegister: (model: BaseBindModel)=>void;

    /**
     * 초기화시 검사 preCheck
     */
    preCheck: (model: BaseBindModel)=>boolean;

    /**
     * 초기화시 준비 완료 preReady
     */
    preReady: (model: BaseBindModel)=>void;


}

export = IBaseBindModel;