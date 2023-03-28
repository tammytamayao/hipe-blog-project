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

  const likePost = async (post:any) => {
    await isTokenExpired();
    const decodeUserToken = JSON.parse( JSON.stringify(decodeToken(user_token+"")));
    const payload = {post_id:post.id, user_id: decodeUserToken.user_id, token: user_token};
    const headers = {'Authorization': 'Bearer '+ user_token}
    const response: any = await client.post(baseURL+`/posts/${post.id}/likers/create`,payload,{headers: headers});
    if(response.status==200 && response.data.result!=='liked') {
      navigate("/posts")
      alert('Post liked');
      window.location.reload();
    } else {
      const like = response.data.likeData[0]
      unlikePost(like);
    }
  }

  const unlikePost = async (like:any) => {
    await isTokenExpired();
    const decodeUserToken = JSON.parse( JSON.stringify(decodeToken(user_token+"")));
    const payload = {post_id:like.post_id,user_id: decodeUserToken.user_id, token: user_token};
    const headers = {'Authorization': 'Bearer '+ user_token}
    const response: any = await client.put(baseURL+`/posts/${like.post_id}/likers/${like.id}/destroy`,payload,{headers: headers});
    if(response.status==200) {
      alert("post unliked");
      window.location.reload();
    }
  }  

  const getSearchPosts = async () => {
    await isTokenExpired();
    const headers = {'Authorization': 'Bearer '+ user_token}
      const response: any = await client.get(baseURL+`/search/posts/`+params.keyword,{headers: headers});
      if(response.status===200) {
        setPosts(response.data);
      }
  }

  useEffect(() => {
    if(window.location.toString().includes("/posts") === false ) {
      window.location.replace(("/posts"));
    }
    getSearchPosts();
  },[]);

  const allPosts = posts.map((post, index) => (
    <div key={index} className="getAllPosts-container">
      <h1 className="post-title">{post.title}</h1>
      <p className="post-body">{post.body.length > 250 ?`${post.body.substring(0, 250)}...` : post.body}</p>

        <div className="flex items-center flex-wrap pb-4 mb-4 border-b-2 border-gray-100 mt-auto w-full">
          <span className="link-container"><Link to={`/posts/${post.id}`}> View Post</Link><svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg></span>
          <div className="ml-auto pr-3 py-1">
            {/* Like Icon  */}
            <span className="icon-container">
            <svg className="icon" type="button" onClick={()=>likePost(post)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M1 8.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5zM11 3V1.7c0-.268.14-.526.395-.607A2 2 0 0114 3c0 .995-.182 1.948-.514 2.826-.204.54.166 1.174.744 1.174h2.52c1.243 0 2.261 1.01 2.146 2.247a23.864 23.864 0 01-1.341 5.974C17.153 16.323 16.072 17 14.9 17h-3.192a3 3 0 01-1.341-.317l-2.734-1.366A3 3 0 006.292 15H5V8h.963c.685 0 1.258-.483 1.612-1.068a4.011 4.011 0 012.166-1.73c.432-.143.853-.386 1.011-.814.16-.432.248-.9.248-1.388z" />
            </svg> { post.likes==null ? 0 : post.likes}
            </span>
            {/* Comment Icon  */}  
            <span className="icon-container">
              <svg className="icon" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
              </svg>6
            </span>
          </div>
        </div>

        <span className="subheader-container">
          <span className="flex-grow flex flex-col">
            <span className="subheader-black">User Account Name</span>
            <span className="subheader-gray">insert email address</span>
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

