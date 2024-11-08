import { Allotment } from "allotment";
import "allotment/dist/style.css";
import  "../../index.css"

import Header from "../Header";
import CodeEditor from "../CodeEditor";
import Preview from "../Preview";
import { useContext } from "react";
import { PlaygroundContext } from "./playgroundContext";
import classNames from "classnames";


const Playground = () => {

    const {theme} = useContext(PlaygroundContext)

    return (
        <div className={classNames(
            "h-lvh flex flex-col",
            theme
            )}>
            <Header />
            <Allotment defaultSizes={[100,100]}>
                <Allotment.Pane minSize={500}>
                    <CodeEditor />
                </Allotment.Pane>
                <Allotment.Pane minSize={500}>
                    <Preview />
                </Allotment.Pane>
            </Allotment>
        </div>
    )
}

export default Playground