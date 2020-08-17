import React, { useState, useEffect, useContext} from 'react';
import { Button,Jumbotron, Card, Badge, InputGroup, InputGroupAddon, Input, Form} from 'reactstrap';
import { useHistory} from 'react-router-dom';
import { Image } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import {UserContext} from './Main';


function View() {
    const [blog, setBlog] = useState([]);
    const {state} = useContext(UserContext);
    const [comment, setComment] = useState([]);
    const history = useHistory();
    const [author, setAuthor] = useState([]);
    useEffect(()=>{
        axios.get('/blog/' + localStorage.getItem('blog_id')).then(res=>{
            setBlog(res.data);
            setAuthor(res.data.author);
            setComment(res.data.comments);
        });
    },[]);
    const blogDelete = (blogId)=>{
        axios.delete(`/blog/${blogId}`, {
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>{
           history.push('/blog');
        }).catch(err=>{
            alert(err);
        })
    }
    const commentDelete = (blogId,commentId)=>{
        axios.delete(`/blog/${blogId}/comment/${commentId}`, {
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>{
            history.push('/blog');
           history.push(`/blog/${blogId}`);
        }).catch(err=>{
            alert(err);
        })
    }
    const postComment = (message,blogId)=>{
        fetch(`/blog/${blogId}/comment`,{
            method: "POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer " + localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    message
                })
        }).then(res=>res.json())
        .then(data=>{
            setComment(data.comments)
            
        }).catch(err=>{
            console.log(err)
        })
    }

        return(
            <div className="container mt-5">
                <Jumbotron className="dark shadow-lg text-center">
                    <h3>{blog.title}</h3>
                <hr></hr>
                <div className="text-center">
                <Image className="img-fluid mb-3" src={blog.image} fluid />
                        <p>{blog.description}</p>
                    {author.username === state ? <div className="text-center">
                    <Button color="danger" style={{borderRadius: "20px"}} className="dark" onClick={()=>{ if (window.confirm('Are you sure you wish to delete this blog post?')) blogDelete(blog._id) } }>Delete</Button>
                    </div> : <div></div>}
                    <div className="text-right">
                        <Badge color="light" pill className="pills">Created at: {moment(blog.createdAt).utcOffset("+05:30").format('LLL')}</Badge>
                    </div>
                    <div className="text-right mt-3">
                        <Badge color="light" pill className="pills">Created by: {author.username} </Badge>
                    </div>
                </div>
                </Jumbotron>
                <Jumbotron className="shadow-lg text-center dark">
                    <h3>Comments</h3>
                <hr></hr>
                <div className="text-center">
                <Card body inverse style={{ maxHeight: "500px", overflow: "scroll" }} className="dark">
                  {comment.map(comment=>(
                    <div>
                        {state === comment.author.username ? 
                        <div  className="text-right" key={comment._id}>
                            <Badge color="light" pill className="pills">{comment.author.username} </Badge>
                            <div>
                                <Badge color="light" pill className="pills">{moment(comment.createdAt).utcOffset("+05:30").format('LLL')}</Badge>
                            </div>
                            
                            <div>
                                <Badge color="light" pill className="pills">{moment(comment.createdAt).utcOffset("+05:30").fromNow()}</Badge>
                            </div>
                            <div>
                                <h6>{comment.message}</h6>
                                {state ? <Button className="fa fa-trash fa-sm" size="sm" color="danger" onClick={()=>{ if (window.confirm('Are you sure you wish to delete this comment?')) commentDelete(blog._id, comment._id) } }></Button> : <div></div>}
                            </div>
                        </div>
                         : <div  className="text-left" key={comment._id}>
                         <Badge color="light" pill className="pills">{comment.author.username} </Badge>
                         <div>
                             <Badge color="light" pill className="pills">{moment(comment.createdAt).utcOffset("+05:30").format('LLL')}</Badge>
                         </div>
                         
                         <div>
                             <Badge color="light" pill className="pills">{moment(comment.createdAt).utcOffset("+05:30").fromNow()}</Badge>
                         </div>
                         <div>
                             <h6>{comment.message}</h6>
                             {!state ? <Button className="fa fa-trash fa-sm" size="sm" color="danger" onClick={()=>{ if (window.confirm('Are you sure you wish to delete this comment?')) commentDelete(blog._id, comment._id) } }></Button> : <div></div>}
                         </div>
                     </div>}
                    </div>
                    ))}
                        <Form onSubmit={(e)=>{
                            e.preventDefault()
                            postComment(e.target[0].value, blog._id)
                        }} className="mt-3">
                        <InputGroup>
                            <Input placeholder="Enter comment" type="text" name="comment"/>
                                <InputGroupAddon addonType="append">
                                    <Button size="xs" className="fa fa-send"></Button>
                                </InputGroupAddon>
                        </InputGroup>
                        </Form>
                </Card>
                </div>
                </Jumbotron>
            </div>
        )
}

export default View;