import React,{Suspense,useEffect,useState} from "react";
import { Redirect } from "react-router-dom";
import { useRecoilValue,useSetRecoilState } from "recoil";
import { isLogged,popUpActiveAtom,signedInfo } from "../RecoilStuff";
import ScrollObserver from "../useBottomScrollFetch";
import PostsContainer from "./postsContainerComponent";
import GhostPosts from "./GhostlyPosts";
import fire from "../fireconfig";
import useHasValue from "../useHasValue";
import PopUp from "./popUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
const MainPage=()=>{
    const popUpActive = useRecoilValue(popUpActiveAtom);
    const [texti,setText] = useState('');
    const IsLogged = useRecoilValue(isLogged);
    const hasValue = useHasValue();
    const setSignedInfo = useSetRecoilState(signedInfo);
    const [done,setDone] = useState(false);
    useEffect(()=>{
        if(!IsLogged){
            return <Redirect push to={'/login/'}/>
        }
    },[isLogged])
    if(!IsLogged){
        return <Redirect push to={'/login/'}/>
    }
    
    const postHandler=async()=>{
        const oldRef = await fire.firestore().collection('posts').get();
        const postSize = oldRef.size+1;
        const newPost = {
            owner: await JSON.parse(sessionStorage.getItem('userInfo')).id
            ,id:postSize,
            upvotes:[],
            downvotes:[],
            text:texti,
            timing: (Date.now()),
        }
        await fire.firestore().collection('posts').doc(`${postSize}`).set(newPost);
        console.log('post Added')
        setText('');
    }
    const textHandler = (e)=>{
        setText(e.target.value)
    }
    const logOutHandler = ()=>{
        sessionStorage.setItem('userInfo',null);
        setSignedInfo({});
    }
    
    return(<>
        
        {hasValue && !done && <ScrollObserver />}
                
        
        <div className={`mainPageContainer ${popUpActive?'mainPageDisable':'mainPageEnable'}`}>
            <div className="postInput">
                <textarea onChange={textHandler} value={texti} className="inputText"  placeholder="What are your thoughts today ?" cols="30" rows="10"></textarea>
                <button onClick={postHandler} className="submitButton"> Post </button>
            </div>
            <Suspense fallback={<div>loading...</div>}><PostsContainer setDone={setDone} /></Suspense>
            {!done && <GhostPosts />}
            <div onClick={logOutHandler} className="logOutButton">
                <FontAwesomeIcon icon={faRightFromBracket} />
            </div>
            
        </div>
        <PopUp />
        </>
    )
}


export default MainPage