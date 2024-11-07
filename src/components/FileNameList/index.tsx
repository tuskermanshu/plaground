import { useContext, useEffect, useState } from "react"
import { PlaygroundContext } from "../Playground/playgroundContext"

import {  Tabs } from 'antd';

interface TabsStruct {
    key:string;
    label: string;
}

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const FileNameList = () => {
    const {files,removeFile,addFile,updateFile,selectedFileName,setSelectedFileName} = useContext(PlaygroundContext)

    const [tabs,setTabs] = useState<TabsStruct[]>([])

    useEffect(()=>{
       const result = Object.keys(files).map(item => {
            return {
                key:item,
                label:item
            }
        })
        setTabs(result)
    },[files])




    const handleFileClick = (fileName:string) => {
        setSelectedFileName(fileName)
    }

    const handleFileEdit = (targetKey:TargetKey,action:'add' | 'remove') => {
        if(action === 'add'){
            addFile()

        }else{
            removeFile(targetKey as string)
        }
    }



    return (
        <div>
            <Tabs     
            type="editable-card"
            size="small"
            onChange={handleFileClick}
            activeKey={selectedFileName}
            onEdit={handleFileEdit}
            items={tabs} 
            />
        </div>
    )
}

export default FileNameList