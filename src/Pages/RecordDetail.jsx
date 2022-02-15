import axios from "axios";
import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const baseurl = import.meta.env.EY_BASE_URL;

function RecordDetailView() {
    const navigate = useNavigate();
    const Location = useLocation();
    const pk = Location.state.pk

    const [avatar, setAvatar] = useState('');
    const [name1, setName1] = useState('');
    const [name2, setName2] = useState('');
    const [word, setWord] = useState('')
    const [error, setError] = useState('');
    const [alertModal, setAlertModal] = useState(false)

    useEffect(()=>{
        document.title = "一言登録 | Eiyoo"
        
        getData()
    }, [avatar])

    async function getData() {
        var userData = JSON.parse(localStorage.userData)
        var token = userData.token
        var data = JSON.stringify({'pk': pk})
        var config = {
            method: 'post',
            url: `${baseurl}/api/get_user_word`,
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            data: data
        }
        await axios(config)
            .then((response)=>{
                if (response.data.user.avatar!=null) {
                    setAvatar(response.data.user.avatar)
                }
                if (response.data.user.name1!=null) {
                    setName1(response.data.user.name1)
                }
                if (response.data.user.name2!=null) {
                    setName2(response.data.user.name1)
                }
                if (response.data.word!=null) {
                    setWord(response.data.word)
                }
            })
            .catch((error)=>{
            })
    }

    async function recordWord() {
        var userData = JSON.parse(localStorage.userData)
        var token = userData.token
        var data = JSON.stringify({'content': word, 'pk': pk})
        var config = {
            method: 'post',
            url: `${baseurl}/api/set_user_word`,
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            data: data
        }
        await axios(config)
            .then((response) => {
                setError('一言が登録しました。')
                setAlertModal(true)
            })
            .catch((error)=> {
                setError('一言登録が失敗しました。')
                setAlertModal(true)
            })
    }

    return(
        <>
            <div className="data">
                <a className="back-btn" onClick={()=>navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12.414" height="22.828" viewBox="0 0 12.414 22.828"><g transform="translate(-4 -2.086)"><g transform="translate(5 3.5)"><path d="M15,3.5,5,13.5l10,10" transform="translate(-5 -3.5)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/></g></g></svg>
                    <span>返る</span>
                </a>
                <div className="data-detail-user">
                    <img src={avatar==''?'/assets/img/avatar.jpg':`${baseurl}/media/${avatar}`} alt="" />
                    <p>{name1} {name2}</p>
                </div>
                <div className="record">
                    <div className="record-word">
                        <textarea rows={5} defaultValue={word} onChange={(e) =>setWord(e.target.value)}></textarea>
                        <a onClick={recordWord}>一言を登録する</a>
                    </div>
                </div>
            </div>
            <div className={`modal ${alertModal?'modal-show':''}`} onClick={() => setAlertModal(false)}>
                <div className="modal-body" onClick={(e) => e.stopPropagation()}>
                    <p>{error}</p>
                </div>
            </div>
        </>
    )
}

export default RecordDetailView