import React from "react";
import { MainHeader } from "../components/headers/MainHeader";
import EditPost from "../components/posts/EditPost";
import Provider from "../context/tokenContext";

const UpdatePost = () => {

    return(
        <>
        <MainHeader/>
        <Provider>
        <EditPost/>
        </Provider>
        </>
    )
}

export default UpdatePost;

