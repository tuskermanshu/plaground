/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { Files, PlaygroundContext } from "../Playground/playgroundContext";
import compilerWorker from './compiler.worker?worker';
import styles from './index.module.scss';
import Editor from "../Editor";
import Message from "../Message";
import iframeRaw from "../../template/iframe.html?raw";
import { IMPORT_MAP_FILE_NAME } from "@/template";
import { debounce } from "lodash-es";
import classNames from "classnames";
import { babelTransform } from './compiler.worker';

// 消息数据类型定义
interface MessageData {
    type: string;
    message: string;
}

// 标签类型定义
type TabType = 'Preview' | 'JS';

// 常量配置
const DEBOUNCE_DELAY = 500;  // 防抖延迟时间
const BLOB_TYPE = "text/html";  // Blob 类型

const Preview = () => {
    // 从上下文获取文件相关信息
    const { files, selectedFileName } = useContext(PlaygroundContext);

        // 获取 iframe URL 的工具函数
        const getIframeUrl = useCallback((iframeRaw: string, files: Files, compiledCode: string) => {
            const res = iframeRaw
                .replace(
                    `<script type="importmap"></script>`,
                    `<script type="importmap">${files[IMPORT_MAP_FILE_NAME].value}</script>`
                )
                .replace(
                    `<script type="module" id="appSrc"></script>`,
                    `<script type="module" id="appSrc">${compiledCode}</script>`
                );
    
            return URL.createObjectURL(new Blob([res], { type: BLOB_TYPE }));
        }, []);

    // 状态管理
    const [compiledCode, setCompiledCode] = useState("");  // 编译后的代码
    const [babelCode, setBabelCode] = useState("");        // Babel 转换后的代码
    const [iframeUrl, setIframeUrl] = useState<string>(() => getIframeUrl(iframeRaw, files, compiledCode));  // iframe 的 URL
    const [error, setError] = useState('');                // 错误信息
    const [selectedTab, setSelectedTab] = useState<TabType>('Preview');  // 当前选中的标签

    // 引用管理
    const iframeRef = useRef<HTMLIFrameElement>(null);     // iframe 的引用
    const compilerWorkerRef = useRef<Worker>();            // Web Worker 的引用



    // 处理 iframe 消息
    const handleMessage = useCallback((msg: MessageEvent<MessageData>) => {
        const { type, message } = msg.data;
        if (type === 'ERROR') setError(message);
    }, []);

    // 处理 Worker 消息
    const handleWorkerMessage = useCallback((data: MessageEvent) => {
        if (data.data.type === "COMPILED_CODES") {
            console.log("编译结果:", data.data.data);
            setCompiledCode(data.data.data);
        }
    }, []);

    // 初始化 Worker 和事件监听
    useEffect(() => {
        // 创建 Worker 实例
        if (!compilerWorkerRef.current) {
            compilerWorkerRef.current = new compilerWorker();
            compilerWorkerRef.current.addEventListener('message', handleWorkerMessage);
        }

        // 添加消息监听
        window.addEventListener('message', handleMessage);

        // 清理函数
        return () => {
            window.removeEventListener('message', handleMessage);
            compilerWorkerRef.current?.removeEventListener('message', handleWorkerMessage);
            compilerWorkerRef.current?.terminate();
        };
    }, [handleMessage, handleWorkerMessage]);

    // 监听文件变化，触发编译
    useEffect(() => {
        const debouncedCompile = debounce(() => {
            compilerWorkerRef.current?.postMessage(files);
        }, DEBOUNCE_DELAY);

        debouncedCompile();

        // 清理防抖函数
        return () => {
            debouncedCompile.cancel();
        };
    }, [files]);

    // 处理选中文件变化
    useEffect(() => {
        const currentFile = files[selectedFileName];
        console.log("currentFile.language",currentFile.language)
        const isNonJsFile = currentFile.language === 'css' || currentFile.language === '"json"';
        
        // 根据文件类型设置不同的代码内容
        setBabelCode(isNonJsFile 
            ? "/*_NONE_*/" 
            : babelTransform(selectedFileName, currentFile.value, files)
        );
    }, [selectedFileName, files]);

    // 更新 iframe URL
    useEffect(() => {
        setIframeUrl(getIframeUrl(iframeRaw, files, compiledCode));
    }, [files[IMPORT_MAP_FILE_NAME].value, compiledCode, getIframeUrl, files]);

    // 渲染标签
    const renderTab = (type: TabType, label: string) => (
        <div 
            className={classNames(
                styles['tab-item'],
                selectedTab === type && styles.isActive
            )}
            onClick={() => setSelectedTab(type)}
        >
            {label}
        </div>
    );

    // 渲染内容区域
   const renderContent = () => {
    return (
        <>
            {/* 使用 CSS 控制显示/隐藏，而不是条件渲染 */}
            <div style={{ display: selectedTab === 'Preview' ? 'block' : 'none', height: '100%' }}>
                <iframe ref={iframeRef} className="w-full h-full" src={iframeUrl} />
            </div>
            <div style={{ display: selectedTab === 'JS' ? 'block' : 'none', height: '100%' }}>
                <Editor 
                    file={{
                        name: 'dist.js',
                        value: babelCode,
                        language: 'javascript'
                    }}
                    options={{
                        readOnly: true
                    }}
                />
            </div>
        </>
    );
};

    return (
        <div className="h-full">
            {/* 标签栏 */}
            <div className={styles.tabs}>
                {renderTab('Preview', 'Preview')}
                {renderTab('JS', 'JS')}
            </div>
            {/* 内容区域 */}
            <div className="w-full h-full">
                {renderContent()}
            </div>
            {/* 错误信息展示 */}
            <Message type="error" content={error} />
        </div>
    );
};

export default Preview;