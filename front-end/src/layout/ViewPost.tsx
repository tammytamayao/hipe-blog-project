import React from "react";
import { MainHeader } from "../components/headers/MainHeader";
import Post from "../components/posts/Post";
import Comments from "../components/comments/Comments";

const ViewPost = () => {

    return(
        <>
        <MainHeader/>
        <Post/>
        <section className="showPost-container"><Comments /></section>
        </>
    )
}

export default ViewPost;