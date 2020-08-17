import React, { useState} from 'react';
import { Button,FormGroup,Input, Jumbotron, Alert } from 'reactstrap';
import { useHistory, useParams} from 'react-router-dom';
import axios from 'axios';


function Reset() {
    const [visible, setVisible] = useState(false);
    const [alert, setAlert] = useState("");
    const {token} = useParams();
    const onDismiss = () => {
        setVisible(false);
    }
    const [ formData, setFormData ] = useState({
        password: "",
        confirm: ""
    })
    const history = useHistory()
    const {password, confirm} = formData;
    const handleChange = password => e => {
        setFormData({...formData, [password]: e.target.value})
    }
    const handleSubmit = e => {
        axios.post(`/reset/${token}`,{
            password, confirm
        }).then(res=> {
            setFormData({
                ...formData,
                password: "",
                confirm: ""
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
            <h3 className="text-center">Reset Password</h3>
            <hr></hr>
                <FormGroup>
        <           Input type="password" name="password" placeholder="Enter your password" onChange={handleChange("password")}/>
                </FormGroup>
                <FormGroup>
                    <Input type="password" name="confirm"  placeholder="Confirm your password" onChange={handleChange("confirm")}/>
                </FormGroup>
                <div className="text-center">
                <Button color="primary" style={{borderRadius: "20px"}} className="dark" onClick={()=>handleSubmit()}> Reset Password</Button>
                </div>
            </Jumbotron>
        </div>
        )
}

export default Reset;