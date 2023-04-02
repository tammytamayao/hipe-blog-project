import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {baseURL, client} from "../../config/AxiosConfig";
import { decodeToken } from "react-jwt";
import { useTokenContext } from "../../context/tokenContext";

interface commentState {
    id: number,
    userId: number,
    post_id: number,
    body: string
  }

const NewComment = () => {

    const navigate = useNavigate();
    const params = useParams();
    const [body, setBody] = useState("");
    const [comment, setComment]= useState<commentState>({
      id: 0,
      userId: 0,
      post_id: 0,
      body:""
    });

    const { user_token } = useTokenContext()
  
    const onChange = (comment: React.ChangeEvent<HTMLTextAreaElement>, setFunction: { (value: React.SetStateAction<string>): void;}) => {
      setFunction(comment.target.value);
    };

    const onSubmit = async (comment: React.FormEvent<HTMLFormElement>) => {
        comment.preventDefault();
        const myDecodedToken = decodeToken(user_token+"");
        const decodeUserToken = JSON.parse( JSON.stringify(myDecodedToken) );
        const payload = {body: body, user_id: decodeUserToken.user_id, token: user_token};
        const headers = {'Authorization': 'Bearer '+user_token}
    
        const response: any = await client.post(baseURL+`/posts/${params.id}/comments/create`,payload,{headers: headers});
          if(response.status===200) {
            setComment(response.data);
            alert('New comment added');
            window.location.reload();
            navigate(`/posts/${params.id}`);
          } else {
            alert('Comment not added. Try Again.')
          }
    
      };

    return(
      <div>
        <div className="flex justify-center">
        <form onSubmit={onSubmit} className="bg-gray-100 rounded-lg flex flex-col w-full">

          <div className="form-group">
            <label htmlFor="commentBody" className="form-label">New Comment: </label>
              <textarea
                rows={1}
                name="body"
                id="commentBody"
                className="form-input"
                required
                onChange={(e) => onChange(e, setBody)}
              ></textarea>
          </div>
        
          <button type="submit" className="btn-primary">Add Comment</button> <br/>
        
        </form>
        </div>
      </div>
    )
}

export default NewComment;

