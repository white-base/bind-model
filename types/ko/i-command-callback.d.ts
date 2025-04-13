import type { MetaView }            from 'logic-entity/ko';
import type { BaseBindCommand }     from './base-bind-command.d.ts';

/**
 * 객체 통제 인터페이스 입니다.
 * 
 * @interface
 */
declare interface ICommandCallback {

    /**
     * 검사(valid) 전 콜백
     */
    cbValid: (valid: MetaView)=>boolean;

    /**
     * 바인드(bind) 전 콜백
     */
    cbBind: (cmd: BaseBindCommand, setup: object, _this: this)=>void;   // TODO: 맨뒤 this

    /**
     * 바인드(bind) 결과 콜백 (주요 : 회신자료의 가공의 역활)
     */
    cbResult: (cmd: BaseBindCommand, result: object)=>object;

    /**
     * 바인드 결과 출력 콜백 (주요: 목록의 출력)
     */
    cbOutput:  (cmd: BaseBindCommand, result: object)=>void;

    /**
     * 바인드 처리 종료 후 콜백 (주요: 다른 이벤트 또는 명령과의 연결)
     */
    cbEnd: (cmd: BaseBindCommand, result: object, status: object, xhr: object)=>void;

}

export default ICommandCallback;
export { ICommandCallback };