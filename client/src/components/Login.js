import React, { useState, useContext} from 'react';
import { Button, FormGroup,Input, Jumbotron, Alert } from 'reactstrap';
import { Link, useHistory} from 'react-router-dom';
import axios from 'axios';
import {UserContext} from './Main';



function Login() {
    const [visible, setVisible] = useState(false);
    const [alert, setAlert] = useState("");
    const onDismiss = () => {
        setVisible(false);
    }
    const {dispatch} = useContext(UserContext)
    const [ formData, setFormData ] = useState({
        username: "",
        password: ""
    })
    const history = useHistory()
    const {username, password} = formData;
    const handleChange = text => e => {
        setFormData({...formData, [text]: e.target.value})
    }
    const handleSubmit = e => {
        axios.post('/login',{
            username, password
        }).then(res=> {
            setFormData({
                ...formData,
                username: "",
                password: ""
            })
            localStorage.setItem('jwt',res.data.token);
            localStorage.setItem('user',JSON.stringify(res.data.user));
            dispatch({type:"USER",payload:res.data.user});
            history.push('/');
        }).catch(err=>{
            setVisible(true);
            console.log(err)
            setAlert("Authorization error");
        });
    }
        return(
            <div className="container mt-5">
               <Alert color="primary" isOpen={visible} toggle={onDismiss} fade={false}>
                    {alert}
                </Alert>
                <Jumbotron className="dark shadow-lg">
                <h3 className="text-center">Login</h3>
                <hr></hr>
                    <FormGroup>
            <           Input type="text" name="username" id="username" placeholder="Enter your username" onChange={handleChange("username")}/>
                    </FormGroup>
                    <FormGroup>
                        <Input type="password" name="password1" id="password1" placeholder="Enter your password" onChange={handleChange("password")}/>
                    </FormGroup>
                    <div className="text-center">
                    <Button color="primary" style={{borderRadius: "20px"}} className="dark" onClick={()=>handleSubmit()}> Login</Button>
                    </div>
                <hr color="light"></hr>
                <div className="text-center mt-3">
                        <Link to="/forgot"><Button color="warning" style={{borderRadius: "20px"}} className="dark">Forgot Password</Button></Link>
                </div>
                </Jumbotron>
            </div>
            )
}

export default Login;