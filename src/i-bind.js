/**** i-bind.js | IBind ****/
//==============================================================
import { ExtendError }                  from 'logic-entity';

var IBind  = (function () {
    /**
     * 내보내기 제어 인터페이스 입니다.
     * @constructs _L.Interface.IBind
     * @interface
     */
    function IBind() {

        /**
         * 실행 전 이벤트
         * @member {MetaTable} _L.Interface.IBind#_baseTable
         */
        this._baseTable = [['_any_']];
    }

    IBind._NS = 'Interface';    // namespace
    IBind._KIND = 'interface';

    /**
     * 대상을 내보냅니다. (쓰기)
     * @returns {any}
     * @abstract
     */
    IBind.prototype.addColumn  = function() {
        throw new ExtendError(/EL02311/, null, ['IBind']);
    };

    return IBind;
    
}());

export default IBind;
export { IBind };