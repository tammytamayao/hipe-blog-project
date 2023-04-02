import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

 export const MainHeader = () => {
    const navigate = useNavigate();
    const cookies = new Cookies();

    const logOut = async () => {
      cookies.remove('user_token');
      await cookies.get('user_token')
      navigate("/login");
    };

    return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-3 flex-col md:flex-row items-center bg-indigo-500">

        {/* App Icon */}
        <span className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" stroke-Width="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl text-white font-semibold"><Link to="/myprofile">BlogPost</Link></span>
        </span>

        {/* Header Buttons */}
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <span className="btn-header">My Feed</span>         
          <span className="btn-header">Following</span>
          <span className="btn-header">Followers</span>
        </nav>

        {/* Logout Button */}
        <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0" onClick={logOut}>Log Out
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>

      </div>
    </header>
    )
}

