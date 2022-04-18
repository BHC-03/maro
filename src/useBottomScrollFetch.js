import { useSetRecoilState } from 'recoil'
import {useState,useEffect} from  'react'
import { postNumber} from './RecoilStuff'
const ScrollObserver = ()=>{
    const [atBottom,setAtBottom] = useState(false)
    const setPostNumber = useSetRecoilState(postNumber);
    
    const scrollingFuv = ()=>{
        if(window.innerHeight + document.documentElement.scrollTop >= (document.documentElement.offsetHeight-800)){
            setAtBottom(true)
        }else{
            setAtBottom(false)
        }
    }
    useEffect(()=>{
        window.addEventListener('scroll',scrollingFuv)
    },[])
    useEffect(()=>{
        if(atBottom){
            setPostNumber(oldpst=>(oldpst+10));
        }
    },[atBottom])

    return(
        null
    )
}



export default ScrollObserver;