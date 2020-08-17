import React, { useState } from 'react';
import { Button, Form, FormGroup,Input, Jumbotron, Alert} from 'reactstrap';
import axios from 'axios';
import {useHistory} from 'react-router-dom';

function Forgot() {
    const [visible, setVisible] = useState(false);
    const [alert, setAlert] = useState("");
    const onDismiss = () => {
        setVisible(false);
    }
    const [ formData, setFormData ] = useState({
        email: ""
    })
    const history = useHistory()
    const {email} = formData;
    const handleChange = email => e => {
        setFormData({...formData, [email]: e.target.value})
    }
    const handleSubmit = e => {
        axios.post('/forgot',{
            email
        }).then(res=> {
            setFormData({
                ...formData,
                email: ""
            })
            history.push('/login');
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
            <h3 className="text-center">Forgot Password</h3>
            <hr></hr>
            <Form>
                <FormGroup>
        <           Input type="email" name="email" id="email" placeholder="Enter your email" onChange={handleChange("email")}/>
                </FormGroup>
                <div className="text-center">
                <Button color="primary" style={{borderRadius: "20px"}} className="dark" onClick={()=>handleSubmit()}>Reset Password</Button>
                </div>
            </Form>
            </Jumbotron>
        </div>
        )
}

export default Forgot;