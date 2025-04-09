/**** i-bind-command.js | IBindCommand ****/
//==============================================================
import { ExtendError }                  from 'logic-entity';

var IBindCommand  = (function () {
    /**
     * 내보내기 제어 인터페이스 입니다.
     * @constructs _L.Interface.IBindCommand
     * @interface
     */
    function IBindCommand() {

        /**
         * 유효성 뷰
         * @member {MetaView} _L.Interface.IBindCommand#valid
         */
        this.valid = {};

        /**
         * 바인드 뷰
         * @member {MetaView} _L.Interface.IBindCommand#bind
         */
        this.bind = {};

        /**
         * 출력 뷰
         * @member {MetaView} _L.Interface.IBindCommand#output
         */
        this.output = {};

        /**
         * 출력 옵션
         * @member {object} _L.Interface.IBindCommand#outputOption
         */
        this.outputOption = {option: Number, index: [[ [Number], Number ]]};
    }

    IBindCommand._NS = 'Interface';    // namespace
    IBindCommand._KIND = 'interface';

    /**
     * 대상을 내보냅니다. (쓰기)
     * @returns {any}
     * @abstract
     */
    IBindCommand.prototype.execute  = function() {
        throw new ExtendError(/EL02331/, null, ['IBindCommand']);
    };

    return IBindCommand;
    
}());

export default IBindCommand;
export { IBindCommand };