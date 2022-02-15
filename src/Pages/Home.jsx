import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const baseurl = import.meta.env.EY_BASE_URL;

function HomeView() {
    const navigation = useNavigate();
    const [newMeal, setNewMeal] = useState(0);
    const [newMessage, setNewMessage] = useState(0)

    useEffect(()=>{
        document.title = "ホーム | Eiyoo"

        getData()
        const interval = setInterval(() => getData(), 2000)
        return () => clearInterval(interval)
    },[])

    const getData = () => {
        var loginuserData =  JSON.parse(localStorage.getItem("userData")) || null;
        if (loginuserData != null) {
            var token = loginuserData.token
        }
        var config = {
            method: 'post',
            url: `${baseurl}/api/get_advisor_unreads`,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            }
        }
        axios(config)
            .then((response)=>{
                setNewMeal(response.data.countUnreadMeals)
                setNewMessage(response.data.countUnreadMessages)
            })
            .catch((error)=>{

            })
    }
    return(
        <>
            <div className="home">
                <div className="home-container">
                    <h2>アドバイス専属会員</h2>
                    <Link to="/dashboard/message">
                        {
                            newMessage>0?
                            <div>{newMessage}</div>
                            :
                            <></>
                        }
                        会員一覧 メッセンジャー
                    </Link>
                    <Link to="/dashboard/data">
                        {
                            newMeal>0?
                            <div>{newMeal}</div>
                            :
                            <></>
                        }
                        会員の食事記録を見る
                    </Link>
                    <Link to="/dashboard/record">一言を登録する</Link>
                </div>
                <div className="home-container">
                    <h2>その他</h2>
                    <Link to="/dashboard/profile">プロフィール設定</Link>
                    <Link to="/dashboard/inquiry">運営に問い合わせ</Link>
                </div>
            </div>
        </>
    )
}

export default HomeView