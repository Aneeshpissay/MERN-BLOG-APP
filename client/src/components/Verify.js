import React, { useState} from 'react';
import { Button, FormGroup,Input, Jumbotron, Alert } from 'reactstrap';
import { useHistory} from 'react-router-dom';
import axios from 'axios';


function Verify() {
    const [visible, setVisible] = useState(false);
    const [alert, setAlert] = useState("");
    const onDismiss = () => {
        setVisible(false);
    }
    const [ formData, setFormData ] = useState({
        email: "",
        verifyEmail: ""
    })
    const history = useHistory()
    const {email, verifyEmail} = formData;
    const handleChange = text => e => {
        setFormData({...formData, [text]: e.target.value})
    }
    const handleSubmit = e => {
        axios.post('/verify',{
            email, verifyEmail
        }).then(res=> {
            setFormData({
                ...formData,
                email: "",
                verifyEmail: ""
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
            <h3 className="text-center">Verify your Account</h3>
            <hr></hr>
                <FormGroup>
        <           Input type="email" name="email" placeholder="Enter your email" onChange={handleChange("email")}/>
                </FormGroup>
                <FormGroup>
                    <Input type="text" name="verifyEmail" placeholder="Enter your token" onChange={handleChange("verifyEmail")}/>
                </FormGroup>
                <div className="text-center">
                <Button color="primary" style={{borderRadius: "20px"}} className="dark" onClick={()=>handleSubmit()}> Verify</Button>
                </div>
            </Jumbotron>
        </div>
        )
}

export default Verify;