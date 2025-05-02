import type { MetaTable }            from 'logic-entity/ko';

/**
 * 객체 통제 인터페이스 입니다.
 */
declare interface IBind {

    _baseTable: MetaTable;

    /**
     * 컬럼 추가
     */
    addColumn(): void;
}

export default IBind;
export { IBind };