import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import {baseURL, client} from "../config/AxiosConfig";

interface userState {
    email: string,
    password: string,
    password_confirmation: string;
    first_name: string;
    middle_name: string;
    last_name: string;
  }
  

const SignUp = () => {
    
    const cookies = new Cookies();
    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [firstName,setFirstName] = useState("");
    const [middleName,setMiddleName] = useState("");
    const [lastName,setLastName] = useState("");
    const navigate = useNavigate();
    const [user, setUser] = useState<userState>({
        email: "",
        password: "",
        password_confirmation:"",
        first_name:"",
        middle_name:"",
        last_name:""
      });
      
    const [errorMessage, setErrorMessage] = useState('');
    
    useEffect(() => {
        var user_token = cookies.get('user_token')
        if (user_token != null) {
            navigate("/userhome");
        }
      }, []);

    const onChange = (user: React.ChangeEvent<HTMLInputElement>, setFunction: { (value: React.SetStateAction<string>): void; (value: React.SetStateAction<string>): void;}) => {
        console.log("This is handleInputChange function");
        setFunction(user.target.value);
    }


    const onSubmit = async (post: React.FormEvent<HTMLFormElement>) => {
    
        post.preventDefault();
        const payload = {
            email: email,
            password: password,
            password_confirmation:confirmPassword,
            first_name: firstName,
            middle_name:middleName,
            last_name:lastName};
    
        const response: any = await client.post(baseURL+`/users/register`,payload);
          if(response.status!==200) {
            setErrorMessage('An error occurred.');
            return ;
          } 
          const res= response.data;
          setErrorMessage(res["response"]);
          if (res["response"] == "registration successful") {
              navigate("/login")
          }
      };

  return (
    <>
<style>{'body { background-image: url("background-log-in-002.jpg"); background-position: center;background-repeat: no-repeat;background-size: cover;backdrop-filter: blur(16px); background-attachment: fixed;}'}</style> 

<div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
<div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
    <img src="logo_typekita.png"/>

    <p className="error text-rose-600"> {errorMessage} </p>

    <form className="mt-6" onSubmit={onSubmit}>
        <div className="mb-2">
            <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-800"
            >
                Email
            </label>
            <input
                type="email"
                className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-black-400 focus:ring-black-300 focus:outline-none focus:ring focus:ring-opacity-40"
                id="email" value={email} onChange = {(e) => onChange(e, setEmail)} placeholder="Email" 
            />
        </div>


        <div className="mb-2">
            <label
                htmlFor="first_name"
                className="block text-sm font-semibold text-gray-800"
            >
                First Name
            </label>
            <input
                type="text"
                className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-black-400 focus:ring-black-300 focus:outline-none focus:ring focus:ring-opacity-40"
                id="firstName" value={firstName} onChange = {(e) => onChange(e, setFirstName)} placeholder="First Name" 
            />
        </div>

        
        <div className="mb-2">
            <label
                htmlFor="middle_name"
                className="block text-sm font-semibold text-gray-800"
            >
                Middle Name
            </label>
            <input
                type="text"
                className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-black-400 focus:ring-black-300 focus:outline-none focus:ring focus:ring-opacity-40"
                id="middleName" value={middleName} onChange = {(e) => onChange(e, setMiddleName)} placeholder="Middle Name" 
            />
        </div>

        
        <div className="mb-2">
            <label
                htmlFor="last_name"
                className="block text-sm font-semibold text-gray-800"
            >
                Last Name
            </label>
            <input
                type="text"
                className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-black-400 focus:ring-black-300 focus:outline-none focus:ring focus:ring-opacity-40"
                id="lastName" value={lastName} onChange = {(e) => onChange(e, setLastName)} placeholder="Last Name" 
            />
        </div>
        
        <div className="mb-2">
            <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-800"
            >
                Password
            </label>
            <input
                type="password"
                className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-black-400 focus:ring-black-300 focus:outline-none focus:ring focus:ring-opacity-40"
                id="password" value={password} onChange = {(e) => onChange(e, setPassword)} placeholder="Password" 
            />
        </div>
        
        <div className="mb-2">
            <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-800"
            >
                Confirm Password
            </label>
            <input
                type="password"
                className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-black-400 focus:ring-black-300 focus:outline-none focus:ring focus:ring-opacity-40"
                id="confirmPassword" value={confirmPassword} onChange = {(e) => onChange(e, setConfirmPassword)} placeholder="Confirm Password" 
            />
        </div>
        <div className="mt-6">
            <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-black rounded-md hover:bg-black focus:outline-none focus:bg-black">
                Sign Up
            </button>
        </div>
    </form>

    <p className="mt-8 text-xs font-light text-center text-gray-700">
        {" "}Don't have an account?{" "}
        <a href="#" className="font-medium text-black hover:underline">
            <Link to="/login">Log In</Link>
        </a>
    </p>
</div>
</div>

    </>
  )
}

export default SignUp;

