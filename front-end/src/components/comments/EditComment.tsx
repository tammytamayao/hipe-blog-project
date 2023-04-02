import React, { useState, useEffect} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {baseURL, client} from "../../config/AxiosConfig";
import { decodeToken } from "react-jwt";
import { useTokenContext } from "../../context/tokenContext";

interface commentState {
    id: number,
    user_id: number,
    post_id: number,
    body: string
  }

const EditComment = () => {

    const navigate = useNavigate();
    const params = useParams();
    const [body, setBody] = useState("");

    const { user_token } = useTokenContext()
    const myDecodedToken = decodeToken(user_token+"");
    const decodeUserToken = JSON.parse( JSON.stringify(myDecodedToken));

    const getComment = async () => {
      const headers = { 'Authorization': 'Bearer '+user_token }
      const response: any = await client.get(baseURL+`/posts/${params.post_id}/comments/${params.id}`,{headers: headers});
      if(response.status===200) {
          setComment(response.data)
      }
    }
      
    useEffect(() => {
      getComment();
    },[]); 
     
    const [comment, setComment]= useState<commentState>({
        id: parseInt(params.id+""),
        user_id: parseInt(params.user_id+""),
        post_id: parseInt(params.post_id+""),
        body: body
    });
    
    const onChange = (comment: React.ChangeEvent<HTMLTextAreaElement>, setFunction: {(value: React.SetStateAction<string>): void;}) => {
        setFunction(comment.target.value);
    };
        
    let bodyDef = comment.body;
    
    const onSubmit = async (comment: React.FormEvent<HTMLFormElement>) => {
          
        comment.preventDefault();
        if (body.length > 0){bodyDef = body}
        const payload = {body: bodyDef, post_id: params.post_id, user_id: decodeUserToken.user_id, token: user_token};
        const headers = {'Authorization': 'Bearer '+user_token}
        const response: any = await client.put(baseURL+`/posts/${params.post_id}/comments/${params.id}/edit`,payload,{headers: headers});
            if(response.status===200) {
              setComment(response.data);
              alert("Comment Edited");
              navigate(`/posts/${params.post_id}`);
            } else {
              alert('Comment not edited. Try Again.')
            }
        }

    return (
      <div className="form-container">
        <form onSubmit={onSubmit} className="form-control">

          <h1 className="post-title">Edit Comment</h1>
          <hr/>

          <div className="form-group">
              <textarea
                rows={1}
                name="body"
                defaultValue={comment.body}
                id="commentBody"
                className="form-input"
                required
                onChange={(e) => onChange(e, setBody)}
              ></textarea>
          </div>
    
          <button type="submit" className="btn-primary">Update Comment</button> <br/>
            <span className="link-container">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" /></svg>
              <Link to={`/posts/${comment.post_id}`}> Back to Post</Link>
          </span>
    
        </form>
      </div>
    )
}

export default EditComment;

