import {MetaView}             from 'logic-entity';

/**
 * 객체 통제 인터페이스 입니다.
 * @interface
 */
declare interface IBindCommand {

    /**
     * 검사대상 MetaView
     */
    valid: MetaView;

    /**
     * 바인드 MetaView
     */
    bind: MetaView;

    /**
     * 동적 추가됨
     */
    output: MetaView;

    /**
     * 출력(output) 특성
     * 0: 제외(edit),  1: View 오버로딩 , 2: 있는자료만 , 3: 존재하는 자료만 
     */
    outputOption: object;   // TODO: 타입 추출

    /**
     * 실행 ( valid >> bind >> result >> output >> end )
     */
    execute();

}

export = IBindCommand;