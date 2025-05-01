/** 출력 처리 방법 */
type OutOptNumber = 0 | 1 | 2 | 3;
type OutOptString = 'SEND' | 'VIEW' | 'ALL' | 'PICK';
type OutOptObject = {
    option?: OutOptNumber | OutOptString,
    index?: number
};

export type OutputOption = OutOptNumber | OutOptString | OutOptObject;