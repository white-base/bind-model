// import type { MetaView }        from 'logic-entity/ko';
// import type { MetaColumn }      from 'logic-entity/ko';

/**
 * 객체 통제 인터페이스 입니다.
 */
declare interface IModelCallback {

    cbFail: (result: object, column: object) => void; // TODO: _this 는 모두 model 임  아래쪽도 ..

    cbError: (msg: string, status: object, response: object) => void; // TODO: _this 검토 필요

    cbBaseBegin: (command: object) => void;

    cbBaseValid: (valid: object, command: object) => boolean;

    cbBaseBind: (bind: object, command: object, config: object) => void;

    cbBaseResult: (data: object, command: object, response: object) => object;

    cbBaseOutput: (outputs: object, command: object, response: object) => void;

    cbBaseEnd: (status: object, command: object, response: object) => void;

}

export default IModelCallback;
export { IModelCallback };