import axios from "axios";
import React, { useState, useRef, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";

const baseurl = import.meta.env.EY_BASE_URL;

function MessageView() {
    const navigation= useNavigate()
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

    useEffect(()=> {
        document.title = "メッセージ | Eiyoo";

        getUserList()
        const interval = setInterval(() => getUserList(), 2000)
        return () => clearInterval(interval)
    }, [])

    return(
        <>
            <div className="message">
                <div className="message-user-container">
                    <h2>会員一覧メッセンジャー</h2>
                    <div className="message-user">
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
                                    user.countunreadMessages>0?
                                    <div className="notice">{user.countunreadMessages}</div>
                                    :
                                    <></>
                                }
                                <img src={user.avatar==null?'/assets/img/avatar.jpg':`${baseurl}/media/${user.avatar}`} alt="" />
                                <div className="message-user-content">
                                    <h4>{user.name1} {user.name2}</h4>
                                    <p>
                                        {
                                            user.lastMessage.length==0?
                                            <></>
                                            :
                                            user.lastMessage[user.lastMessage.length-1].content!=''?
                                            <span dangerouslySetInnerHTML={{__html: user.lastMessage[user.lastMessage.length-1].content}}></span>
                                            :
                                            'Image'
                                        }
                                    </p>
                                    <p className="message-user-time">
                                        {
                                            user.lastMessage.length==0?
                                            <></>
                                            :
                                            (new Date(user.lastMessage[user.lastMessage.length-1].created_at)).getHours() + ':' + (new Date(user.lastMessage[user.lastMessage.length-1].created_at)).getMinutes()
                                        }
                                    </p>
                                </div>
                                
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MessageView