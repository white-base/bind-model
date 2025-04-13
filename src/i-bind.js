/**** i-bind.js | IBind ****/
//==============================================================
import { ExtendError }                  from 'logic-entity';

/**
 * 바인드 인터페이스입니다.
 * 
 * @interface
 * @constructs _L.Interface.IBind
 */
class IBind {

    static _NS = 'Interface';    // namespace
    static _KIND = 'interface';

    constructor() {
    }

    /**
     * 실행 전 이벤트
     * 
     * @member {MetaTable}
     */
    _baseTable = [['_any_']];

    /**
     * 대상을 내보냅니다. (쓰기)
     * 
     * @returns {any}
     * @abstract
     */
    addColumn() {
        throw new ExtendError(/EL02311/, null, ['IBind']);
    }
}

export default IBind;
export { IBind };