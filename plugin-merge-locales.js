import fs from 'fs';
import path from 'path';

/**
 * @param {string} logicCoreLocalesPath - logic-core의 /dist/locales 경로
 */
function mergeLocalesPlugin(logicCoreLocalesPath) {
  return {
    name: 'merge-locales-plugin',
    buildEnd() {
      const srcDir = path.resolve(__dirname, 'src/locales');
      const coreDir = path.resolve(__dirname, logicCoreLocalesPath);
      const distDir = path.resolve(__dirname, 'dist/locales');

      if (!fs.existsSync(coreDir)) {
        this.warn(`⚠️ logic-core 경로가 존재하지 않습니다: ${coreDir}`);
        return;
      }

      const srcFiles = fs.existsSync(srcDir)
        ? fs.readdirSync(srcDir).filter(f => f.endsWith('.json'))
        : [];
      const coreFiles = fs.readdirSync(coreDir).filter(f => f.endsWith('.json'));

      const srcSet = new Set(srcFiles);
      const coreSet = new Set(coreFiles);
      const allFiles = new Set([...srcFiles, ...coreFiles]);

      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
      }

      for (const filename of allFiles) {
        const srcFilePath = path.join(srcDir, filename);
        const coreFilePath = path.join(coreDir, filename);
        const distFilePath = path.join(distDir, filename);

        let srcData = {};
        let coreData = {};
        let merged = {};

        const hasSrc = srcSet.has(filename);
        const hasCore = coreSet.has(filename);

        if (hasCore) {
          try {
            coreData = JSON.parse(fs.readFileSync(coreFilePath, 'utf-8'));
          } catch (err) {
            this.warn(`⚠️ ${coreFilePath} JSON 파싱 실패: ${err.message}`);
            continue;
          }
        }

        if (hasSrc) {
          try {
            srcData = JSON.parse(fs.readFileSync(srcFilePath, 'utf-8'));
          } catch (err) {
            this.warn(`⚠️ ${srcFilePath} JSON 파싱 실패: ${err.message}`);
            continue;
          }
        }

        if (hasSrc && hasCore) {
          // 병합: src 우선
          merged = { ...coreData, ...srcData };
          this.warn(`✅ 병합 완료: ${filename}`);
        } else if (hasCore) {
          merged = coreData;
          this.warn(`📥 logic-core → dist 복사: ${filename}`);
        } else if (hasSrc) {
          merged = srcData;
          this.warn(`📁 src 전용 파일 → dist 복사: ${filename}`);
        }

        // dist/locales 에만 쓰기
        try {
          fs.writeFileSync(distFilePath, JSON.stringify(merged, null, 2), 'utf-8');
          this.warn(`📤 dist/locales 저장 완료: ${filename}`);
        } catch (err) {
          this.error(`❌ dist 저장 실패 (${filename}): ${err.message}`);
        }
      }
    }
  };
}

export default mergeLocalesPlugin;