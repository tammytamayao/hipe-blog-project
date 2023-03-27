import React, { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

const LogOut = () => {

  const cookies = new Cookies();
  const navigate = useNavigate();

  useEffect(() => {
    cookies.remove('user_token')
    navigate("/login");
  }, []);

  return (
    <></>
  );
};

export default LogOut;

