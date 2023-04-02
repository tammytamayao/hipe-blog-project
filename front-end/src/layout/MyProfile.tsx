import React from "react";
import UserHome from "../components/UserHome";
import {MainHeader} from "../components/headers/MainHeader";
import Provider from "../context/tokenContext";

const MyProfile = () => {
    return(
        <>
        <Provider>
        <MainHeader/>
        <UserHome/>
        </Provider>
        </>
    )
}

export default MyProfile;

