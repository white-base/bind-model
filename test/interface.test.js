// ES6, cjs, jest
//==============================================================
// gobal defined
'use strict';
const {IBindCommand}        = require('../src/i-bind-command');
const {IBindModel}          = require('../src/i-bind-model');
const {IBind}               = require('../src/i-bind');
const {ICommandCallback}    = require('../src/i-command-callback');
const {IModelCallback}      = require('../src/i-model-callback');
const {IAjaxService}        = require('../src/i-service-ajax');
const {IService}            = require('../src/i-service');

// let MetaObjectSub, MetaElementSub, ComplexElementSub, EmpytClass;

//==============================================================
// test
describe("[target: i-*.js]", () => {
    describe("IBindCommand :: 인터페이스", () => {
        beforeEach(() => {
            // jest.resetModules();
            // MetaRegistry.init();
        });

        describe("IBindCommand :: 인터페이스", () => {
            it("- 생성 및 상속 ", () => {
                class SubClass extends IBindCommand {}
                const s = new SubClass();
                const i = new IBindCommand();
                
                expect(s.valid).toBeDefined();
                expect(s.bind).toBeDefined();
                expect(s.output).toBeDefined();
                expect(s.outputOption).toBeDefined();
                // extends
                expect(()=> s.execute()).toThrow(/EL02331/);
                // create
                expect(()=> i.execute()).toThrow(/EL02331/);
            });
        });
        describe("IBindModel :: 인터페이스", () => {
            it("- 생성 및 상속 ", () => {
                class SubClass extends IBindModel {}
                const s = new SubClass();
                const i = new IBindModel();
    
                expect(s.items).toBeDefined();
                expect(s.fn).toBeDefined();
                expect(s.command).toBeDefined();
                expect(s.preRegister).toBeDefined();
                expect(s.preCheck).toBeDefined();
                expect(s.preReady).toBeDefined();
            });
        });
        describe("IBind :: 인터페이스", () => {
            it("- 생성 및 상속 ", () => {
                class SubClass extends IBind {}
                const s = new SubClass();
                const i = new IBind();
    
                expect(s._baseTable).toBeDefined();
                expect(()=> s.addColumn()).toThrow(/EL02311/);
            });
        });
        describe("ICommandCallback :: 인터페이스", () => {
            it("- 생성 및 상속 ", () => {
                class SubClass extends ICommandCallback {}
                const s = new SubClass();
                const i = new ICommandCallback();
    
                expect(s.cbValid).toBeDefined();
                expect(s.cbBind).toBeDefined();
                expect(s.cbResult).toBeDefined();
                expect(s.cbOutput).toBeDefined();
                expect(s.cbEnd).toBeDefined();
            });
        });
        describe("IModelCallback :: 인터페이스", () => {
            it("- 생성 및 상속 ", () => {
                class SubClass extends IModelCallback {}
                const s = new SubClass();
                const i = new IModelCallback();
    
                expect(s.cbFail).toBeDefined();
                expect(s.cbError).toBeDefined();
                expect(s.cbBaseValid).toBeDefined();
                expect(s.cbBaseBind).toBeDefined();
                expect(s.cbBaseResult).toBeDefined();
                expect(s.cbBaseOutput).toBeDefined();
                expect(s.cbBaseEnd).toBeDefined();
            });
        });
        describe("IAjaxService :: 인터페이스", () => {
            it("- 생성 및 상속 ", () => {
                class SubClass extends IAjaxService {}
                const s = new SubClass();
                const i = new IAjaxService();
    
                expect(s.baseConfig).toBeDefined();
                expect(s.baseUrl).toBeDefined();
            });
        });
        describe("IService :: 인터페이스", () => {
            it("- 생성 및 상속 ", () => {
                class SubClass extends IService {}
                const s = new SubClass();
                const i = new IService();
    
                expect(s.tables).toBeDefined();
                expect(s.mapping).toBeDefined();
                
                // IBindModel
                expect(s.items).toBeDefined();
                expect(s.fn).toBeDefined();
                expect(s.command).toBeDefined();
                expect(s.preRegister).toBeDefined();
                expect(s.preCheck).toBeDefined();
                expect(s.preReady).toBeDefined();
                // IModelCallback
                expect(s.cbFail).toBeDefined();
                expect(s.cbError).toBeDefined();
                expect(s.cbBaseValid).toBeDefined();
                expect(s.cbBaseBind).toBeDefined();
                expect(s.cbBaseResult).toBeDefined();
                expect(s.cbBaseOutput).toBeDefined();
                expect(s.cbBaseEnd).toBeDefined();
                expect(s.preRegister).toBeDefined();
                expect(s.preCheck).toBeDefined();
                expect(s.preReady).toBeDefined();
                // expect(()=> s.preRegister()).toThrow(/IService/);
                // expect(()=> s.preCheck()).toThrow(/IService/);
                // expect(()=> s.preReady()).toThrow(/IService/);

            });
        });
    });
});
