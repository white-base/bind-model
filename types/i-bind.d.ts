import type { MetaTable }            from 'logic-entity';

/**
 * Object control interface.
 */
declare interface IBind {

    _baseTable: MetaTable;

    /**
     * Add Column
     */
    addColumn(): void;
}

export default IBind;
export { IBind };