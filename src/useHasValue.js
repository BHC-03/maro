import {useEffect,useState} from 'react'
import { useRecoilValue } from 'recoil'
import { actualPostsSelector } from './RecoilStuff'
const useHasValue = ()=>{
    const actualPosts = useRecoilValue(actualPostsSelector);
    const [hasValue,setHasValue] = useState(false)
    useEffect(()=>{
        if(actualPosts){
            setHasValue(true)
        }
    },[actualPosts])
    return hasValue;    
}



export default useHasValue