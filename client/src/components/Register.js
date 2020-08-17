import React, { useState } from 'react';
import { Button, FormGroup,Input, Jumbotron } from 'reactstrap';
import {useHistory} from 'react-router-dom';
import axios from 'axios';

function Register()  {
    const [ formData, setFormData ] = useState({
        username: "",
        email: "",
        password: ""
    })
    const history = useHistory();
    const {username, email, password} = formData;
    const handleChange = text => e => {
        setFormData({...formData, [text]: e.target.value})
    }
    const handleSubmit = e => {
        axios.post('/signup',{
            username, email, password
        }).then(res=> {
            setFormData({
                ...formData,
                username: "",
                email: "",
                password: ""
            })
            history.push("/login");
            alert("Please verify your account, before login")
        }).catch(err=>console.log(err))
    }
        return(
            <div className="container mt-5">
            <Jumbotron className="dark shadow-lg">
            <h3 className="text-center">Register</h3>
            <hr></hr>
            <FormGroup>
                <Input type="text" name="username" id="username" placeholder="Enter your username" onChange={handleChange("username")}/>
            </FormGroup>
            <FormGroup>
                <Input type="email" name="email" id="email" placeholder="Enter your email"  onChange={handleChange("email")}/>
            </FormGroup>
            <FormGroup>
                <Input type="password" name="password" placeholder="Enter your password"  onChange={handleChange("password")}/>
            </FormGroup>
            <div className="text-center">
                <Button color="primary" style={{borderRadius: "20px"}} className="dark" onClick={()=>handleSubmit()}>Register</Button>
            </div>
            </Jumbotron>
            
        </div>
        )
}

export default Register;