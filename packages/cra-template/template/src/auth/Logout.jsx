import {useEffect} from 'react'
import api from '../api/http-common'
import {useNavigate } from "react-router-dom";

export default function Logout() {
    const Navigate = useNavigate();
  useEffect(()=>{
        try {
           api.post("/logout");
           console.log("logout Successfully");
          sessionStorage.clear();
          Navigate("/");
        } catch (error) {
          console.log(error);
        }
  },[])
}
