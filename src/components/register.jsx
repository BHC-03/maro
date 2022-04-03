import React ,{useState} from "react";
import { useHistory } from "react-router-dom";
import fire from "../fireconfig";
import useError from "../useForm";
import { useRecoilValue,useSetRecoilState } from "recoil";
import { signedInfo,isLogged } from "../RecoilStuff";
import { Redirect } from "react-router-dom";
const CryptoJS = require("crypto-js");
const Register = ()=>{
    const history = useHistory();
    const [info,setInfo] = useState({
        email:'',
        password:'',
        username:'',
    })
    const [errors,setErrors] = useError(info);
    const [good,setGood] = useState(true);
    const IsLogged = useRecoilValue(isLogged)
    const setSignedInfo = useSetRecoilState(signedInfo);
    const emailHandler=e=>{
        setInfo(info=>({...info,email:e.target.value}))
    }
    const passwordHandler=e=>{
        setInfo(info=>({...info,password:e.target.value}))
    }
    const usernameHandler = e=>{
        setInfo(info=>({...info,username:e.target.value}))
    }
    const clickHandler = async ()=>{
        if(errors.username || errors.email || errors.email){
            return setGood(false);
        }
        const ref = await fire.firestore().collection('users').where('email','==',info.email).get();
        if(!ref.empty){
            setErrors({email:'email is already used'})
            return setGood(false);
        }
        const refuser = await fire.firestore().collection('users').where('username','==',info.username).get();
        if(!refuser.empty){
            setErrors({username:'username is already used'})
            return setGood(false)
        }
        const hashed = await CryptoJS.AES.encrypt(info.password,process.env.REACT_APP_SECRET_KEY).toString();
        const IdRef =  await fire.firestore().collection('users').get();
        const newId = IdRef.size+1;
        const newRef = await fire.firestore().collection('users').doc(newId.toString());
        const data = {
            email:info.email,
            password:hashed,
            username:info.username,
            posts:[],
            followers:[],
            id:newId
        }
        await newRef.set(data)
        sessionStorage.setItem('userInfo',JSON.stringify(data));
        setSignedInfo(data)
        return history.push('/mainpage/')
    }
    if(IsLogged){
        return <Redirect push to={'/mainpage/'}/>
    }
    return(
        <div className="inputContainer">
            <label htmlFor="email">Email :</label>
            <input name="email" className="inputfield" type="text" value={info.email} onChange={emailHandler} />
            {!good && errors.email && (<p className="errorMessage">{errors.email}</p>) }
            <br/>
            <label htmlFor="password">Password:</label>
            <input name="password" className="inputfield" type="password" value={info.password} onChange={passwordHandler} />
            {!good && errors.password && (<p className="errorMessage">{errors.password}</p>) }
            <br/>
            <label htmlFor="username">Username:</label>
            <input name="username" className="inputfield" type='text' value={info.username} onChange={usernameHandler} />
            {!good && errors.username && (<p className="errorMessage">{errors.username}</p>) }
            <button className="button" onClick={clickHandler}>Register</button>
        </div>
    )
}

export default Register;