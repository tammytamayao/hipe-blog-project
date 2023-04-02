import React from "react";
import {MainHeader} from "../components/headers/MainHeader";
import Posts from "../components/posts/Posts";
import Provider from "../context/tokenContext";

const MyPosts = () => {
    return(
        <>
        <Provider>
        <MainHeader/>
        <Posts/>
        </Provider>
        </>
    )
}

export default MyPosts;

