import React, { useEffect, useContext, createContext, useReducer} from 'react';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import Login from './Login';
import Blog from './Blog';
import View from './View';
import Register from './Register';
import { Switch, Route, useHistory} from 'react-router-dom';
import {ThemeProvider} from "styled-components";
import { GlobalStyles } from "./Globalstyle";
import { lightTheme, darkTheme } from "./Themes";
import Forgot from './Forgot';
import  {useDarkMode} from "./useDarkMode"
import {Button} from 'reactstrap';
import {reducer,initialState} from '../reducers/userReducer'
import Verify from './Verify';
import Reset from './Reset';
export const UserContext = createContext()


const Routing = ()=>{
  const history = useHistory()
  const {dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user});
    }else{
      if(!history.location.pathname.startsWith('/reset') && !history.location.pathname.startsWith('/verify'))
           history.push('/login');
    }
  },[history,dispatch])
  return(
    <Switch>
      <Route exact path='/'><Home/></Route>
      <Route exact path='/contactus'><Contact/></Route>
      <Route exact path='/aboutme'><About/></Route>
      <Route exact path='/login'><Login/></Route>
      <Route exact path='/signup'><Register/></Route>
      <Route exact path="/verify"><Verify/></Route>
      <Route path="/reset/:token"><Reset/></Route>
      <Route exact path='/forgot'><Forgot/></Route>
      <Route exact path='/blog'><Blog/></Route>
      <Route exact path='/blog/:blogId'><View/></Route>
    </Switch>
  )
}

function Main() {
  const [state,dispatch] = useReducer(reducer,initialState);
  const [theme, themeToggler] = useDarkMode();
  const themeMode = theme === 'light' ? lightTheme : darkTheme;
  const themeText = theme === 'light' ? 'Dark' : 'Light';
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <ThemeProvider theme={themeMode}>
      <GlobalStyles/>
      <Header/>
        <div className="text-right mt-2 mr-2">
                <Button onClick={themeToggler} color="warning" style={{borderRadius: "20px"}} className="dark"> Switch to {themeText} Mode</Button>
        </div>
        <Routing/>
        <Footer/>
      </ThemeProvider>
    </UserContext.Provider>
  );
}

export default Main;