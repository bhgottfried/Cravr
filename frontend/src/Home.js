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
export function getCookie(key) {
    var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
}
export default function Home(){
    return(
        <div>         
            <nav>
                <ul id="nav">
                    <li><a href="/Home">Find</a></li>
                    <li><a href="/Review">Review</a></li>
                    <li><a href="/Preferences">Preferences</a></li>
                    <li><a href="#">About</a></li>
                </ul>
            </nav>

            <h1>{getCookie("Username")}</h1>
            <h1>{getCookie("Password")}</h1>
            <h1>Find</h1>
            <Link to="/">
               <button renderas="button"className="login-button">
                   <span>Back</span>
               </button>
           </Link>
        </div>
        );
}