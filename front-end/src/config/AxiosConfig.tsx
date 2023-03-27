import axios from "axios";

const baseURL = process.env.REACT_APP_API_ACTIVE+`api/v1`;
const filesURL = process.env.REACT_APP_API_ACTIVE+`files/`;
const client = axios.create({
    baseURL: baseURL
});

export { baseURL, client, filesURL } 
