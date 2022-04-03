import { useSetRecoilState } from 'recoil'
import {useState,useEffect} from  'react'
import { postNumber } from './RecoilStuff'
const ScrollObserver = ()=>{
    const [atBottom,setAtBottom] = useState(false)
    const setPostNumber = useSetRecoilState(postNumber);
    window.addEventListener('scroll',()=>{
        if(window.innerHeight + document.documentElement.scrollTop >= (document.documentElement.offsetHeight-800)){
            setAtBottom(true)
        }else{
            setAtBottom(false)
        }
    })
    
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