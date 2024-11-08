import { transform } from '@babel/standalone';
import { Files, File } from '../Playground/playgroundContext';
import { APP_COMPONENT_FILE_NAME, ENTRY_FILE_NAME } from '../../template';
import { PluginObj } from '@babel/core';

/**
 * 使用 Babel 将代码进行转换，应用 React 和 TypeScript 预设，
 * 并使用自定义插件处理文件导入。
 * @param filename - 要转换的文件名。
 * @param code - 文件的源代码内容。
 * @param files - 包含所有文件内容的对象，用于依赖解析。
 * @returns 转换后的 JavaScript 代码字符串，如果出错则返回 undefined。
 */
export const babelTransform = (filename: string, code: string, files: Files): string | undefined => {
    try {
        return transform(code, {
            presets: ['react', 'typescript'],
            filename,
            plugins: [customResolver(files)], // 使用自定义插件处理导入
            retainLines: true,                // 保留行号，便于调试
        }).code;
    } catch (error) {
        console.log("编译出错", error); // 编译出错时记录错误信息
    }
};

/**
 * 解析文件路径，根据文件类型返回相应的 Blob URL。
 * - 如果文件是 CSS 或 JSON，则将文件内容转换为 JavaScript 格式。
 * - 如果是 JS/TS 文件，则使用 Babel 进行编译。
 * @param files - 包含所有文件内容的对象。
 * @param modulePath - 要导入的模块的相对路径。
 * @returns 转换后的文件的 Blob URL 字符串，如果文件未找到则返回 undefined。
 */
const replaceSuffixFile = (files: Files, modulePath: string): string | undefined => {
    if (modulePath.startsWith('.')) {
        const file = getModuleFile(files, modulePath);
        if (!file) return; // 如果未找到文件，则返回 undefined

        // 根据文件类型转换内容
        if (file.name.endsWith('.css')) {
            return css2Js(file);
        } else if (file.name.endsWith('.json')) {
            return json2Js(file);
        } else {
            const transformedCode = babelTransform(file.name, file.value, files);
            return transformedCode
                ? URL.createObjectURL(new Blob([transformedCode], { type: 'application/javascript' }))
                : undefined;
        }
    }
};

/**
 * 从文件列表中基于模块路径获取文件。
 * - 如果模块路径中包含扩展名，则直接返回文件。
 * - 否则，在文件列表中查找符合条件的 JS/TS 文件。
 * @param files - 包含所有文件内容的对象。
 * @param modulePath - 模块的相对路径。
 * @returns 匹配的 File 对象，如果未找到则返回 undefined。
 */
const getModuleFile = (files: Record<string, File>, modulePath: string): File | undefined => {
    const moduleName = modulePath.split('/').pop() || '';
    if (/\.\w+$/.test(moduleName)) return files[moduleName]; // 如果包含扩展名，则直接返回对应文件

    // 查找符合条件的文件，支持的扩展名有 .ts、.tsx、.js、.jsx
    const realModuleName = Object.keys(files)
        .find(key => /\.(ts|tsx|js|jsx)$/.test(key) && key.includes(moduleName));
    return realModuleName ? files[realModuleName] : undefined;
};

/**
 * 将 JSON 文件转换为 JavaScript 格式，通过导出语句包装 JSON 数据。
 * @param file - 要转换的 JSON 文件。
 * @returns 包含导出 JSON 数据的 JavaScript Blob URL 字符串。
 */
const json2Js = (file: File): string => {
    const js = `export default ${file.value}`;
    return URL.createObjectURL(new Blob([js], { type: 'application/javascript' }));
};

/**
 * 将 CSS 文件转换为 JavaScript 代码，创建动态插入样式标签的脚本。
 * @param file - 要转换的 CSS 文件。
 * @returns 包含将 CSS 插入文档的 JavaScript 代码的 Blob URL 字符串。
 */
const css2Js = (file: File): string => {
    const randomId = `style_${Date.now()}_${file.name}`;
    const js = `
(() => {
    const styleSheet = document.createElement('style');
    styleSheet.id = '${randomId}';
    document.head.appendChild(styleSheet);
    styleSheet.innerHTML = \`${file.value}\`;
})();
    `;
    return URL.createObjectURL(new Blob([js], { type: "application/javascript" }));
};

/**
 * 自定义 Babel 插件，用于在编译时处理 CSS 和 JSON 等特殊文件类型的导入路径。
 * @param files - 包含所有文件内容的对象。
 * @returns Babel 插件对象，包含用于修改 ImportDeclaration 节点的访问器。
 */
const customResolver = (files: Files): PluginObj => ({
    visitor: {
        ImportDeclaration(path) {
            const modulePath = path.node.source.value;
            const resolvedPath = replaceSuffixFile(files, modulePath) || modulePath;
            path.node.source.value = resolvedPath;
        },
    },
});

/**
 * 从入口文件及其依赖开始，使用 Babel 编译所有文件。
 * @param files - 包含所有文件内容的对象，其中 ENTRY_FILE_NAME 为主文件。
 * @returns 转换后的 JavaScript 代码字符串，如果出错则返回 undefined。
 */
export const compiler = (files: Files): string | undefined => {
    const main = files[ENTRY_FILE_NAME];
    return babelTransform(ENTRY_FILE_NAME, main.value, files);
};
