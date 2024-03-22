// 기본 설정
var board = new BindModelAjax();

board.baseUrl = '../Boad.C.asp';
board.addTable('second');                                       // REVIEW: 공통
// ##############################
// 컬럼 및 커맨드 설정
    // 1. 아이템 추가 후 커맨드에 매핑 설정
    board.items.add('phone' , '');
    board.items.add('tel' , '010');
    board.addCommand('read', 3);
    board.setMapping({  // 매핑 설정
        "phone": {'read': ['bind']},
        "tel": {'read': ['valid', 'bind']},
        "second.tel": {'read': ['output']},                         // REVIEW:
    });
    // 2. 컬럼 추가 및 커맨드에 동시 등록 (아이템 생략)
    board.addCommand('read', 3);
    board.addColumn(new HTMLColumn('phone'), 'read', ['bind']);     // POINT: read 자동 등록
    board.addColumnValue('tel', '010', 'read', ['valid', 'bind']);
    board.addColumnValue('second.tel', '010', 'read', ['output']);  // REVIEW:
    // 3. 컬렉션에 컬럼 추가 >> 커맨드 추가 >> 컬럼 설정
    board.addCommand('read', 3);
    board.colums.add('phone');
    board.columns.addValue('tel', '');
    board._tables['sceond'].columns.addValue('tel', '');
    board.command['read'].setColumn('phone', 'bind')
    board.command['read'].setColumn('tel', ['valid', 'bind'])
    board.command['read'].setColumn('second.tel', ['output'])       // REVIEW:
    // 4. 커맨드에 컬럼 객체 직접 추가 : 단일 설정에 적합함
    board.addCommand('read', 3);
    board.command['read'].addColumn('phone', 'bind')
    board.command['read'].addColumn('tel', ['valid', 'bind'])
    board.command['read'].addColumn('second.tel', ['output'])              // REVIEW:
    // board.command['read'].addColumn(board._tables['sceond'].columns['tel'], ['output'])  // 위와 동일 처리
    // 5. 추가한 컬럼은 second 에 저장됨
    board.addCommand('read', 3, 'second');  // board.addCommand('read', 3, board._tables['second']);
    board.command['read'].addColumn('phone', 'bind')
    board.command['read'].addColumn('tel', ['valid', 'bind'])
    // board.command['read'].addColumn('second.tel', ['output'])    // 위와 동일 처리

// ##############################
// 커맨드별 콜백 및 사용자 함수 등록
board.command['read'].onExecute = ()=>{};
board.cmd['read'].cbBind = ()=>{}; // alias 을 통한 접
board.fn.add('search', ()=>{});

// ______________________________
// 서비스 객체를 통한 설정
var board = new BindModelAjax({
    baseUrl: '../Boad.C.asp',       // 객체 속성 설정
    tables: ['second'],
    items: {
        phone: '',
        tel: '010',
    },
    command: {  // cmd
        read: {
                        
            outputOption: 3, // outOpt
            onExecute: ()=>{},
            cbBind: ()=>{},
        }
    },
    mapping: {
        phone: { read: 'bind' },
        tel: { read: ['valid', 'bind'] },
        "second.tel": { read: 'output' },
    },
    fn: {
        search: ()=>{}
    }
});

// ##############################
// 준비 및 실행
$(function () {
    board.init();           // 초기화
    board.read.execute();   // 읽기
});