import type { MetaObject }       from "logic-entity";

/**
* Type of MetaObject class.
*/
export type MetaObjectType = InstanceType<typeof MetaObject>;


/** Output Processing Method */
type OutOptNumber = 0 | 1 | 2 | 3;
type OutOptString = 'SEND' | 'VIEW' | 'ALL' | 'PICK';
type OutOptObject = {
    option?: OutOptNumber | OutOptString,
    index?: number
};

export type OutputOption = OutOptNumber | OutOptString | OutOptObject;