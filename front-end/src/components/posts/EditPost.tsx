import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {baseURL, client, filesURL} from "../../config/AxiosConfig";
import { decodeToken } from "react-jwt";
import Cookies from 'universal-cookie';

interface postState {
    id: number,
    user_id: number,
    title: string;
    body: string;
    image_url: string;
  }
  
const EditPost = () => {
  
    const navigate = useNavigate();
    const params = useParams();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const cookies = new Cookies();
    let user_token = cookies.get('user_token')
    const decodeUserToken = JSON.parse(JSON.stringify(decodeToken(user_token+"")));
    const [photo123, setphoto123] = useState<any | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
      const files = event.target.files;
      if (!event.target.files || event.target.files.length === 0) {
        console.error("Select a file");
        setphoto123(null);
        return;
      }
      setphoto123(URL.createObjectURL(event.target.files[0]));
    }

    const isTokenExpired= async () => {
      const headers = {'Authorization': 'Bearer '+user_token}
      const response: any = await client.get(baseURL+`/users/token_expired`,{headers: headers});
      if(response.status==200 && response.data.response=="expired"){
        cookies.set('user_token', response.data.new_token, { path: '/' });
      }
    }

    const getPost = async () => {
      await isTokenExpired();
      const headers = { 'Authorization': 'Bearer '+user_token }
      const response: any = await client.get(baseURL+`/posts/${params.id}`,{headers: headers});
      if(response.status===200) {
        setPost(response.data)
      }
    }
    
    useEffect(() => {
      getPost();
    },[]); 
   
    const [post, setPost]= useState<postState>({
        id: parseInt(params.id+""),
        user_id: parseInt(params.user_id+""),
        title:title,
        body:body,
        image_url:"",
      });

    const onChange = (post: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>, setFunction: { (value: React.SetStateAction<string>): void; (value: React.SetStateAction<string>): void;}) => {
        setFunction(post.target.value);
    };

    let titleDef = post.title;
    let bodyDef = post.body;

    const onSubmit = async (post: React.FormEvent<HTMLFormElement>) => {
        post.preventDefault();
        const file = post.currentTarget["fileInput"].files[0];
        await isTokenExpired();

        if (title.length > 0){titleDef = title}
        if (body.length > 0){bodyDef = body}
        const payload = {title: titleDef, body: bodyDef, user_id: decodeUserToken.user_id, token: user_token, image: file};
        const headers = {'Authorization': 'Bearer '+user_token, "Content-Type": `multipart/form-data: boundary=add-random-characters`}
        const response: any = await client.put(baseURL+`/posts/${params.id}/edit`,payload,{headers: headers});
          if(response.status!==200) {
            alert('Post not edited. Try Again.')
          } 
          const res= response.data;
          if (res["response"] != null) { 
            setErrorMessage(res["response"]);
            return
          }
          setPost(response.data);
          alert("Post Edited");
          navigate("/posts");
    }

    return (
      <div className="form-container">
        <form onSubmit={onSubmit} className="form-control">

          <h1 className="post-title">Edit Post</h1>
          <hr/>
                <div className="form-group">
                  <p className="error text-rose-600"> {errorMessage} </p>
                  <label htmlFor="postTitle" className="form-label">Title </label>
                  <input
                    type="text"
                    name="title"
                    className="form-input"
                    id="postTitle"
                    defaultValue={post.title}
                    onChange={(e) => onChange(e, setTitle)}
                  />
                </div>
    
                <div className="form-group">
                  <label htmlFor="postBody" className="form-label">Body </label>
                  <textarea
                    name="body"
                    rows={5}
                    className="form-input"
                    id="postBody"
                    defaultValue={post.body}
                    onChange={(e) => onChange(e, setBody)}
                  ></textarea>
                  {post.image_url && photo123 == null &&  <img className="img-view my-4" alt="sample" src={ filesURL +  post.image_url }/> }


                  {photo123 &&  <img  className="img-view my-4" src={photo123} /> }
                  <input id="fileInput"  type="file" accept="image/*" onChange={handleInputChange} />

                </div>
    
                <span className="flex justify-center"><button className="btn-secondary">Update Post</button></span>
                <span className="link-container">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" /></svg>
                  <Link to="/posts"> Back to Main</Link>
                </span>
    
        </form>
      </div>
    )
};

export default EditPost;

