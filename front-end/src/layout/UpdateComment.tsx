import React from "react";
import { MainHeader } from "../components/headers/MainHeader";
import EditComment from "../components/comments/EditComment";
import Provider from "../context/tokenContext";

const UpdateComment = () => {

    return(
        <>
        <MainHeader/>
        <Provider>
        <EditComment/>
        </Provider>
        </>
    )
}

export default UpdateComment ;

