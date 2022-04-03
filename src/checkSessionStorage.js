import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { signedInfo } from "./RecoilStuff";
import {postNumber} from './RecoilStuff/index'
const useLoadInfoCheck = ()=>{
    const setSignedInfo = useSetRecoilState(signedInfo);
    const setPostNumber = useSetRecoilState(postNumber);
    useEffect(()=>{
        setPostNumber(0);
        const data = JSON.parse(sessionStorage.getItem('userInfo'));
        if(data){
            return setSignedInfo(data);
        }
    },[])
}
export default useLoadInfoCheck;