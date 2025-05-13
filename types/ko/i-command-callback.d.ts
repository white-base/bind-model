// import type { MetaView }            from 'logic-entity/ko';
// import type { BaseBindCommand }     from './base-bind-command.d.ts';

/**
 * 객체 통제 인터페이스 입니다.
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