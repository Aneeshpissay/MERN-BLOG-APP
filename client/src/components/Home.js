import React, {useEffect, useState} from 'react';
import {Jumbotron, Button} from 'reactstrap';
import {useHistory} from 'react-router-dom';
function Home(){
    const history = useHistory();
    const [user, setUser] = useState([]);
    useEffect(()=>{
        const users = JSON.parse(localStorage.getItem('user'))
        setUser(users);
    },[]);
    const blogPage = ()=>{
        if(!user){
            history.push("/login");
        }
        else {
            history.push("/blog");
        }
    }
    return(
        <div className="container mt-5">
            <Jumbotron className="shadow-lg dark">
            <h3 className="text-center">This is a blog page</h3>
            <hr></hr>
            <div className="text-center">
            <Button color="primary" style={{borderRadius: "20px"}} className="dark" onClick={()=>blogPage()}>Go to Blog Page</Button>
            </div>
            </Jumbotron>
        </div>
    )
}

export default Home;