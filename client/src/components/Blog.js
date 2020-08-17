import React, { useEffect, useState } from 'react';
import { Button,FormGroup,Input, Jumbotron, Card, CardImg, CardText, CardBody, Progress, CardSubtitle,
    CardTitle,Row, Col, Alert} from 'reactstrap';
import { Link,useHistory} from 'react-router-dom';
import axios from 'axios';

function Blog() {
    const [blogs, setBlogs] = useState([]);
    const [upload, setUpload] = useState("");
    const [visible, setVisible] = useState(false);
    const [alert, setAlert] = useState("");
    const onDismiss = () => {
        setVisible(false);
    }
    const [color, setColor] = useState("");
    const history = useHistory();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const [perc, setPerc] = useState(0);
    useEffect(()=>{
        fetch('/blog').then(res=>res.json()).then(blogs=>setBlogs(blogs));
    },[])
    useEffect(()=>{
        if(url){
         fetch('/blog',{
             method:"post",
             headers:{
                 "Content-Type":"application/json",
                 "Authorization":"Bearer " + localStorage.getItem("jwt")
             },
             body:JSON.stringify({
                 title,
                 description,
                 image: url
             })
         }).then(res=>res.json())
         .then(data=>{
     
            if(data.error){
                setAlert("Cannot post blog, authorization error")
            }
            else{
                history.push("/");
                history.push("/blog")
                setAlert("Blog post, successfully posted");
            }
         }).catch(err=>{
             setAlert("Cannot post blog, authorization error")
         })
     }
     },[url,description,history,title])
    
    const postDetails = ()=>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","blog-image")
        data.append("cloud_name","adv-blog")
        axios.post('https://api.cloudinary.com/v1_1/adv-blog/image/upload', data,{
            onUploadProgress: (ev) => {
                const progress = ev.loaded / ev.total * 100;
                const loading = Math.round(progress);
                setPerc(loading);
                if(loading === 100){
                    setColor("success");
                    setUpload("Please wait, while the data is being sent to the server");
                }
                else if(loading>75 && loading<=99){
                    setColor("");
                }
                else if(loading>50){
                    setColor("info");
                }
                else if(loading>25){
                    setColor("warning");
                }
                else if(perc === 0){
                    setColor("danger");
                }
            }
        })
             .then(res=>{
                 setUrl(res.data.secure_url);
                 setPerc(100);
             })
             .catch(err=>{
                setAlert("Cannot post blog, authorization error")
            })
    }
    return(
      <div className="container mt-5">
          <Alert color="primary" isOpen={visible} toggle={onDismiss} fade={false}>
                     {alert}
            </Alert>
        <Jumbotron className="dark shadow-lg">
            <h3 className="text-center"> Blog Page</h3>
            <hr></hr>
             <FormGroup>
                <Input type="text" name="title" id="title" placeholder="Enter your title" onChange={(e)=>setTitle(e.target.value)}/>
             </FormGroup>
            <FormGroup>
                <Input type="text" name="description" id="description" placeholder="Enter your description" onChange={(e)=>setDescription(e.target.value)}/>
            </FormGroup>
            <FormGroup>
                <Input type="file" name="image" id="exampleFile" onChange={(e)=>setImage(e.target.files[0])}/>
            </FormGroup>
            <div className="text-center">{perc}%</div>
                <Progress animated value={perc} color={color}>{upload}</Progress>
            <div className="text-center mt-3">
            <Button color="primary" style={{borderRadius: "20px"}} className="dark" onClick={()=>postDetails()}>Submit</Button>
            </div>
        </Jumbotron>
        <Row>
            {blogs.map(blog => (
                <Col sm="12" md="6" lg="4" className="mt-5 mb-2" key={blog._id}>
                <Card className="dark">
                    <CardImg top width="100%" src={blog.image} alt="Card image cap"/>
                        <CardBody>
                            <CardTitle className="text-center"><h5>{blog.title}</h5></CardTitle>
                                    <CardSubtitle> Created By: <strong>{blog.author.username}</strong></CardSubtitle>
                                <CardText>{blog.description}</CardText>
                            <div className="text-center">
                            <Link to={"/blog/" + blog._id}><Button color="info" style={{borderRadius: "20px"}} className="dark" onClick={blogView=>{
                                localStorage.setItem('blog_id', blog._id);
                            }}>View</Button></Link>
                            </div>
                        </CardBody>
                </Card>
            </Col>
             ))}
        </Row>
        </div>
        )
}

export default Blog;
