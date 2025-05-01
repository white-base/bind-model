import type { MetaObject }      from "logic-entity/ko";

/**
 * MetaObject 클래스의 타입입니다.
 */
export type MetaObjectType = InstanceType<typeof MetaObject>;

/** 출력 처리 방법 */
type OutOptNumber = 0 | 1 | 2 | 3;
type OutOptString = 'SEND' | 'VIEW' | 'ALL' | 'PICK';
type OutOptObject = {
    option?: OutOptNumber | OutOptString,
    index?: number
};

export type OutputOption = OutOptNumber | OutOptString | OutOptObject;