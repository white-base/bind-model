import {MetaView}             from 'logic-entity';
import {MetaColumn}           from 'logic-entity';

/**
 * 객체 통제 인터페이스 입니다.
 * @interface
 */
declare interface IModelCallback {

    /**
     * valid 에서 실패시 콜백
     */
    cbFail: (_this: any, result: object, column: MetaColumn)=>void; // TODO: _this 는 모두 model 임  아래쪽도 ..

    /**
     * valid 에서 오류발생시 콜백
     */
    cbError: (_this: any, msg: string, status: object)=>void; // TODO: _this 검토 필요

    /**
     * 검사(valid)시 기본 콜백 (cbValid 콜백함수가 없을 경우)
     */
    cbBaseValid: (_this: any, valid: MetaView)=>boolean;

    /**
     * 바인드(valid)시 기본 콜백 (cbBind 콜백함수가 없을 경우)
     */
    cbBaseBind: (_this: any, setup: object)=>void;

    /**
     * 바인드 결과 수신 기본 콜백 (cbResult 콜백함수가 없을 경우)
     */
    cbBaseResult: (_this: any, result: object)=>object;

    /**
     * 출력 기본 콜백 (cbOutput 콜백함수가 없을 경우)
     */
    cbBaseOutput: (_this: any, result: object)=>void;

    /**
     * 실행완료시 기본 콜백 (cbEnd 콜백함수가 없을 경우)
     */
    cbBaseEnd: (_this: any, msg: string, status: object, xhr: object)=>void;

}

export = IModelCallback;