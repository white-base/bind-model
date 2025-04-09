import {MetaView}             from 'logic-entity';

/**
 * Object control interface.
 * @interface
 */
declare interface IBindCommand {

    /**
     * MetaView for inspection
     */
    valid: MetaView;

    /**
     * Bind MetaView
     */
    bind: MetaView;

    /**
     * Dynamic added
     */
    output: MetaView;

    /**
     * Output Characteristics
     * 0: exclude, 1: view overload, 2: only data that exists, 3: only data that exists 
     */
    outputOptions: object; // TODO: Type extraction

    /**
     * 실행 ( valid >> bind >> result >> output >> end )
     */
    execute();

}

export = IBindCommand;