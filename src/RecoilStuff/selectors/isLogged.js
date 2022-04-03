import { selector } from "recoil";
import signedInfo from "../atoms/signedInfo";
const isLogged = selector({
    key:'isLoggedSelector',
    get:({get})=>{
        const SignedInfo = get(signedInfo);
        if(SignedInfo.email){
            return true
        }else{
            return false
        }
    }
})

export default isLogged;