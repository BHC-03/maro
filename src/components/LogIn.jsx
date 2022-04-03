import React , {useState} from "react";
import useError from "../useForm";
import fire from "../fireconfig";
import { useSetRecoilState,useRecoilValue } from "recoil";
import { signedInfo,isLogged } from "../RecoilStuff";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
const CryptoJS = require("crypto-js");
const InputSectoin = ()=>{ 
    const history = useHistory();
    const setSignedInfo = useSetRecoilState(signedInfo);
    const IsLogged = useRecoilValue(isLogged);
    
    const [info,setInfo] = useState({
        email:'',
        password:'',
    })
    const [errors,setErrors] = useError(info);
    const [good,setGood] = useState(true);
    const emailHandler=e=>{
        setInfo(info=>({...info,email:e.target.value}))
    }
    const passwordHandler=e=>{
        setInfo(info=>({...info,password:e.target.value}))
    }
    const clickHandler =async()=>{
        if(errors.email || errors.password){
            return setGood(false)
        }

        const ref = fire.firestore().collection('users').where('email','==',info.email).get();
        if((await ref).empty){
            setErrors({email:'email is invalid',password:'password is invalid'})
            return setGood(false);
        }
        (await ref).forEach(f=>{
            const dcrypted = CryptoJS.AES.decrypt(f.data().password,process.env.REACT_APP_SECRET_KEY).toString(CryptoJS.enc.Utf8);
            if(!(dcrypted === info.password)){
                setErrors({email:'email is invalid',password:'password is invalid'})
                return setGood(false)
            }
            setSignedInfo(f.data());
            return sessionStorage.setItem('userInfo',JSON.stringify(f.data()));
        })

    }
    if(IsLogged){
        return <Redirect push to={'/mainpage/'} />
    }
    return(
        <div className="inputContainer">
            <input className="inputfield" type="text" value={info.email} onChange={emailHandler} />
            {!good && errors.email && (<p className="errorMessage">{errors.email}</p>) }
            <br/>
            <input className="inputfield" type="password" value={info.password} onChange={passwordHandler} />
            {!good && errors.password && (<p className="errorMessage">{errors.password}</p>) }
            <br/>
            <button className="button" onClick={clickHandler}>Submit</button>

        </div>
    )
}


export default InputSectoin;