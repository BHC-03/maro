import React,{Suspense,useState} from "react";
import { Redirect } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLogged } from "../RecoilStuff";
import ScrollObserver from "../useBottomScrollFetch";
import PostsContainer from "./postsContainerComponent";
import GhostPosts from "./GhostlyPosts";
import fire from "../fireconfig";
const MainPage=()=>{
    const [texti,setText] = useState('');
    const IsLogged = useRecoilValue(isLogged);
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
            timing: new Date().getTime(),
        }
        await fire.firestore().collection('posts').doc(`${postSize}`).set(newPost);
        console.log('post Added')
        setText('');
    }
    const textHandler = (e)=>{
        setText(e.target.value)
    }
    return(<>
        <ScrollObserver />
        <div className="mainPageContainer">
            <div className="postInput">
                <textarea onChange={textHandler} value={texti} className="inputText"  placeholder="What are your thoughts today ?" cols="30" rows="10"></textarea>
                <button onClick={postHandler} className="submitButton"> Post </button>
            </div>
            <Suspense fallback={<div>loading...</div>}><PostsContainer /></Suspense>
            <GhostPosts />
            <div className="logOutButton">
                
            </div>
        </div>
        
        </>
    )
}


export default MainPage