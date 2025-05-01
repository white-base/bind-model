import type { MetaView }            from 'logic-entity';
import type { BaseBindCommand }     from './base-bind-command.d.ts';

/**
 * Object control interface.
 * 
 * @interface
 */
declare interface ICommandCallback {

    /**
     * Callback before valid
     */
    cbValid: (valid: object, cmd: object) => boolean;

    /**
     * Pre-bind callback
     */
    cbBind: (bind: object, cmd: object, setup: object) => void;   // TODO: 맨뒤 this

    /**
     * Bind result callback (Main: Processing of reply data)
     */
    cbResult: (data: object, cmd: object, result: object) => object;

    /**
     * Bind Results Output Callback (Main: Output of List)
     */
    cbOutput: (views: object, cmd: object, result: object) => void;

    /**
     * Callback after bind process ends (major: association with other events or commands)
     */
    cbEnd: (cmd: object, result: object, status: object, xhr: object) => void;

}

export default ICommandCallback;
export { ICommandCallback };