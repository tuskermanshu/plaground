import { FC, useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./index.module.scss"

export interface MessageProps {
    type:'error' | 'warn';
    content:string
}

 const Message:FC<MessageProps> = (props) => {
    const {type,content} = props
    const [visible,setVisible] = useState(false)


    useEffect(()=>{
        setVisible(!!content)
    },[content])

    return visible  ? (
        <div className={classNames(styles.msg,styles[type])}>
            <pre dangerouslySetInnerHTML={{
                __html:content
            }}></pre>
            <button className={styles.dismiss} onClick={()=>setVisible(false)}>X</button>
        </div>
    ) : null
}

export default Message