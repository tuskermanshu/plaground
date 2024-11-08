 
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
    const { children } = props;
    const [files, setFiles] = useState<Files>(initFiles);
    const [selectedFileName, setSelectedFileName] = useState("App.tsx");
    const [fileCount, setFileCount] = useState(1);
    const [availableFileNumbers, setAvailableFileNumbers] = useState<number[]>([]);

    const addFile = () => {
        // Determine the new file number to use
        const newFileNumber =
            availableFileNumbers.length > 0
                ? availableFileNumbers.shift()!
                : fileCount;

        files[`comp${newFileNumber}`] = {
            name: `comp${newFileNumber}`,
            language: "typescript",
            value: initFiles["App.tsx"].value as unknown as string,
        };

        setFiles({ ...files });
        setAvailableFileNumbers([...availableFileNumbers]); // update state for available numbers

        // If we used fileCount, increment it for future files
        if (newFileNumber === fileCount) {
            setFileCount(fileCount + 1);
        }
    };

    const removeFile = (name: string) => {
        // Extract the number from the file name (e.g., "comp3" -> 3)
        const fileNumber = parseInt(name.replace("comp", ""), 10);
        if (!isNaN(fileNumber)) {
            setAvailableFileNumbers([...availableFileNumbers, fileNumber].sort((a, b) => a - b));
        }
        delete files[name];
        setFiles({ ...files });
    };
    
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