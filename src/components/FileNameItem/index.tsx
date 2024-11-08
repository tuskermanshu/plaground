import { Popconfirm } from 'antd';
import styles from '../FileNameList/index.module.scss'

import classnames from 'classnames'
import React, { useState, useRef, useEffect, useContext } from 'react'
import { ENTRY_FILE_NAME } from '@/template';
import { PlaygroundContext } from '../Playground/playgroundContext';


export interface FileNameItemProps {
    value: string;
    isActive: boolean;
    isCreate:boolean;
    readonly:boolean;
    onEditComplete:(name:string) => void;
    onClick: () => void;
}

export const FileNameItem: React.FC<FileNameItemProps> = (props) => {
  const {
    value,
    readonly,
    isActive = false,
    isCreate,
    onClick,
    onEditComplete
  } = props

  const [name, setName] = useState(value);
  const [editing, setEditing] = useState(isCreate)
  const inputRef = useRef<HTMLInputElement>(null)

  const { removeFile,setSelectedFileName} = useContext(PlaygroundContext)

  useEffect(()=>{
    if(isCreate) {
        inputRef?.current?.focus()
    }
  },[isCreate])

  const handleDoubleClick = () => {
    setEditing(true)
    inputRef?.current?.focus()
  }

  const handleInputBlur = () => {
    setEditing(false)
    onEditComplete(name)
  }

  const handleDeleteTabsClick = (e:React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation()
    setSelectedFileName(ENTRY_FILE_NAME)
    removeFile(name)
  }

  return (
    <div
      className={classnames(styles['tab-item'], isActive ? styles.isActive : null)}
      onClick={onClick}
    >
        {
            editing ? (
                <input
                    ref={inputRef}
                    className={styles['tabs-item-input']}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleInputBlur}
                />
            ) : (
                <>
                    <div onDoubleClick={!readonly ? handleDoubleClick : ()=>{}}>{name}</div>
                    <span className=' ml-2 mt-1 flex'  >
                   {
                    !readonly ? 
                    <Popconfirm 
                        title="是否删除"
                        description="是否删除该文件？"
                        placement="top"
                        onConfirm={(e)=>handleDeleteTabsClick(e)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <svg width='12' height='12' viewBox='0 0 24 24'>
                            <line stroke='#999' x1='18' y1='6' x2='6' y2='18'></line>
                            <line stroke='#999' x1='6' y1='6' x2='18' y2='18'></line>
                        </svg>
                    </Popconfirm>
                         : null
                   } 
            </span>
            </>
            )
        }
    </div>
  )
}


