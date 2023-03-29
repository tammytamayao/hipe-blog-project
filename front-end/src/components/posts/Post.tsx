import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {baseURL, client, filesURL} from "../../config/AxiosConfig";
import Cookies from 'universal-cookie';

interface postState {
  id: number,
  title: string;
  body: string;
  image_url: string;
}

const Post = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [post, setPost]= useState<postState>({
    id: 0,
    title:"",
    body:"",
    image_url:"",
  });

  const cookies = new Cookies();
  let user_token = cookies.get('user_token')

  const isTokenExpired= async () => {
    const headers = {'Authorization': 'Bearer '+user_token}
    const response: any = await client.get(baseURL+`/users/token_expired`,{headers: headers});
    if(response.status==200 && response.data.response=="expired"){
      cookies.set('user_token', response.data.new_token, { path: '/' });
    }
  }

  const deletePost = async () => {
    const response: any = await client.delete(baseURL+`/posts/${params.id}`);
      if(response.status!==200) {
        alert('Post not deleted. Try Again.')
      } 
      alert('Post deleted')
      navigate("/posts")
  };

  const showPost = async () => {
    await isTokenExpired();
    const headers = {'Authorization': 'Bearer '+user_token }
    const response: any = await client.get(baseURL+`/posts/${params.id}`, {headers: headers});
    if(response.status===200) {
      setPost(response.data)
    }
  }

  useEffect(() => {
    showPost();
  },[]); 

  return (
    <div>
      <section className="showPost-container">
        <span className="post-title-container"><h1 className="post-title"><b>{post.title}</b></h1></span>
        <span className="subheader-gray">By: User Account Name</span>
        <span className="container px-5 py-5 mx-auto text-center"><p className="post-body">{ post.body }</p></span>
        {post.image_url &&   <img className="img-view" alt="sample" src={ filesURL +  post.image_url }/> }
        <div className="flex justify-center">
          <button className="btn-primary"><Link to="/posts"> Back </Link></button>
          <span className="pl-4"><button className="btn-primary bg-gray-100 text-gray-700 hover:bg-gray-200"><Link to={`/posts/${params.id}/edit`}> Edit </Link></button></span>
          <span className="pl-4"><button type="button" className="btn-primary bg-gray-500 hover:bg-red-600" onClick={deletePost}>Delete</button></span>
        </div>
      </section>
    </div>
  );
}

export default Post;

