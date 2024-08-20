// ES6, cjs, jest
//==============================================================
// gobal defined
'use strict';
const {BindModel}                      = require('../src/bind-model');
const {HTMLColumn}                      = require('../src/html-column');
// const {MetaObject}              = require('logic-core');
// const {MetaElement}             = require('logic-core');
// const {BaseColumn}              = require('../src/base-column');
// const { MetaTable }             = require('../src/meta-table');
// const { MetaView }              = require('../src/meta-view');
// const { MetaRow }               = require('../src/meta-row');
const { MetaRegistry }            = require('logic-entity');

// let MetaObjectSub, MetaElementSub, ComplexElementSub, EmpytClass;

//==============================================================
// test
describe("생성 방법", () => {
    describe("new BindModel()", () => {
        beforeEach(() => {
            jest.resetModules();
            MetaRegistry.init();
        });
        beforeAll(done => { // REVIEW: 필요성 검토?
            done()
          })
        afterAll(done => {  // REVIEW: 필요성 검토?
            done();
          })
        describe("기본 테이블에 추가", () => {
            it("- 1. 아이템 추가 후 매핑 ", () => {
                var bm1 = new BindModel()
                bm1.addCommand('read', 3)
                bm1.items.add('aa', '')
                bm1.items.add('bb', '')
                bm1.items.add('cc', '')
                bm1.items.add('dd', '')
                bm1.setMapping({
                    aa: { read: ['valid'] },
                    bb: { read: ['bind'] },
                    cc: { read: ['output'] },
                    dd: { read: [] },
                })
                
                expect(bm1.columns.count).toBe(4)
                expect(bm1.command.read.valid.columns.count).toBe(2)
                expect(bm1.command.read.bind.columns.count).toBe(2)
                expect(bm1.command.read.output.columns.count).toBe(2)
                
                expect(bm1.command.read.valid.columns.exist('aa')).toBe(true)
                expect(bm1.command.read.valid.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('bb')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.output.columns.exist('cc')).toBe(true)
                expect(bm1.command.read.output.columns.exist('dd')).toBe(true)
            });
            it("- 1-1. 컬럼 추가 후 매핑 ", () => {
                var bm1 = new BindModel()
                bm1.addCommand('read', 3)
                bm1.columns.addValue('aa', '')
                bm1.columns.addValue('bb', '')
                bm1.columns.addValue('cc', '')
                bm1.columns.addValue('dd', '')
                bm1.setMapping({
                    aa: { read: ['valid'] },
                    bb: { read: ['bind'] },
                    cc: { read: ['output'] },
                    dd: { read: [] },
                })
                
                expect(bm1.columns.count).toBe(4)
                expect(bm1.command.read.valid.columns.count).toBe(2)
                expect(bm1.command.read.bind.columns.count).toBe(2)
                expect(bm1.command.read.output.columns.count).toBe(2)
                
                expect(bm1.command.read.valid.columns.exist('aa')).toBe(true)
                expect(bm1.command.read.valid.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('bb')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.output.columns.exist('cc')).toBe(true)
                expect(bm1.command.read.output.columns.exist('dd')).toBe(true)
            });
            it("- 2. 컬럼 추가 시 커멘드 등록 ", () => {
                var bm1 = new BindModel()
                bm1.addCommand('read', 3)
                bm1.addColumnValue('aa', '', 'read', 'valid')
                bm1.addColumnValue('bb', '', ['read'], 'bind')
                bm1.addColumnValue('cc', '', [], 'output')
                bm1.addColumnValue('dd', '', [])
                
                expect(bm1.columns.count).toBe(4)
                expect(bm1.command.read.valid.columns.count).toBe(2)
                expect(bm1.command.read.bind.columns.count).toBe(2)
                expect(bm1.command.read.output.columns.count).toBe(2)
                
                expect(bm1.command.read.valid.columns.exist('aa')).toBe(true)
                expect(bm1.command.read.valid.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('bb')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.output.columns.exist('cc')).toBe(true)
                expect(bm1.command.read.output.columns.exist('dd')).toBe(true)
            });
            it("- 3. 테이블에 컬럼 추가 후 커멘드 설정 ", () => {
                var bm1 = new BindModel()
                bm1.addCommand('read', 3)
                bm1.addColumnValue('aa', '')
                bm1.columns.addValue('bb', '')
                bm1.columns.add('cc', '')
                bm1._baseTable.columns.addValue('dd', '')
                bm1.command.read.setColumn('aa', 'valid')
                bm1.command.read.setColumn('bb', ['bind'])
                bm1.command.read.setColumn('cc', ['output'])
                bm1.command.read.setColumn('dd')

                expect(bm1.columns.count).toBe(4)
                expect(bm1.command.read.valid.columns.count).toBe(2)
                expect(bm1.command.read.bind.columns.count).toBe(2)
                expect(bm1.command.read.output.columns.count).toBe(2)
                
                expect(bm1.command.read.valid.columns.exist('aa')).toBe(true)
                expect(bm1.command.read.valid.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('bb')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.output.columns.exist('cc')).toBe(true)
                expect(bm1.command.read.output.columns.exist('dd')).toBe(true)
            });
            it("- 4. 커맨드에 컬럼 객체 직접 추가 :  단일 설정에 적합함 ", () => {
                var bm1 = new BindModel()
                bm1.addCommand('read', 3)
                bm1.command.read.addColumnValue('aa', '', 'valid')
                bm1.command.read.addColumnValue('bb', '', ['bind'])
                bm1.command.read.addColumn(new HTMLColumn('cc'), ['output'])
                bm1.command.read.addColumn(new HTMLColumn('dd'))

                expect(bm1.columns.count).toBe(4)
                expect(bm1.command.read.valid.columns.count).toBe(2)
                expect(bm1.command.read.bind.columns.count).toBe(2)
                expect(bm1.command.read.output.columns.count).toBe(2)
                
                expect(bm1.command.read.valid.columns.exist('aa')).toBe(true)
                expect(bm1.command.read.valid.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('bb')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.output.columns.exist('cc')).toBe(true)
                expect(bm1.command.read.output.columns.exist('dd')).toBe(true)
            });
            it("- 5. 서비스 객체를 통한 추가 ", () => {
                var bm1 = new BindModel({
                    items: {
                        aa: '',
                        bb: '',
                        cc: '',
                        dd: ''
                    },
                    command: {
                        read: { outputOption: 3}
                    },
                    mapping: {
                        aa: { read: ['valid'] },
                        bb: { read: ['bind'] },
                        cc: { read: ['output'] },
                        dd: { read: [] },
                    }
                })
    
                expect(bm1.columns.count).toBe(4)
                expect(bm1.command.read.valid.columns.count).toBe(2)
                expect(bm1.command.read.bind.columns.count).toBe(2)
                expect(bm1.command.read.output.columns.count).toBe(2)
                
                expect(bm1.command.read.valid.columns.exist('aa')).toBe(true)
                expect(bm1.command.read.valid.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('bb')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.output.columns.exist('cc')).toBe(true)
                expect(bm1.command.read.output.columns.exist('dd')).toBe(true)
            });
        });
        describe("기본과 확장에 테이블에 추가", () => {
            it("- 1. 아이템 추가 후 매핑 ", () => {
                var bm1 = new BindModel()
                bm1.addTable('second')
                bm1.addCommand('read', 3)
                bm1.items.add('aa', '')
                bm1.items.add('bb', '')
                bm1.items.add('cc', '')
                bm1.items.add('dd', '')
                bm1.setMapping({
                    aa: { read: ['valid'] },
                    bb: { read: ['bind'] },
                    'second.cc': { read: ['output'] },
                    'second.dd': { read: [] },  // TODO: command 이름이 Array 이면, 전체에 추가 필요
                })
                
                expect(bm1.columns.count).toBe(2)
                expect(bm1._tables['second'].columns.count).toBe(2)
                expect(bm1.command.read.valid.columns.count).toBe(2)
                expect(bm1.command.read.bind.columns.count).toBe(2)
                expect(bm1.command.read.output.columns.count).toBe(2)
                
                expect(bm1.command.read.valid.columns.exist('aa')).toBe(true)
                expect(bm1.command.read.valid.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('bb')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.output.columns.exist('cc')).toBe(true)
                expect(bm1.command.read.output.columns.exist('dd')).toBe(true)
            });
            it("- 2. 컬럼 추가 시 커멘드 등록 ", () => {
                var bm1 = new BindModel()
                bm1.addTable('second')
                bm1.addCommand('read', 3)
                bm1.addColumnValue('aa', '', 'read', 'valid')
                bm1.addColumnValue('bb', '', ['read'], 'bind')
                bm1.addColumnValue('second.cc', '', [], 'output')
                bm1.addColumnValue('second.dd', '', [])
                
                expect(bm1.columns.count).toBe(2)
                expect(bm1._tables['second'].columns.count).toBe(2)
                expect(bm1.command.read.valid.columns.count).toBe(2)
                expect(bm1.command.read.bind.columns.count).toBe(2)
                expect(bm1.command.read.output.columns.count).toBe(2)
                
                expect(bm1.command.read.valid.columns.exist('aa')).toBe(true)
                expect(bm1.command.read.valid.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('bb')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.output.columns.exist('cc')).toBe(true)
                expect(bm1.command.read.output.columns.exist('dd')).toBe(true)
            });
            it("- 3. 테이블에 컬럼 추가 후 커멘드 설정 ", () => {
                var bm1 = new BindModel()
                bm1.addTable('second')
                bm1.addCommand('read', 3)
                bm1.addColumnValue('aa', '')
                bm1.columns.addValue('bb', '')
                bm1._tables['second'].columns.add('cc', '')
                bm1['second'].columns.addValue('dd', '')
                bm1.command.read.setColumn('aa', 'valid')
                bm1.command.read.setColumn('bb', ['bind'])
                bm1.command.read.setColumn('second.cc', ['output'])
                bm1.command.read.setColumn('second.dd')

                expect(bm1.columns.count).toBe(2)
                expect(bm1._tables['second'].columns.count).toBe(2)
                expect(bm1.command.read.valid.columns.count).toBe(2)
                expect(bm1.command.read.bind.columns.count).toBe(2)
                expect(bm1.command.read.output.columns.count).toBe(2)
                
                expect(bm1.command.read.valid.columns.exist('aa')).toBe(true)
                expect(bm1.command.read.valid.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('bb')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.output.columns.exist('cc')).toBe(true)
                expect(bm1.command.read.output.columns.exist('dd')).toBe(true)
            });
            it("- 4. 커맨드에 컬럼 객체 직접 추가 :  단일 설정에 적합함 ", () => {
                var bm1 = new BindModel()
                bm1.addTable('second')
                bm1.addCommand('read', 3)
                bm1.command.read.addColumn(new HTMLColumn('aa'), ['valid'])
                bm1.command.read.addColumn(new HTMLColumn('bb'), 'bind')
                bm1.command.read.addColumnValue('second.cc', '', 'output')
                bm1.command.read.addColumnValue('second.dd', '', [])

                expect(bm1.columns.count).toBe(2)
                expect(bm1._tables['second'].columns.count).toBe(2)
                expect(bm1.command.read.valid.columns.count).toBe(2)
                expect(bm1.command.read.bind.columns.count).toBe(2)
                expect(bm1.command.read.output.columns.count).toBe(2)
                
                expect(bm1.command.read.valid.columns.exist('aa')).toBe(true)
                expect(bm1.command.read.valid.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('bb')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.output.columns.exist('cc')).toBe(true)
                expect(bm1.command.read.output.columns.exist('dd')).toBe(true)
            });
            it("- 5. 서비스 객체를 통한 추가 ", () => {
                var bm1 = new BindModel({
                    tables: ['second'],
                    items: {
                        aa: '',
                        bb: '',
                        cc: '',
                        dd: ''
                    },
                    command: {
                        read: { outputOption: 3}
                    },
                    mapping: {
                        aa: { read: ['valid'] },
                        bb: { read: ['bind'] },
                        'second.cc': { read: ['output'] },
                        'second.dd': { read: [] },
                    }
                })
    
                expect(bm1.columns.count).toBe(2)
                expect(bm1._tables['second'].columns.count).toBe(2)
                expect(bm1.command.read.valid.columns.count).toBe(2)
                expect(bm1.command.read.bind.columns.count).toBe(2)
                expect(bm1.command.read.output.columns.count).toBe(2)
                
                expect(bm1.command.read.valid.columns.exist('aa')).toBe(true)
                expect(bm1.command.read.valid.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('bb')).toBe(true)
                expect(bm1.command.read.bind.columns.exist('dd')).toBe(true)
                expect(bm1.command.read.output.columns.exist('cc')).toBe(true)
                expect(bm1.command.read.output.columns.exist('dd')).toBe(true)
            });
        });
    });
});
