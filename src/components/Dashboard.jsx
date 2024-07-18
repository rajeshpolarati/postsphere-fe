import React from 'react'
import { CgProfile } from "react-icons/cg";
import { FiHome, FiUsers,FiBookmark } from "react-icons/fi";
import "../styles/dashboard.css";
import Recommendation from './Recommendation';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const Dashboard = ({children}) => {
  const {loggedInUser} = useSelector(state => state.login);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  return (
    <div className='dashboard_page'>
        <div className='side_bar'>
        <div className="menu-options-hamburger">
            <div className="menu_option" onClick={()=> {
              dispatch({ type: 'RESET_DEFAULT_STATE' })
              navigate("/profile", {state: { userId: loggedInUser?.id }})
            }}><span><CgProfile/></span>&nbsp;&nbsp;Profile</div>
            <div className="menu_option" onClick={()=> {
              if(!window.location.pathname.startsWith('/home')){
                dispatch({ type: 'RESET_DEFAULT_STATE' })
                navigate("/home")
              }
            }}><span><FiHome/></span>&nbsp;&nbsp;Home</div>
            <div className="menu_option" onClick={()=> {
              if(!window.location.pathname.startsWith('/mynetwork')){
                dispatch({ type: 'RESET_DEFAULT_STATE' })
                navigate("/mynetwork")
              }
            }}><span><FiUsers/></span>&nbsp;&nbsp;Network</div>
            <div className="menu_option" onClick={()=> {
              if(!window.location.pathname.startsWith('/bookmarks')){
                dispatch({ type: 'RESET_DEFAULT_STATE' })
                navigate("/bookmarks")
              }
            }}><span><FiBookmark/></span>&nbsp;&nbsp;Bookmark</div>
        </div>
        </div>
        <div className='main_content' id="main_content">
            {children}
            {/* {
         !window.location.pathname.startsWith('/profile') && 
         <div className='right_content recommendation-inner'>
         { memoIz}
        </div>
        } */}
        </div>
        {
         !window.location.pathname.startsWith('/profile') && 
         <div className='right_content'>
         {<Recommendation/>}
        </div>
        }

    </div>
  )
}

export default Dashboard
