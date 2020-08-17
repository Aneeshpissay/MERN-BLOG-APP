import React,{useContext,useState} from 'react';
import { Nav, Navbar, NavbarBrand, NavbarToggler, Collapse, NavItem} from 'reactstrap';
import { useHistory, NavLink} from 'react-router-dom'
import {UserContext} from './Main';
import axios from 'axios';

const Header = ()=>{
     const [isNavOpen, setIsNavOpen] = useState(false);
     const {state,dispatch} = useContext(UserContext);
     const toggleNav = ()=>{
         setIsNavOpen(!isNavOpen);
     }
     const logoutUser = ()=> {
         axios.get('/logout').then(res=>{
             localStorage.clear();
             dispatch({type: "CLEAR"});
             history.push("/login");
         })
     }
     const history = useHistory();
     const renderList = ()=>{
       if(state){
           return [
                <Nav navbar key={1}>
                <NavItem>
                    <NavLink className="nav-link"  to='/'> Home</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className="nav-link" to='/blog'> Blog</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className="nav-link"  to='/contactus'> Contact Us</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className="nav-link" to='/aboutme'> About Me</NavLink>
                </NavItem>
                </Nav>,
                <Nav className="ml-auto" navbar key={2}>
                <NavItem>
                    <NavLink className="nav-link" to='/'> {state} </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className="nav-link" to='/login' onClick={()=>logoutUser()}> Logout</NavLink>
                </NavItem>
                </Nav>
           ]
       }else{
         return [
            <Nav navbar key={3}>
                <NavItem>
                    <NavLink className="nav-link"  to='/'> Home</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className="nav-link" to='/aboutme'> About Me</NavLink>
                </NavItem>
            </Nav>,
            <Nav className="ml-auto" navbar key={4}>
            <NavItem>
                <NavLink className="nav-link" to='/login'> Login</NavLink>
            </NavItem>
            <NavItem>
                <NavLink className="nav-link" to='/signup'> Register</NavLink>
            </NavItem>
            </Nav>
         ]
       }
     }
    return(
        <Navbar expand="md" dark>
        <NavbarBrand className="mr-auto">Blog App</NavbarBrand>
        <NavbarToggler onClick={toggleNav} />
        <Collapse isOpen={isNavOpen} navbar>
             {renderList()}
        </Collapse>
        </Navbar>
    )
}


export default Header;