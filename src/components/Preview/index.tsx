/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef, useState } from "react"
import { PlaygroundContext } from "../Playground/playgroundContext"
import { compiler } from './compiler';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Editor from "../Editor";
import Message from "../Message"
import iframeRaw from "../../template/iframe.html?raw"
import { IMPORT_MAP_FILE_NAME } from "@/template";
import FileNameList from "../FileNameList";


interface MessageData  {
    type:string;
    message:string
}



const Preview = () => {


    const {files} =useContext(PlaygroundContext)
    const [compiledCode,setCompiledCode] = useState("")
    const [iframeUrl,setIframeUrl] = useState(getIframeUrl(iframeRaw))
    const [error,setError] = useState('')

    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(()=>{
        const result = compiler(files)
        setCompiledCode(result)
    },[files])

    useEffect(()=>{
        setIframeUrl(getIframeUrl(iframeRaw))
    },[files[IMPORT_MAP_FILE_NAME].value,compiledCode])


    function getIframeUrl (iframeRaw:string){
        const res = iframeRaw.replace(
            `<script type="importmap"></script>`,
            `<script type="importmap">${files[IMPORT_MAP_FILE_NAME].value}</script>`
        ).replace(
            `<script type="module" id="appSrc"></script>`,
            `<script type="module" id="appSrc">${compiledCode}</script>`
        )
    
        return URL.createObjectURL(new Blob([res],{type:"text/html"}))
    }

    const handleMessage = (msg:MessageEvent<MessageData>) => {
       const {type,message} = msg.data

       if(type === 'ERROR')setError(message)
    }

    useEffect(()=>{
        window.addEventListener('message',handleMessage);

        return () => {
            window.removeEventListener('message',handleMessage)
        }
    })




    return (
        <div className=" h-full mt-16">
            <FileNameList />
            <iframe ref={iframeRef} className=" w-full h-full -mt-16" src={iframeUrl} />
            <Message type="error" content={error}/>
            {/* <Editor file={{
                name:'dist.js',
                value:compiledCode,
                language:'javascript'
            }}></Editor> */}
        </div>
    )
}


export default Preview