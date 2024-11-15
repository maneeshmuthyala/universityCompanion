import './App.css'
import Courses from './courses'
import Home from './Home'
import Assignments from './Assignments'
import {BrowserRouter,Routes,Route} from "react-router-dom"

const App = ()=> {

    return (
      <div>
        <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home/>}></Route>
          <Route path="/courses" element={<Courses/>}></Route>
          <Route path="/assignments" element={<Assignments/>}></Route>
        </Routes>
        </BrowserRouter>
      </div>
    )
  }
 

export default App