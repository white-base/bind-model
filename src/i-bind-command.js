/**** i-bind-command.js | IBindCommand ****/
//==============================================================
import { ExtendError }                  from 'logic-entity';

/**
 * 바인드 명령 인터페이스입니다.
 * 
 * @interface
 * @constructs _L.Interface.IBindCommand
 */
class IBindCommand {
    
    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';

    constructor() {
    }
    
    /**
     * 유효성 뷰
     * 
     * @member {MetaView}
     */
    valid = {};

    /**
     * 바인드 뷰
     * 
     * @member {MetaView}
     */
    bind = {};

    /**
     * 출력 뷰
     * 
     * @member {MetaView}
     */
    output = {};

    /**
     * 출력 옵션
     * 
     * @member {object}
     */
    outputOption = {
        option: Number,
        index: [[[Number], Number]]
    };

    /**
     * 대상을 내보냅니다. (쓰기)
     * 
     * @returns {any}
     * @abstract
     */
    execute() {
        throw new ExtendError(/EL02331/, null, ['IBindCommand']);
    }
}

export default IBindCommand;
export { IBindCommand };