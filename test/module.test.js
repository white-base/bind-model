//==============================================================
// gobal defined
import { jest } from '@jest/globals';

//==============================================================
/**
 * 'logic-core'
 * 'dist/logic-core.esm.js'
 */
describe("esm", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
        globalThis.isESM = true
        process.env.LANG = 'ko_KR.UTF-8';
    });
    describe("logic-entity 모듈", () => {
        it("- 기본 : 타입 지원", async () => {
            const { MetaTable, MetaView } = await import('logic-bind-model');
            const {BindModel} = await import('logic-bind-model/ko');
            const p = new MetaTable('t1');
            const a = new MetaView('t2');
            const bm = new BindModel();
            
            bm.addCommand('cmd1');
            bm.cmd.cmd1.newOutput('out1')
            bm.cmd.cmd1.out1._name
            // bm.cbFail = (a=1, b) => true

            expect(typeof BindModel === 'function').toBe(true);
            expect(typeof MetaTable === 'function').toBe(true);
            expect(typeof MetaView === 'function').toBe(true);
        });
    });
    describe("dist/logic-entity.esm.js 모듈", () => {
        it("- 기본", async () => {
            const { MetaTable, MetaView } = await import('../dist/bind-model.esm.js');
            const p = new MetaTable('t1');
            const a = new MetaView('t2');
            
            expect(typeof MetaTable === 'function').toBe(true);
            expect(typeof MetaView === 'function').toBe(true);
        });
    });
});
