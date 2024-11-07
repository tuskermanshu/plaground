import styles from './index.module.scss'
import Editor from "../Editor/index"
import FileNameList from "../FileNameList/index"


  const CodeEditor = () => {

    const file = {
      name: 'test.tsx',
      value: 'import lodash from "lodash";\n\nconst a = <div>test</div>',
      language: 'typescript'
  }

  const handleEditChange = (arg,e) =>{
    console.log(arg)
    console.log(e)
  }

    return (
        <div className={styles.codeEditor}>
          <FileNameList />
          <Editor  file={file} onChange={handleEditChange}/>
        </div>
    )
  }

  export default CodeEditor