import type { MetaView }        from 'logic-entity/ko';

/**
 * 객체 통제 인터페이스 입니다.
 */
declare interface IBindCommand {

    valid: MetaView;

    bind: MetaView;

    output: MetaView;

    outputOption: object;   // TODO: 타입 추출

    /**
     * 실행 ( valid >> bind >> result >> output >> end )
     */
    execute(): unknown;

}

export default IBindCommand;
export { IBindCommand };