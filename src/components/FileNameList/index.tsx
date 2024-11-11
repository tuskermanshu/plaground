import styles from './index.module.scss'
import { useContext, useEffect, useState } from "react"
import { FileNameItem } from "../FileNameItem"
import { PlaygroundContext } from "../Playground/playgroundContext"
import { APP_COMPONENT_FILE_NAME, APP_CSS_FILE_NAME, ENTRY_FILE_NAME, IMPORT_MAP_FILE_NAME } from '@/template'

export default function FileNameList() {
    const { 
        files, 
        addFile, 
        updateFile, 
        selectedFileName,
        setSelectedFileName
    } = useContext(PlaygroundContext)

    const [tabs, setTabs] = useState([''])
    const [isCreate,setIsCreate] = useState(false)

    const readonlyFiles = [APP_COMPONENT_FILE_NAME,ENTRY_FILE_NAME,IMPORT_MAP_FILE_NAME,APP_CSS_FILE_NAME]

    useEffect(() => {
        setTabs(Object.keys(files))
        console.log("Object.keys(files)",Object.keys(files))
    }, [files])


   const handleEditComplete = (name:string,preName:string) =>{
    updateFile(preName,name);
    setSelectedFileName(name)
   }

   const handleAddTabClick = () => {
    addFile()
    setIsCreate(true)
   }


    return <div className={styles.tabs}>
        {
            tabs.map((item, index) => (
                <FileNameItem 
                    key={item + index}  
                    value={item} 
                    readonly={readonlyFiles.includes(item)}
                    isActive={selectedFileName === item} 
                    isCreate={isCreate }
                    onClick={() => setSelectedFileName(item)}
                    onEditComplete={(name:string)=>handleEditComplete(name,item)}
                />
                
            ))
        }
        <div className={styles.add} onClick={handleAddTabClick}>+</div>
    </div>
}
