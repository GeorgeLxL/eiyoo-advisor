import axios from "axios";
import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const baseurl = import.meta.env.EY_BASE_URL;

function DataDetailView() {
    const navigate = useNavigate()
    const Location = useLocation();
    const pk = Location.state.pk

    const now = new Date()
    const [date, setDate] = useState(now);
    const [prevMonthDate, setPrevMonthDate] = useState([]);
    const [currentMonthDate, setCurrentMonthDate] = useState([]);
    const [nextMonthDate, setNextMonthDate] = useState([]);
    const [avatar, setAvatar] = useState('');
    const [name1, setName1] = useState('');
    const [name2, setName2] = useState('');
    const [photoURL1, setPhotoURL1] = useState('')
    const [photoURL2, setPhotoURL2] = useState('')
    const [photoURL3, setPhotoURL3] = useState('')
    const [content1, setContent1] = useState('')
    const [content2, setContent2] = useState('')
    const [content3, setContent3] = useState('')

    function daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }
    
    const nextDate = () => {
        var nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        setDate(nextDay)
    }

    const prevDate = () => {
        var prevDay = new Date(date);
        prevDay.setDate(date.getDate() - 1);
        setDate(prevDay)
    }

    const nextMonth = () => {
        var nextMonth = new Date(date.getFullYear(), date.getMonth()+1, date.getDate());
        setDate(nextMonth)
    }

    const prevMonth = () => {
        var prevMonth = new Date(date.getFullYear(), date.getMonth()-1, date.getDate())
        setDate(prevMonth)
    }

    function setCurrentDate(item) {
        var currentDate = new Date(date.getFullYear(), date.getMonth(), item)
        setDate(currentDate)
    }
    
    function setNextDate(item) {
        var nextMonthDate = new Date(date.getFullYear(), date.getMonth()+1, item)
        setDate(nextMonthDate)
    }

    function setPrevDate(item) {
        var prevMonthDate = new Date(date.getFullYear(), date.getMonth()-1, item)
        setDate(prevMonthDate)
    }

    const setToday = () => {
        setDate(now)
    }

    useEffect(()=>{
        document.title = "評価データ | Eiyoo"
        const dayOfWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        var prevdays = daysInMonth(date.getMonth(), date.getFullYear())
        var currentdays = daysInMonth(date.getMonth()+1, date.getFullYear())
        const dayOfWeekLast = new Date(date.getFullYear(), date.getMonth(), currentdays).getDay()
        var prevDate=[];
        var currentDate=[]
        var nextDate=[]

        for(let i= 0; i<dayOfWeek; i++){
            prevDate.push(prevdays - dayOfWeek + i + 1);
        }

        for(let i= 1; i<=currentdays; i++){
            currentDate.push(i);
        }
        for(let i= dayOfWeekLast; i<6; i++){
            nextDate.push(i - dayOfWeekLast + 1);
        }
        setCurrentMonthDate(currentDate);
        setPrevMonthDate(prevDate);
        setNextMonthDate(nextDate);
        getData()
    }, [date])

    function getData() {
        var userData = JSON.parse(localStorage.userData)
        var token = userData.token
        var date1 = moment(date).format('YYYY-MM-DD HH:mm')
        var data = JSON.stringify({'date': date1, 'pk': pk})
        var config = {
            method: 'post',
            url: `${baseurl}/api/get_user_mealData`,
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            data: data
        }
        axios(config)
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
                if (response.data.meal.meal1.length==1) {
                    setPhotoURL1(`${baseurl}/media/${response.data.meal.meal1[0].photo}`)
                    setContent1(response.data.meal.meal1[0].content)
                }
                else {
                    setPhotoURL1('')
                    setContent1('')
                }
                if (response.data.meal.meal2.length==1) {
                    setPhotoURL2(`${baseurl}/media/${response.data.meal.meal2[0].photo}`)
                    setContent2(response.data.meal.meal2[0].content)
                }
                else {
                    setPhotoURL2('')
                    setContent2('')
                }
                if (response.data.meal.meal3.length==1) {
                    setPhotoURL3(`${baseurl}/media/${response.data.meal.meal3[0].photo}`)
                    setContent3(response.data.meal.meal3[0].content)
                }
                else {
                    setPhotoURL3('')
                    setContent3('')
                }
            })
            .catch((error)=>{
            })
    }

    return(
        <>
            <div className="data">
                <a className="back-btn" onClick={()=>navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12.414" height="22.828" viewBox="0 0 12.414 22.828"><g transform="translate(-4 -2.086)"><g transform="translate(5 3.5)"><path d="M15,3.5,5,13.5l10,10" transform="translate(-5 -3.5)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/></g></g></svg>
                    <span>返る</span>
                </a>
                <h2>会員の食事記録を見る</h2>
                <div className="data-detail-user">
                    <img src={avatar==''?'/assets/img/avatar.jpg':`${baseurl}/media/${avatar}`} alt="" />
                    <p>{name1} {name2}</p>
                </div>
                <div className="record">
                    <div className="record-date">
                        <a onClick={prevDate}><svg xmlns="http://www.w3.org/2000/svg" width="7.828" height="13.046" viewBox="0 0 7.828 13.046"><path d="M6.523,7.827a1.184,1.184,0,0,1-.913-.391L.391,2.218a1.261,1.261,0,0,1,0-1.826,1.261,1.261,0,0,1,1.826,0L6.523,4.7,10.828.391a1.261,1.261,0,0,1,1.826,0,1.261,1.261,0,0,1,0,1.826L7.436,7.436A1.184,1.184,0,0,1,6.523,7.827Z" transform="translate(7.827 0) rotate(90)" fill="#fff"/></svg></a>
                        <p>
                            {
                                date.getFullYear().toString() + '年' + (date.getMonth() + 1).toString() + '月' + date.getDate().toString() + '日'
                            }
                        </p>
                        <a onClick={nextDate}><svg xmlns="http://www.w3.org/2000/svg" width="7.828" height="13.046" viewBox="0 0 7.828 13.046"><path d="M6.523,7.827a1.184,1.184,0,0,1-.913-.391L.391,2.218a1.261,1.261,0,0,1,0-1.826,1.261,1.261,0,0,1,1.826,0L6.523,4.7,10.828.391a1.261,1.261,0,0,1,1.826,0,1.261,1.261,0,0,1,0,1.826L7.436,7.436A1.184,1.184,0,0,1,6.523,7.827Z" transform="translate(0 13.046) rotate(-90)" fill="#fff"/></svg></a>
                    </div>
                    <div className="record-main">
                        <div className="record-card">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>朝ご飯</td>
                                        <td>
                                            {
                                                photoURL1!=''?
                                                <div><img src={photoURL1} alt="" /></div>
                                                :
                                                <></>
                                            }
                                        </td>
                                        <td>
                                            {
                                                photoURL1!=''?
                                                <p>{content1}</p>
                                                :
                                                <></>
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="record-card">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>昼ご飯</td>
                                        <td>
                                            {
                                                photoURL2!=''?
                                                <div><img src={photoURL2} alt="" /></div>
                                                :
                                                <></>
                                            }
                                        </td>
                                        <td>
                                            {
                                                photoURL2!=''?
                                                <p>{content2}</p>
                                                :
                                                <></>
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="record-card">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>夜ご飯</td>
                                        <td>
                                            {
                                                photoURL3!=''?
                                                <div><img src={photoURL3} alt="" /></div>
                                                :
                                                <></>
                                            }
                                        </td>
                                        <td>
                                            {
                                                photoURL3!=''?
                                                <p>{content3}</p>
                                                :
                                                <></>
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <a
                                className="data-evaluation"
                                onClick={()=>navigate(
                                    'evaluation',
                                    {
                                        state: {
                                            date: date,
                                            pk: pk
                                        }
                                    }
                                )}

                            >
                                1日の評価をする
                            </a>
                        </div>
                    </div>
                    <div className="record-calendar">
                        <div className="record-calendar-header">
                            <h4>{date.getFullYear().toString()+'年'+(date.getMonth() + 1).toString()+'月'}</h4>
                            <div className="record-calendar-header-link">
                                <a onClick={setToday} className="record-calendar-today">今日</a>
                                <a onClick={prevMonth}>
                                    {
                                        date.getMonth()==0?
                                        '12月'
                                        :
                                        date.getMonth().toString()+'月'
                                    }
                                </a>
                                <a onClick={nextMonth}>
                                    {
                                        date.getMonth()==11?
                                        '1月'
                                        :
                                        (date.getMonth() + 2).toString() + '月'
                                    }
                                </a>
                            </div>
                        </div>
                        <div className="record-calendar-body">
                            <div className="record-calendar-week">
                                <p>日</p>
                                <p>月</p>
                                <p>火</p>
                                <p>水</p>
                                <p>木</p>
                                <p>金</p>
                                <p>土</p>
                            </div>
                            <div className="record-calendar-main">
                                {prevMonthDate.map(item=>(
                                    <div key={item}><a onClick={() => setPrevDate(item)} className="notthis">{item}</a></div>
                                ))}
                                {currentMonthDate.map(item=>(
                                    <div key={item}><a onClick={() =>setCurrentDate(item)} className={`${new Date(date.getFullYear(), date.getMonth(), item).setHours(0,0,0,0) ==new Date(now.getFullYear(), now.getMonth(), now.getDate()).setHours(0,0,0,0) ? "today" : ""} ${item===date.getDate() ? "current" : ""}`}>{item}</a></div>
                                ))}
                                {nextMonthDate.map(item=>(
                                    <div key={item}><a onClick={() => setNextDate(item)} className="notthis">{item}</a></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DataDetailView