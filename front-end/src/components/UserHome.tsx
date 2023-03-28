import React, { useEffect} from "react";
import { Link } from "react-router-dom";
import {baseURL, client} from "../config/AxiosConfig";
import { decodeToken } from "react-jwt";
import Cookies from 'universal-cookie';
import {MainHeader} from "../headers/MainHeader";

const UserHome = () => {

  const cookies = new Cookies();
  let user_token = cookies.get('user_token')
  
  const myDecodedToken = decodeToken(user_token+"");
  const decodeUserToken = JSON.parse( JSON.stringify(myDecodedToken) );

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
    <MainHeader/>
        <div className="p-5 md:p-16 lg:p-28">
            <div className="flex flex-col justify-center">
                <div className="flex flex-col mt-5">
                    <h1 className="text-4xl md:text-[50px] font-semibold">{ decodeUserToken.first_name +" " + decodeUserToken.middle_name + " " + decodeUserToken.last_name }</h1>
                    <p className="text-xl mt-2 md:mt-4 tracking-wide">{ decodeUserToken.email +"" }</p>
                </div>
                <p className="text-sm tracking-wide leading-7">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <div className="flex mt-10 space-x-5">
                <button className="bg-indigo-700 text-white px-6 py-2 hover:brightness-105 font-semibold"><Link to="/posts">View My Posts</Link></button>
                </div>
            </div>
        </div>           
    </>
  );
};

export default UserHome;

