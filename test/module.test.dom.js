//==============================================================
// gobal defined
import {jest} from '@jest/globals';

//==============================================================
/**
 * 'logic-core'
 * 'dist/logic-core.esm.js' : esm  
 * 'dist/logic-core.js' : umd
 */
describe("cjs", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
        globalThis.isDOM = true;
    });
    describe("logic-entity 모듈", () => {
        it("- 기본", async () => {
            const { PropertyCollection, MetaView } = await import('logic-bind-model');
            const {BindModel} = await import('logic-bind-model/ko');
            const p = new PropertyCollection();
            const a = new MetaView('v1');
            const bm = new BindModel();
            
            bm.addCommand('cmd1', 4);
            bm.cmd.cmd1.newOutput('out1')
            bm.cmd.cmd1.out1._name
            bm.cbBaseBind

            expect(typeof PropertyCollection === 'function').toBe(true);
            expect(typeof MetaView === 'function').toBe(true);
        });
    });
    describe("dist/logic-entity.esm.js 모듈", () => {
        it("- 기본", async () => {
            const { PropertyCollection, MetaView } = await import('../dist/bind-model.esm.js');
            const p = new PropertyCollection();
            const a = new MetaView('v1');
            
            expect(typeof PropertyCollection === 'function').toBe(true);
            expect(typeof MetaView === 'function').toBe(true);
        });
    });
    describe("dist/logic-entity.js 모듈", () => {
        it("- 전역 _L 에 import", async () => {
            await import('../dist/bind-model.js');
            const { PropertyCollection, MetaView } = globalThis._L;
            const { BindModel } = globalThis._L;
            const p = new PropertyCollection();
            const a = new MetaView('v1');
            const bm = new BindModel();
            
            bm.addCommand('cmd1', 4);
            bm.cmd.cmd1.newOutput('out1')
            bm.cmd.cmd1.out1._name
            
            expect(typeof PropertyCollection === 'function').toBe(true);
            expect(typeof MetaView === 'function').toBe(true);
        });
    });
});