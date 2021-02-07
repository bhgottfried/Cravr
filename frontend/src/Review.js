import React from 'react';
import './Home.css';
//import { Navbar,  Nav} from 'rsuite';
import{
    Link
    
  } from "react-router-dom"
class reviewContainer extends React.Component{
//essentially scrollable list of reviews
}
class userRev extends React.Component{
    
}
export default function review(){
    return(
        <div className="Home">
            <nav>
                <ul id="nav">
                    <li><a href="/Home">Find</a></li>
                    <li><a href="/Review">Review</a></li>
                    <li><a href="/Prefrences">Prefrences</a></li>
                    <li><a href="#">About</a></li>
                </ul>
            </nav>
            <h1>Review</h1>
            <Link to="/">
               <button renderas="button"className="login-button">
                   <span>back</span>
               </button>
           </Link>
        </div>
        );
}