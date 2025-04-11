import type { MetaTable }            from 'logic-entity';

/**
 * Object control interface.
 * @interface
 */
declare interface IBind {

    /**
     * Default entity
     */
    _baseTable: MetaTable;

    /**
     * Add Column
     */
    addColumn();
}

export default IBind;
export { IBind };