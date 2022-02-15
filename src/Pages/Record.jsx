import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const baseurl = import.meta.env.EY_BASE_URL;

function RecordView() {
    const navigation = useNavigate();
    const [users, setUsers] = useState([]);
    async function getUserList() {
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
        await axios(config)
            .then((response)=>{
                setUsers(response.data.users)
            })
            .catch((error)=>{

            })
    }
    useEffect(()=>{
        document.title = "一言登録 | Eiyoo"
        getUserList()
    },[])
    return(
        <>
            <div className="data">
                <h2>一言を登録する</h2>
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
                            <img src={user.avatar==null?'/assets/img/avatar.jpg':`${baseurl}/media/${user.avatar}`} alt="" />
                            <p>{user.name1} {user.name2}</p>
                        </a>
                    ))}
                </div>
            </div>
        </>
    )
}

export default RecordView