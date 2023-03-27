import React, { useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import {baseURL, client} from "../config/AxiosConfig";
import { decodeToken } from "react-jwt";
import Cookies from 'universal-cookie';

const UserHome = () => {
  

  const navigate = useNavigate();

  const cookies = new Cookies();
  let user_token = cookies.get('user_token')
  
  const myDecodedToken = decodeToken(user_token+"");
  const decodeUserToken = JSON.parse( JSON.stringify(myDecodedToken) );
  
  const logOut = () => {
    navigate("/logout");
  };

  const payloadToken = {token: user_token};

  const validateToken = async () => {
    const response: any = await client.post(baseURL+`/users/requirejwt`, payloadToken);
    if(response.status===200) {
      const res= response.data;
      console.log(res);
    } 
  }

  useEffect(() => {
    validateToken();
  },[]);

  return (
    <>
        <Link to="/posts">GO TO POSTS</Link>
        <h1>Welcome</h1>
        <hr/>
        <div> User Token: { user_token } </div>
        <div> User ID: { decodeUserToken.user_id +"" } </div>
        <div> Email: { decodeUserToken.email +"" } </div>
        <div> Name: { decodeUserToken.first_name +" " + decodeUserToken.middle_name + " " + decodeUserToken.last_name } </div>
        <button onClick={logOut}>Log Out</button>
    </>
  );
};

export default UserHome;

