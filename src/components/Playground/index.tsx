import { Allotment } from "allotment";
import "allotment/dist/style.css";

import Header from "../Header";
import CodeEditor from "../CodeEditor";
import Preview from "../Preview";


const Playground = () => {
    return (
        <div className="h-lvh">
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