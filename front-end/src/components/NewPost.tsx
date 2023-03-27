import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {baseURL, client} from "../config/AxiosConfig";
import { decodeToken } from "react-jwt";
import Cookies from 'universal-cookie';

interface postState {
  id: number,
  user_id: number,
  title: string,
  body: string;
}

const NewPost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [post, setPost]= useState<postState>({
    id: 0,
    user_id: 0,
    title:"",
    body:""
  });

  const cookies = new Cookies();
  let user_token = cookies.get('user_token')
  const [photo123, setphoto123] = useState<any | null>(null);
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!event.target.files || event.target.files.length === 0) {
      console.error("Select a file");
      setphoto123(null);
      return;
    }
    setphoto123(URL.createObjectURL(event.target.files[0]));
  }

  const [errorMessage, setErrorMessage] = useState('');

  const isTokenExpired= async () => {
    const headers = {'Authorization': 'Bearer '+user_token}
    const response: any = await client.get(baseURL+`/users/token_expired`,{headers: headers});
    if(response.status==200 && response.data.response=="expired"){
      cookies.set('user_token', response.data.new_token, { path: '/' });
    }
  }

  const onChange = (post: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> , setFunction: { (value: React.SetStateAction<string>): void; (value: React.SetStateAction<string>): void;}) => {
    setFunction(post.target.value);
  };

  const onSubmit = async (post: React.FormEvent<HTMLFormElement>) => {
    post.preventDefault();
    const file = post.currentTarget["fileInput"].files[0];
    await isTokenExpired();
    const decodeUserToken = JSON.parse( JSON.stringify(decodeToken(user_token+"")));

    const payload = {title: title, body: body, user_id: decodeUserToken.user_id, token: user_token, image: file};
    const headers = {'Authorization': 'Bearer '+user_token, "Content-Type": `multipart/form-data: boundary=add-random-characters`}

    const response: any = await client.post(baseURL+`/posts/create`,payload,{headers: headers});
      if(response.status===200) {
        const res= response.data;
        if (res["response"] != null) { 
          setErrorMessage(res["response"]);
          return
        }

        setPost(response.data);
        alert('New post added');
        navigate("/posts");
      } else {
        alert('Post not added. Try Again.')
      }

  };

  return (
    <div className="form-container">
    <form onSubmit={onSubmit} className="form-control">

      <h1 className="post-title">New Post</h1>
      <hr/>

          <div className="form-group">
            <p className="error text-rose-600"> {errorMessage} </p>
            <label htmlFor="postTitle" className="form-label">Title </label>
            <input
              type="text"
              name="title"
              id="postTitle"
              className="form-input"
              
              onChange={(e) => onChange(e, setTitle)}
            />
            </div>    

          <div className="form-group">
            <label htmlFor="postBody" className="form-label">Body </label>
            <textarea
              rows={5}
              name="body"
              id="postBody"
              className="form-input"
              
              onChange={(e) => onChange(e, setBody)}
            ></textarea>
            
            {photo123 &&  <img  className="img-view my-4" src={photo123} /> }
            <input id="fileInput"  type="file" accept="image/*" onChange={handleInputChange} />

          </div>

          <span className="flex justify-center"><button className="btn-secondary">Create Post</button></span>
          <span className="link-container">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" /></svg>
            <Link to="/posts"> Back to Main</Link>
          </span>

    </form>
    </div>

  );
};

export default NewPost;

