import React from "react";
import { MainHeader } from "../components/headers/MainHeader";
import Post from "../components/posts/Post";
import Comments from "../components/comments/Comments";
import Provider from "../context/tokenContext";

const ViewPost = () => {

    return(
        <>
        <Provider>
        <MainHeader/>
        <Post/>
        <section className="showPost-container"><Comments /></section>
        </Provider>
        </>
    )
}

export default ViewPost;

