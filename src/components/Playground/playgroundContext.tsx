/* eslint-disable react-refresh/only-export-components */
import { FC, useEffect, useState } from "react";
import { PropsWithChildren } from "react";
import { createContext } from "react";
import { fileName2Language } from "../../utils/index";
import { initFiles } from "../../template/index.ts";
import { strFromU8, strToU8, unzlibSync, zlibSync } from "fflate";

export type Theme = 'light' | 'dark'

export interface File {
    name: string;
    value: string;
    language: string;
}

export interface Files {
    [key: string]: File;
}

export interface PlaygroundContext {
    theme:Theme;
    setTheme:(theme:Theme)=>void;
    files: Files;
    selectedFileName: string;
    setSelectedFileName: (fileName: string) => void;
    setFiles: (files: Files) => void;
    addFile: () => void;
    removeFile: (fileName: string) => void;
    updateFile: (oldFieldName: string, newFieldName: string) => void;
}

export const PlaygroundContext = createContext<PlaygroundContext>({
    selectFileName: "App.tsx",
} as unknown as PlaygroundContext);


export const getFilesFromUrl = () => {
    try {
        const url = window.location.hash.slice(1)
        const hash = deCompress(url)
        return JSON.parse(hash)
    } catch (error) {
        console.log("hash 解构失败",error)
    }
}

export const enCompress = (data:string) => {
    const buffer = strToU8(data);
    const zipped = zlibSync(buffer,{level:9});
    const binary = strFromU8(zipped,true)
    return btoa(binary)
}

export const deCompress = (base64:string) => {
    const binary = atob(base64);

    const buffer = strToU8(binary,true)
    const unzipped = unzlibSync(buffer)
    return strFromU8(unzipped)
}

export const PlaygroundProvider: FC<object & PropsWithChildren> = (props) => {
    const { children } = props;
    const [files, setFiles] = useState<Files>(getFilesFromUrl() || initFiles);
    const [selectedFileName, setSelectedFileName] = useState("App.tsx");
    const [fileCount, setFileCount] = useState(1);
    const [availableFileNumbers, setAvailableFileNumbers] = useState<number[]>([]);
    const [theme,setTheme] = useState<Theme>(window.localStorage.getItem('theme')as Theme || 'light')


    useEffect(()=>{
        const hash = enCompress(JSON.stringify(files)) 
        window.location.hash = hash
    },[files])


    useEffect(()=>{
        window.localStorage.setItem('theme',theme)
    },[theme])

    const addFile = () => {
        // Use the first available number if any, otherwise increment fileCount
        const newFileNumber =
            availableFileNumbers.length > 0
                ? availableFileNumbers.shift()!
                : fileCount;

        // Add the new file with determined file number
        files[`comp${newFileNumber}.tsx`] = {
            name: `comp${newFileNumber}.tsx`,
            language: "typescript",
            value: initFiles["App.tsx"].value as string,
        };

        setFiles({ ...files });
        setAvailableFileNumbers([...availableFileNumbers]); // Update the available numbers

        // Only increment fileCount if we're not reusing a deleted file number
        if (newFileNumber === fileCount) {
            setFileCount(fileCount + 1);
        }
    };

    const removeFile = (name: string) => {
        const fileNumber = parseInt(name.replace("comp", ""), 10);
        if (!isNaN(fileNumber)) {
            setAvailableFileNumbers(
                [...availableFileNumbers, fileNumber].sort((a, b) => a - b)
            );
        }
        delete files[name];
        setFiles({ ...files });
    };

    const updateFile = (oldFieldName: string, newFieldName: string) => {
        if (!files[oldFieldName] || newFieldName === undefined || newFieldName === null) return;
        const { [oldFieldName]: value, ...rest } = files;
        const newFile = {
            [newFieldName]: {
                ...value,
                language: fileName2Language(newFieldName),
                name: newFieldName,
            },
        };
        setFiles({
            ...rest,
            ...newFile,
        });
    };






    return (
        <PlaygroundContext.Provider
            value={{
                files,
                theme,
                setTheme,
                selectedFileName,
                setSelectedFileName,
                setFiles,
                addFile,
                updateFile,
                removeFile,
            }}
        >
            {children}
        </PlaygroundContext.Provider>
    );
};
