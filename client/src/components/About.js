import React from 'react';
import {Jumbotron} from 'reactstrap';

function About(){
    return(
        <div className="container mt-5">
            <Jumbotron className="shadow-lg dark">
            <h3 className="text-center">About Me</h3>
            <hr></hr>
            <div className="text-center">
            <img src="https://res.cloudinary.com/adv-blog/image/upload/v1597557086/aneesh_photo_uukusb.png" style={{width: 150, borderRadius: "50%"}} alt="Aneesh"/>
            <h5>I'm a full stack web developer using MERN Stack</h5>
            </div>
            </Jumbotron>
        </div>
    )
}

export default About;