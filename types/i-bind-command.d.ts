import type { MetaView }        from 'logic-entity';

/**
 * Object control interface.
 */
declare interface IBindCommand {

    valid: MetaView;

    bind: MetaView;

    output: MetaView;

    outputOptions: object; // TODO: Type extraction

    /**
     * 실행 ( valid >> bind >> result >> output >> end )
     */
    execute(): unknown;

}

export default IBindCommand;
export { IBindCommand };