import { Verify } from "crypto";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {baseURL, client} from "../config/AxiosConfig";

interface postState {
    id: number,
    userId: number,
    title: string;
    body: string;
  }
  
const VerifyEmail = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [token, setToken] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const getTokenValidity = async () => {
      const response: any = await client.get(baseURL+`/users/activation/${params.token}`);
      
      if(!(response.status===200)) {
        setErrorMessage('An error occurred.');
        return
      }
      const res= response.data;
      if (res["response"] != 'email verified') {
        setErrorMessage(res["response"]);
        return
      } 
      setSuccessMessage(res["response"]);
      setTimeout(redirectLogIn, 3000);
    }

    useEffect(() => {
      getTokenValidity();
    }, []);

    
    function redirectLogIn() {
      navigate("/login")
   }
   
    return (
      <>
      <style>{
          'body { background-image: url("../background-log-in-002.jpg"); background-position: center;background-repeat: no-repeat;background-size: cover;backdrop-filter: blur(16px); background-attachment: fixed;}'
      }</style>
                      
      <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl text-4xl">
          <p className="error text-rose-600"> {errorMessage} </p>
          <p className="error text-lime-600"> {successMessage} </p>
      </div>
      </div>
          </>
    )
};

export default VerifyEmail;

