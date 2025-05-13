import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

/**
 * 파일을 동기/비동기 방식으로 로딩 (json 또는 js)
 * @param {string} filePath
 * @param {string} label - 'src' 또는 'core'
 * @param {function} warn
 * @returns {Promise<object>}
 */
async function loadFile(filePath, label, warn) {
  try {
    if (filePath.endsWith('.js')) {
      const module = await import(pathToFileURL(filePath).href);
      if (!module.default || typeof module.default !== 'object') {
        throw new Error('export default 가 정의되지 않았거나 객체가 아님');
      }
      return module.default;
    } else {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    warn(`⚠️ ${label} 파일 로딩 실패 (${filePath}): ${err.message}`);
    return {};
  }
}

/**
 * 병합 로케일 플러그인 (ESM용)
 * @param {string} logicCoreLocalesPath - logic-core의 /dist/locales 경로
 */
function mergeLocalesPlugin(logicCoreLocalesPath) {
  return {
    name: 'merge-locales-plugin',
    async buildEnd() {
      // const __dirname = path.dirname(new URL(import.meta.url).pathname);
      const srcDir = path.resolve(__dirname, 'src/locales');
      const coreDir = path.resolve(__dirname, logicCoreLocalesPath);
      const distDir = path.resolve(__dirname, 'dist/locales');

      if (!fs.existsSync(coreDir)) {
        this.warn(`⚠️ 경로가 존재하지 않습니다: ${coreDir}`);
        return;
      }

      const isTargetFile = f => f.endsWith('.json') || f.endsWith('.js');

      const srcFiles = fs.existsSync(srcDir)
        ? fs.readdirSync(srcDir).filter(isTargetFile)
        : [];

      const coreFiles = fs.readdirSync(coreDir).filter(isTargetFile);

      const allFiles = new Set([...srcFiles, ...coreFiles]);
      const srcSet = new Set(srcFiles);
      const coreSet = new Set(coreFiles);

      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
      }

      for (const filename of allFiles) {
        const srcFilePath = path.join(srcDir, filename);
        const coreFilePath = path.join(coreDir, filename);
        const distFilePath = path.join(distDir, filename);

        const hasSrc = srcSet.has(filename);
        const hasCore = coreSet.has(filename);

        const srcData = hasSrc ? await loadFile(srcFilePath, 'src', this.warn) : {};
        const coreData = hasCore ? await loadFile(coreFilePath, 'core', this.warn) : {};

        const merged = {
          ...coreData,
          ...srcData
        };

        try {
          const isJS = filename.endsWith('.js');
          const output = isJS
            ? `export default ${JSON.stringify(merged, null, 2)};\n`
            : JSON.stringify(merged, null, 2);

          fs.writeFileSync(distFilePath, output, 'utf-8');
          this.warn(`📤 dist/locales 저장 완료: ${filename}`);
        } catch (err) {
          this.error(`❌ dist 저장 실패 (${filename}): ${err.message}`);
        }
      }
    }
  };
}

export default mergeLocalesPlugin;