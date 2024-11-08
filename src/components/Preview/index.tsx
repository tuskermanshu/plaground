/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react"
import { PlaygroundContext } from "../Playground/playgroundContext"
import { compiler } from './compiler';
import Editor from "../Editor";
import iframeRaw from "../../template/iframe.html?raw"
import { IMPORT_MAP_FILE_NAME } from "@/template";





const Preview = () => {


    const {files} =useContext(PlaygroundContext)
    const [compiledCode,setCompiledCode] = useState("")
    const [iframeUrl,setIframeUrl] = useState(getIframeUrl(iframeRaw))

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

    return (
        <div className=" h-full mt-16">
            <iframe className=" w-full h-full -mt-16" src={iframeUrl}></iframe>
            {/* <Editor file={{
                name:'dist.js',
                value:compiledCode,
                language:'javascript'
            }}></Editor> */}
        </div>
    )
}


export default Preview