
import MonacoEditor, { EditorProps as monacoEditorProps, OnMount }  from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import { FC, useRef } from 'react';
import { createATA } from './ata';

interface EditorFile {
    name:string;
    value:string;
    language:string
}

interface EditorProps {
    file:EditorFile;
    onChange?:monacoEditorProps['onChange'];
    options?: editor.IStandaloneEditorConstructionOptions
}

const Editor:FC<EditorProps> = (props) => {

    const { file,onChange,options} = props

    const editorRef = useRef<unknown>(); // 编辑器实例
    const monacoRef = useRef<unknown>(); // monaco 实例

    if(file === undefined) return



    const handleEditorMount:OnMount = (editor,monaco) =>{

        editorRef.current = editor;
        monacoRef.current = monaco;

        // 添加编译器指令
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, ()=>{
            editor.getAction('editor.action.formatDocument')?.run()

            const actions = editor.getSupportedActions().map((a) => a.id);
            console.log(actions);
        
        })


        // 添加ts提示框
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            jsx:monaco.languages.typescript.JsxEmit.Preserve,
            esModuleInterop:true
        })

        // 通过ata检索代码中的ts文件下载对应的D.TS
        const ata = createATA((code,path) => {
            monaco.languages.typescript.typescriptDefaults.addExtraLib(code,`file://${path}`)
        })

        editor.onDidChangeModelContent(()=>{
            ata(editor.getValue())
        })

        ata(editor.getValue())
    }
    return (
        <MonacoEditor 
            className=' h-full' 
            value={file.value}
            path={file.name} 
            language={file.language} 
            options={
                {
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    minimap: {
                      enabled: false,
                    },
                    scrollbar: {
                      verticalScrollbarSize: 6,
                      horizontalScrollbarSize: 6,
                    },
                    ...options
                }
            }
            onMount={handleEditorMount}
            onChange={onChange}
        />
    )
}

export default Editor