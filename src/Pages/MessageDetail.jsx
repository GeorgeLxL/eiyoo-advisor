import axios from "axios";
import React, { useState, useRef, useEffect} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const baseurl = import.meta.env.EY_BASE_URL;

function MessageDetailView() {

    const navigate = useNavigate();
    
    const Location = useLocation();
    const pk = Location.state.pk
    const [message, setMessage] = useState('')
    const [advisorAvatar, setAdvisorAvatar] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const [messageList, setMessageList] = useState([])

    const upload = useRef()

    const keydownHandler = (e) => {
        if (e.keyCode === 13 && e.ctrlKey) {
            setMessage(message + '\n');
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
        }
        else if (e.keyCode === 13 && e.shiftKey) {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
        }
        else if (e.keyCode === 8) {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
        }
        else if (e.keyCode===13) {
            sendMessage()
        }
    }

    useEffect(()=>{
        document.title = "メッセージ | Eiyoo";
        getMessage()
        
        setReadMessage()
        
        const interval = setInterval(() => getMessage(), 2000)
        return () => clearInterval(interval)
    }, [pk])

    async function getMessage() {
        var loginuserData =  JSON.parse(localStorage.getItem("userData")) || null;
        if (loginuserData != null) {
            var token = loginuserData.token
        }
        if (pk!='') {
            var data = JSON.stringify({'pk': pk})
            var config = {
                method: 'post',
                url: `${baseurl}/api/advisor_get_message`,
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + token,
                },
                data: data
            };
            await axios(config)
                .then((response)=> {
                    let data = response.data
                    if (data.advisorAvatar!=null) {
                        setAdvisorAvatar(data.advisorAvatar)
                    }
                    if (data.userAvatar!=null) {
                        setUserAvatar(data.userAvatar)
                    }
                    setMessageList(data.message)
                })
                .catch((error)=> {
    
                })
        }
        
    }

    async function setReadMessage() {
        var loginuserData =  JSON.parse(localStorage.getItem("userData")) || null;
        if (loginuserData != null) {
            var token = loginuserData.token
        }
        if (pk!='') {
            var data = JSON.stringify({'pk': pk})
            var config = {
                method: 'post',
                url: `${baseurl}/api/advisor_set_read_message`,
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + token,
                },
                data: data
            };
            await axios(config)
                .then((response)=> {
                    
                })
                .catch((error)=> {
    
                })
        }
    }

    async function sendMessage() {
        var loginuserData =  JSON.parse(localStorage.getItem("userData")) || null;
        if (loginuserData != null) {
            var token = loginuserData.token
        }
        var fd = new FormData()
        if (message!='') {
            fd.append('pk', pk)
            fd.append('message', message);
            fd.append('photo', null)
            var config = {
                method: 'post',
                url: `${baseurl}/api/advisor_send_message`,
                headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                },
                data: fd
            };
            await axios(config)
                .then((response)=> {
                    setMessage('')
                })
                .catch((error)=> {
                })
        }
    }

    const uploadPhoto = (e) => {
        let fileObj = e.target.files[0]
        var loginuserData =  JSON.parse(localStorage.getItem("userData")) || null;
        if (loginuserData != null) {
            var token = loginuserData.token
        }
        var fd = new FormData()
        fd.append('pk', pk)
        fd.append('message', '');
        fd.append('photo', fileObj)
        var config = {
            method: 'post',
            url: `${baseurl}/api/user_send_message`,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
            data: fd
        };
        axios(config)
            .then((response)=> {
            })
            .catch((error)=> {
            })
    }

    return(
        <>
            <div className="message message-detail">
                <div className="message-container">
                    <div className="message-content">
                        <a className="message-content-back back-btn" onClick={()=>navigate(-1)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12.414" height="22.828" viewBox="0 0 12.414 22.828"><g transform="translate(-4 -2.086)"><g transform="translate(5 3.5)"><path d="M15,3.5,5,13.5l10,10" transform="translate(-5 -3.5)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/></g></g></svg>
                            <span>返る</span>
                        </a>
                        <h2>会員一覧メッセンジャー</h2>
                        <div className="message-content-main">
                            <div className="message-content-main1">
                            {messageList.map((message)=>(
                                <div
                                    key={message.pk}
                                    className={`message-card ${message.send?'receive':'send'} ${message.quick?'quick':'unquick'} ${message.first?'first':''}`}
                                >
                                    
                                    {
                                        message.first?
                                        <img className="avatar" src={userAvatar!=''?`${baseurl}/media/${userAvatar}`:'/assets/img/avatar.jpg'} alt="" />
                                        :
                                        <></>
                                    }
                                    <div className="message-card-main">
                                        {
                                            message.photo!=''?
                                            <img className="content" src={`${baseurl}/media/${message.photo}`} alt="" />
                                            :
                                            <></>
                                        }
                                        {
                                            message.content!=''?
                                            <div className="content"><p>{message.content}</p></div>
                                            :
                                            <></>
                                        }
                                    </div>
                                    {
                                        message.send?
                                        <></>
                                        :
                                        message.quick?
                                        <></>
                                        :
                                        <img className="avatar" src={advisorAvatar!=''?`${baseurl}/media/${advisorAvatar}`:'/assets/img/avatar.jpg'} alt="" />
                                    }
                                    {
                                        message.quick?
                                        <></>
                                        :
                                        <p className="message-card-time">{(new Date(message.created_at)).getHours() + ':' + (new Date(message.created_at)).getMinutes()}</p>
                                    }
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                    <div className="message-input">
                        <div className="message-input-photo">
                            <input type="file" onChange={(e)=>uploadPhoto(e)} ref={upload} multiple hidden capture="camera" accept="image/*" />
                            <a onClick={() => upload.current.click()}><svg xmlns="http://www.w3.org/2000/svg" width="22.857" height="20" viewBox="0 0 22.857 20"><path d="M22.857,7.25V20.107a2.143,2.143,0,0,1-2.143,2.143H2.143A2.143,2.143,0,0,1,0,20.107V7.25A2.143,2.143,0,0,1,2.143,5.107H6.071l.549-1.469a2.14,2.14,0,0,1,2-1.388h5.6a2.14,2.14,0,0,1,2,1.388l.554,1.469h3.929A2.143,2.143,0,0,1,22.857,7.25Zm-6.071,6.429a5.357,5.357,0,1,0-5.357,5.357A5.361,5.361,0,0,0,16.786,13.679Zm-1.429,0A3.929,3.929,0,1,1,11.429,9.75,3.934,3.934,0,0,1,15.357,13.679Z" transform="translate(0 -2.25)" fill="#f8f8f8"/></svg></a>
                        </div>
                        <div className="message-input-main">
                            <textarea name="" id="" rows={1} value={message} onChange={(e)=>setMessage(e.target.value)} onKeyDown={keydownHandler} ></textarea>
                            <a onClick={sendMessage}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24.631" height="24.191" viewBox="0 0 24.631 24.191"><g transform="translate(12.096 1.061) rotate(45)"><line x1="7.667" y2="7.667" transform="translate(7.939 0)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M15.606,0,12.392,15.606,7.939,7.667,0,3.214Z" transform="translate(0 0)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/></g></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MessageDetailView