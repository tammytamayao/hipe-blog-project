import React, { useState, useEffect} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {baseURL, client} from "../../config/AxiosConfig";
import NewComment from "./NewComment";
import Cookies from 'universal-cookie';

const Comments = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [comments, setComments] = useState<any[]>([]);

    const cookies = new Cookies();
    let user_token = cookies.get('user_token')

    const isTokenExpired= async () => {
      const headers = {'Authorization': 'Bearer '+user_token}
      const response: any = await client.get(baseURL+`/users/token_expired`,{headers: headers});
      if(response.status==200 && response.data.response=="expired"){
        cookies.set('user_token', response.data.new_token, { path: '/' });
      }
    }
     
    const getAllComments = async () => {
      await isTokenExpired();
      const headers = {'Authorization': 'Bearer '+ user_token}
      const response: any = await client.get(baseURL+`/posts/${params.id}/comments`,{headers: headers});
      if(response.status===200) {
        setComments(response.data)
      }
    }
  
    useEffect(() => {
      getAllComments();
    }, []);

    const deleteComment = async (comment_id:any) => {
        const response: any = await client.delete(baseURL+`/posts/${params.id}/comments/${comment_id}`);
          if(response.status===200) {
            alert('Comment deleted')
            window.location.reload();
            navigate(`/posts/${params.id}`)
          } else {
            alert('Post not deleted. Try Again.')
          }
      };
      
    const allComments = comments.map((comment, index) => (

      <div key={index} className="leading-relaxed mb-4">
        <p>{comment.body}<br/></p>  
        <span className="subheader-gray">By: insert email address</span>
        <hr/>

        <span className="subheader-container">
          <span className="flex-grow flex flex-col">
            <span className="subheader-gray">
              <Link to={`/posts/${params.id}/comments/${comment.id}/edit`}> Edit </Link>&nbsp;| &nbsp;
              <button type="button" className="btn btn-danger" onClick={() => deleteComment(comment.id)}> Delete </button>
          </span>
          </span>
        </span>

      </div>
    ));
    
    return(
      <>
        <section className="container flex justify-center px-3 py-3 mx-auto text-left">
          <div className="bg-gray-100 rounded-lg p-8 flex flex-col mx-5 my-5 w-full">
            <span><h1 className="sm:text-3xl mb-4 font-medium text-gray-900"><b>Comments</b></h1></span>
            <div>{allComments}</div>
            <div><NewComment/></div>
          </div>
        </section>
       </>

    )
}

export default Comments;