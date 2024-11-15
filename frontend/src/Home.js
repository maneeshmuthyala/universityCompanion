import {Component} from 'react'
import {Link} from 'react-router-dom'

class Home extends Component{
    render(){
        return(
            <div>
                <Link to="/courses">
                <button>See Courses</button>
                </Link>
                <Link to="/assignments"><button>See Assignments</button>
                </Link>
                
            </div>
        )
    }
}
export default Home