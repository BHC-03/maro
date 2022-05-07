import React,{useEffect,useState} from "react";
import Post from "./Post";
import {useRecoilValue } from "recoil";
import {actualPostsSelector } from "../RecoilStuff";
const PostsContainer = ({setDone})=>{
    const actualPosts = useRecoilValue(actualPostsSelector);
    

    // local State
    const [localPosts,setLocalPosts] = useState([]);
    
    useEffect(()=>{
        if(actualPosts === 'done'){
            return setDone(true);
        }
        if(actualPosts){
            setLocalPosts(oldPosts=>{
                return [...oldPosts,...actualPosts]
            });
        }
    },[actualPosts])

    return(
        <div className="postsContainer">
            {   
                
                localPosts.map(post=>{
                    
                    return <Post key={post.id} post={post} />
                })
            }
        </div>
    )
}
export default PostsContainer;