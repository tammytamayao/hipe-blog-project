import React from "react";
import { MainHeader } from "../components/headers/MainHeader";
import NewPost from "../components/posts/NewPost";
import Provider from "../context/tokenContext";

const CreatePost = () => {

    return(
        <>
        <Provider>
        <MainHeader/>
        <NewPost/>
        </Provider>
        </>
    )
}

export default CreatePost;

