import React, { useState } from 'react';
import { Button, FormGroup,Input, Jumbotron, Alert} from 'reactstrap';
import {useHistory} from 'react-router-dom';
import axios from 'axios';

function Contact() {
    const [visible, setVisible] = useState(false);
    const [alert, setAlert] = useState("");
    const onDismiss = () => {
        setVisible(false);
    }
    const [ formData, setFormData ] = useState({
        username: "",
        email: "",
        message: ""
    })
    const history = useHistory()
    const {username, email, message} = formData;
    const handleChange = text => e => {
        setFormData({...formData, [text]: e.target.value, [email]: e.target.value})
    }
    const contactPost = e => {
        axios.post('/contact',{
            username, email, message
        }).then(res=> {
            setFormData({
                ...formData,
                username: "",
                email: "",
                message: ""
            })
            history.push('/');
        }).catch(err=>{
            setVisible(true);
            setAlert("Authorization error");
        });
    }
        return(
            <div className="container mt-5">
                <Alert color="primary" isOpen={visible} toggle={onDismiss} fade={false}>
                    {alert}
                </Alert>
            <Jumbotron className="dark shadow-lg">
            <h3 className="text-center">Contact Us</h3>
            <hr></hr>
                <FormGroup>
                    <Input type="text" name="username" placeholder="Enter your username" onChange={handleChange("username")}/>
                </FormGroup>
                <FormGroup>
                    <Input type="email" name="email" placeholder="Enter your email" onChange={handleChange("email")}/>
                </FormGroup>
                <FormGroup>
                    <Input type="textarea" name="message" placeholder="Submit your feedback" rows="6" onChange={handleChange("message")}/>
                </FormGroup>
                <div className="text-center">
                <Button color="primary" onClick={()=>contactPost()}>Submit</Button>
                </div>
            </Jumbotron>
        </div>
        )
}

export default Contact;