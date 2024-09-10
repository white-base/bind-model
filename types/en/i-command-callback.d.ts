import {MetaView}               from 'logic-entity';
import BaseBindCommand          from './base-bind-command';

/**
 * Object control interface.
 * @interface
 */
declare interface ICommandCallback {

    /**
     * Callback before valid
     */
    cbValid: (valid: MetaView)=>boolean;

    /**
     * Pre-bind callback
     */
    cbBind: (cmd: BaseBindCommand, setup: object, _this: this)=>void;

    /**
     * Bind result callback (Main: Processing of reply data)
     */
    cbResult: (cmd: BaseBindCommand, result: object)=>object;

    /**
     * Bind Results Output Callback (Main: Output of List)
     */
    cbOutput:  (cmd: BaseBindCommand, result: object)=>void;

    /**
     * Callback after bind process ends (major: association with other events or commands)
     */
    cbEnd: (cmd: BaseBindCommand, result: object, status: object, xhr: object)=>void;

}

export = ICommandCallback;