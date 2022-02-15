import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const baseurl = import.meta.env.EY_BASE_URL;

function DataView() {
    const navigation = useNavigate();
    const [users, setUsers] = useState([]);
    const getUserList = () => {
        var loginuserData =  JSON.parse(localStorage.getItem("userData")) || null;
        if (loginuserData != null) {
            var token = loginuserData.token
        }
        var config = {
            method: 'post',
            url: `${baseurl}/api/get_user_list`,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            }
        }
        axios(config)
            .then((response)=>{
                setUsers(response.data.users)
            })
            .catch((error)=>{

            })
    }
    useEffect(()=>{
        document.title = "評価データ | Eiyoo"
        getUserList()
        const interval = setInterval(() => getUserList(), 2000)
        return () => clearInterval(interval)
    },[])
    return(
        <>
            <div className="data">
                <h2>会員の食事記録を見る</h2>
                <div className="data-user-container">
                    {users.map((user)=>(
                        <a
                            key={user.pk}
                            onClick={
                                ()=>navigation(
                                    'detail',
                                    {
                                        state: {
                                            pk: user.pk
                                        }
                                    }
                                )
                            }
                        >
                            {
                                user.countUnreadMeals>0?
                                <div>{user.countUnreadMeals}</div>
                                :
                                <></>
                            }
                            <img src={user.avatar==null?'/assets/img/avatar.jpg':`${baseurl}/media/${user.avatar}`} alt="" />
                            <p>{user.name1} {user.name2}</p>
                        </a>
                    ))}
                </div>
            </div>
        </>
    )
}

export default DataView