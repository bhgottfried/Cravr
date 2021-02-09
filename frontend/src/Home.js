import React from 'react';
import './Home.css';
//import { Navbar,  Nav} from 'rsuite';
import{
    Link
    
  } from "react-router-dom"
class RestaurantContainer extends React.Component{
//essentially scrollable list of restaurants
}
class Restaurant extends React.Component{
    
}
export default function Home(){
    return(
        <div className="Home">
            <nav>
                <ul id="nav">
                    <li><a href="/Home">Find</a></li>
                    <li><a href="/Review">Review</a></li>
                    <li><a href="/Preferences">Preferences</a></li>
                    <li><a href="#">About</a></li>
                </ul>
            </nav>
            <h1>Home</h1>
            <Link to="/">
               <button renderas="button"className="login-button">
                   <span>Back</span>
               </button>
           </Link>
        </div>
        );
}