
import { useContext } from 'react'
import styles from './index.module.scss'

import logo from "@/assets/icon/logo.svg"
import { PlaygroundContext } from '../Playground/playgroundContext'
import {  DownloadOutlined, MoonOutlined,ShareAltOutlined,SunOutlined,GithubOutlined } from '@ant-design/icons'
import copy from 'copy-to-clipboard'
import { message } from 'antd'
import { downloadFiles } from '@/utils'
import classNames from 'classnames'


const Header = () => {
    const {files,theme,setTheme} = useContext(PlaygroundContext)

    return (
        <div className={styles.header}>
            <div className={styles.logo}>
                <img alt='logo' src={logo}/>
                <span>React Playground</span>
            </div>
            <div>
                <GithubOutlined 
                    className=' ml-3'
                    onClick={ () => {
                        window.open('https://github.com/tuskermanshu', '_blank');
                    }}
                />
                {theme === 'light' && (
                    <MoonOutlined
                        title='切换暗色主题'
                        className={classNames(styles.theme,'ml-3')}
                        onClick={() => setTheme('dark')}
                    />
                )}
                {theme === 'dark' && (
                    <SunOutlined
                        title='切换亮色主题'
                        className={classNames(styles.theme,'ml-3')}
                        onClick={() => setTheme('light')}
                    />
                )}
                <ShareAltOutlined 
                    className=' ml-3'
                    onClick={() => {
                        copy(window.location.href);
                        message.success('分享链接已复制。')
                    }}
                />
                <DownloadOutlined 
                    className=' ml-3'
                    onClick={async () => {
                        await downloadFiles(files);
                        message.success('下载完成')
                    }}
                />
            </div>
        </div>
    )
}

export default Header