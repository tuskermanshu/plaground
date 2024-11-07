import styles from './index.module.scss'
import Editor from "../Editor/index"
import FileNameList from "../FileNameList/index"
import { useContext } from 'react'
import { PlaygroundContext } from '../Playground/playgroundContext'

import {debounce} from "lodash-es"


  const CodeEditor = () => {


  const {files,setFiles,setSelectedFileName,selectedFileName} = useContext(PlaygroundContext)

  const file = files[selectedFileName]

  const handleEditChange = (value,e) =>{
    console.log(value)
    console.log(e)
    files[file.name].value = value
    setFiles({...files})
  }

    return (
        <div className={styles.codeEditor}>
          <FileNameList />
          <Editor  file={file} onChange={debounce(handleEditChange,500) }/>
        </div>
    )
  }

  export default CodeEditor