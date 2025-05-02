// import type { MetaView }        from 'logic-entity';
// import type { MetaColumn }      from 'logic-entity';

/**
 * Object control interface.
 */
declare interface IModelCallback {

     cbFail: (result: object, column: object) => void;

     cbError: (msg: string, status: object, response: object) => void;
 
     cbBaseBegin: (command: object) => void;
 
     cbBaseValid: (valid: object, command: object) => boolean;
 
     cbBaseBind: (bind: object, command: object, config: object) => void;
 
     cbBaseResult: (data: object, command: object, response: object) => object;
 
     cbBaseOutput: (outputs: object, command: object, response: object) => void;
 
     cbBaseEnd: (status: object, command: object, response: object) => void;

}

export default IModelCallback;
export { IModelCallback };