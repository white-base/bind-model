import {PropertyCollection}     from 'logic-core';
import BaseBindModel            from './base-bind-model';

/**
 * Object control interface.
 * @interface
 */
declare interface IBaseBindModel {

    /**
     * items
     */
    items: PropertyCollection;

    /**
     * Bind model function (internal function + exposure function)
     */
    fn: PropertyCollection;

    /**
     *  Binding command 
     */
    command: PropertyCollection;

    /**
     *  Register at initialization
     */
    preRegister: (model: BaseBindModel)=>void;

    /**
     * Inspection preCheck at Initialization
     */
    preCheck: (model: BaseBindModel)=>boolean;

    /**
     * Ready ready to initialize
     */
    preReady: (model: BaseBindModel)=>void;

}

export = IBaseBindModel;