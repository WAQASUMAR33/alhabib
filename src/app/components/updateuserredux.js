'use client'
import { useState,useEffect } from "react"
import { useSelector } from "react-redux";
import { UpdateUser } from "../Store/Slice";
import { useDispatch } from "react-redux";
export default function UpdateUserRedux(){
    const dispatch = useDispatch();
    const userid = useSelector((data) => data.user.id);
    useEffect( () => {
        const fetchuserdetails = async () => {
          const data = await fetch(`/api/user/${userid}`);
          const user = await data.json();
          dispatch(UpdateUser({id:user.id, fullname:user.fullname, username:user.username, balance:user.balance, role:user.role}))
        }
        fetchuserdetails();
      }, [userid]);
     
}