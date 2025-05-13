import type { MetaView }            from 'logic-entity';
import type { BaseBindCommand }     from './base-bind-command.d.ts';

/**
 * Object control interface.
 */
declare interface ICommandCallback {

    cbValid: (valid: object, cmd: object) => boolean;

    cbBind: (bind: object, cmd: object, setup: object) => void;   // TODO: 맨뒤 this

    cbResult: (data: object, cmd: object, result: object) => object;

    cbOutput: (views: object, cmd: object, result: object) => void;

    cbEnd: (cmd: object, result: object, status: object, xhr: object) => void;

}

export default ICommandCallback;
export { ICommandCallback };