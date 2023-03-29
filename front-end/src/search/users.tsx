import React, { useState, useEffect} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {baseURL, client} from "../config/AxiosConfig";
import { decodeToken } from "react-jwt";
import Cookies from 'universal-cookie';

const Posts = () => {

  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const params = useParams();

  const cookies = new Cookies();
  let user_token = cookies.get('user_token')

  const isTokenExpired= async () => {
    const headers = {'Authorization': 'Bearer '+user_token}
    const response: any = await client.get(baseURL+`/users/token_expired`,{headers: headers});
    if(response.status==200 && response.data.response=="expired"){
      cookies.set('user_token', response.data.new_token, { path: '/' });
    }
  }

  const getSearchUsers = async () => {
    await isTokenExpired();
    const headers = {'Authorization': 'Bearer '+ user_token}
      const response: any = await client.get(baseURL+`/search/users/`+params.keyword,{headers: headers});
      if(response.status===200) {
        setPosts(response.data);
      }
  }

  useEffect(() => {
    getSearchUsers();
  },[]);

  const allPosts = posts.map((users, index) => (
    <div key={index} className="getAllPosts-container">
      <h1 className="post-title">{users.name}</h1>

        <div className="flex items-center flex-wrap pb-4 mb-4 border-b-2 border-gray-100 mt-auto w-full">
          <span className="link-container"><Link to={`/users/${users.id}`}> View User</Link><svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg></span>
          <div className="ml-auto pr-3 py-1">
           
          </div>
        </div>

        <span className="subheader-container">
          <span className="flex-grow flex flex-col">
            <span className="subheader-black">{users.first_name + " "+ users.last_name}</span>
            <span className="subheader-gray">{users.email}</span>
          </span>
        </span>

    </div>

  ));

  return (
    <>
      <div className="post-title-container"><h1 className="mainheader"><b> SEARCH Results for {params.keyword}</b></h1></div>
      <div className="btn-primary-container"><Link className="btn-primary" to={`/posts/new`}>Add New Post</Link></div>
      <hr/>
      <section><div className="container px-5 py-5 mx-auto">{allPosts}</div></section>
    </>
  );
};

export default Posts;

