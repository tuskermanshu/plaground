import Playground from "./components/Playground"
import  "./App.scss"
import { PlaygroundProvider } from './components/Playground/playgroundContext';


function App() {

    return (
        <PlaygroundProvider>
            <Playground></Playground>
        </PlaygroundProvider>
    )
}

export default App