 
/* eslint-disable react-refresh/only-export-components */
import { FC, useState } from "react";
import { PropsWithChildren } from "react";
import { createContext } from "react";
import { fileName2Language } from "../../utils/index";
import {initFiles} from "../../template/index.ts"


export interface File {
    name:string;
    value:string;
    language:string;
}

export interface Files {
    [key:string]:File;
}

export interface PlaygroundContext {
    files:Files;
    selectedFileName:string;
    setSelectedFileName:(fileName:string) => void;
    setFiles:(files:Files) => void;
    addFile:()=>void;
    removeFile: (fileName: string) => void;
    updateFile: (oldFieldName: string, newFieldName: string) => void;
}


export const PlaygroundContext = createContext<PlaygroundContext>({
    selectFileName: "App.tsx",
} as unknown as PlaygroundContext)


export const PlaygroundProvider:FC<object & PropsWithChildren> = (props) =>{
    const {children} = props
    const [files, setFiles] = useState<Files>(initFiles)
    const [selectedFileName,setSelectedFileName] = useState('App.tsx');
    const [fileCount, setFileCount] = useState(1);

    console.log("nitFiles['App.tsx']",initFiles['App.tsx'])
    const addFile = () => {
        files[`comp${fileCount}`] = {
            name:`comp${fileCount}`,
            language: "typescript",
            value: initFiles['App.tsx'].value as unknown as string
        };

        setFiles({ ...files });
        setFileCount(fileCount + 1); // 更新文件计数器
    }

    const removeFile = (name:string) => {
        delete files[name]
        setFiles({...files})
    }

    const updateFile = (oldFieldName: string, newFieldName: string) => {
        if (!files[oldFieldName] || newFieldName === undefined || newFieldName === null) return
        const { [oldFieldName]: value, ...rest } = files
        const newFile = {
          [newFieldName]: {
            ...value,
            language: fileName2Language(newFieldName),
            name: newFieldName,
          },
        }
        setFiles({
          ...rest,
          ...newFile,
        })
    }

    return (
        <PlaygroundContext.Provider value={{
            files,
            selectedFileName,
            setSelectedFileName,
            setFiles,
            addFile,
            updateFile,
            removeFile
        }}>
            {children}
        </PlaygroundContext.Provider>
    )
}