import type { MetaColumn }       from 'logic-entity';
import type { BaseEntity }       from 'logic-entity';

/**
 * Classes representing HTML columns.
 * This class defines the columns that can interact with HTML DOM elements.
 */
declare class HTMLColumn extends MetaColumn {

    /**
     * Creates an HTML column object.
     * 
     * @param {string} name - The name of the column.
     * @param {BaseEntity} entity - The entity to which this column belongs.
     * @param {object} prop - Additional properties for the column.
     */
    constructor(name: string, entity: BaseEntity, prop: object);    // TODO: prop 타입 분리

    /**
     * Defines the item DOM type.
     */
    domType: object;

    /**
     * Indicates whether read-only is enabled.
     */
    isReadOnly: boolean;

    /**
     * Indicates whether it is hidden or not.
     */
    isHide: boolean;

    /**
     * Indicates the DOM element.
     */
    element: HTMLElement;

    /**
     * Defines a selector.
     * type
     * - 'value' or 'value': Value attribute value of element
     * - 'text': Text value of element
     * - 'html': HTML value of element
     * - 'css.synonymous': Attribute value of CSS (object)
     * - 'prop.': Attribute name value of element (based on initial state)
     * - 'attr. fast name': Attribute name value of element (current state)
     * - 'none': perform no action, purpose of expression
     * exam: 'value', 'text', 'css.color', 'prop.disabled'
     */
    selector: { key: string, type: string };

    /**
     * Function that filters the value.
     * 
     * @param {any | undefined} sVal - value obtained from selector when selector exists.
     * @returns {any} Filtered value.
     */
    getFilter: (sVal: any) => any;

    /**
     * Function that filters the value.
     * 
     * @param {any | undefined} val - Value to apply as filter.
     * @returns {any} If the filtering result is present, set the selector's value.
     * 
     */
    setFilter: (val: any) => any;

    /**
     * Sets or imports the value of the item. 
     * 
     * @override
     */
    value: any;

    /**
     * Replicate the current column.
     * 
     * @param {BaseEntity} entity - The entity to be replicated to.
     * @returns {this} Replica of the current instance.
     * @override
     */
    clone(entity: BaseEntity): this;

    /**
     * Obtain the current object as a serialized object. 
     * The cyclic reference is replaced by the value '$ref'.
     * 
     * @param {number} [vOpt=0] - Import option.
     * - '0': Reference structure ('_guid: Yes', '$ref: Yes')
     * - '1': Redundant structure ('_guid: Yes', '$ref: Yes')
     * - '2': Non-coordinated structure ('_guid: No', '$ref: No')
     * @param {object | object[]} [owned={}] - Parent objects that currently own the object.
     * @returns {object} serialized object.
     * 
     * @example
     * const serialized = a.getObject(2);
     * const sameObject = b.getObject(2);
     */
    getObject(vOpt?: number, owned?: object | Array<object>): object;

    /**
     * Sets the serialized object to the current object.  
     * The object is initialized.
     * 
     * @param {object} oGuid - serialized GUID object.
     * @param {object} [origin=oGuid] - The source object setting the current object.
     */
    setObject(oGuid: object, origin?: object): void;

}

export default HTMLColumn;
export { HTMLColumn };