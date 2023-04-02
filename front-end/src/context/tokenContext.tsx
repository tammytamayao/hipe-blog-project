import React, { createContext, useContext, useState, useEffect} from "react"
import {baseURL, client} from "../config/AxiosConfig";
import Cookies from 'universal-cookie';

export type userTokenContent = {
  user_token: string
  setUserToken:(c: string) => void
}

export const MyTokenContext = createContext<userTokenContent>({
    user_token: '',
    setUserToken: () => {},
})

export default function Provider({children}:any) {
    const cookies = new Cookies();
    const [user_token, setUserToken] = useState<string>(cookies.get('user_token'))
    const headers = {'Authorization': 'Bearer '+user_token}

    const isTokenExpired = async (user_token:string) => {
        const cookies = new Cookies();
        const response: any = await client.get(baseURL+`/users/token_expired`,{headers: headers});
        if(response.status===200 && response.data.response==="expired"){
          cookies.set('user_token', response.data.new_token, { path: '/' });
          return cookies.get('user_token')
        } else {
            return response.data.response
        }
    }

    const validateToken = async () => {
        const payloadToken = {token: user_token};
        const response: any = await client.post(baseURL+`/users/requirejwt`, payloadToken,{headers:headers});
        if(response.status!==204) {
            const token = await isTokenExpired(user_token);
            if(token!=='active') {
                setUserToken(cookies.get('user_token'))
            }
        }
    }

    useEffect(() => {
    validateToken();
    },[]);
  
  return (
    <MyTokenContext.Provider value= {{ user_token, setUserToken }}>
      {children}
    </MyTokenContext.Provider>
  ) 
}

export const useTokenContext = () => useContext(MyTokenContext)

