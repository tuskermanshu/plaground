
import styles from './index.module.scss'

import logo from "@/assets/icon/logo.svg"


const Header = () => {

    return (
        <div className={styles.header}>
            <div className={styles.logo}>
                <img alt='logo' src={logo}/>
                <span>React Playground</span>
            </div>
        </div>
    )
}

export default Header