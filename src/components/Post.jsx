import React,{useState,useEffect} from "react";
import { useSetRecoilState,useRecoilState } from "recoil";
import { popUpActiveAtom , activePostAtom } from "../RecoilStuff";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown,faMessage } from "@fortawesome/free-solid-svg-icons"; 
import fire from '../fireconfig'
import { useRecoilValue } from "recoil";
import { signedInfo } from "../RecoilStuff";
const Post  =  ({post})=>{
    const setPopActive = useSetRecoilState(popUpActiveAtom);
    const [activePost,setActivePost] = useRecoilState(activePostAtom);
    const [postState,setPostState] = useState({voteNum:0,state:'none'});
    const signedUser = useRecoilValue(signedInfo);
    async function getPost(){
        const postRef = await fire.firestore().collection('posts').where('id','==',post.id).get();
        return postRef
    } 
    useEffect(()=>{
        getPost().then(
            data=>{
                const postRef = data;
                const upvoted = postRef.docs[0].data().upvotes.find(id=> id === signedUser.id);
                setPostState(oldState=>({...oldState,voteNum:post.upvotes.length - post.downvotes.length}));
                if(upvoted){
                    return setPostState(oldState=>({...oldState,state:'upVoted'}))
                }
                const downvoted = postRef.docs[0].data().downvotes.find(id=> id===signedUser.id);
                if(downvoted){
                     return setPostState(oldState=>({...oldState,state:'downVoted'}));
                 }
            }
        )
         
    },[])
    useEffect(()=>{
        if(post.id === activePost.post?.id){
            setPostState(activePost.state);
        }
    },[activePost])
    const upVoteHandler =  async () => {
        const postRef = await getPost();
        const postInfo = postRef.docs[0].data();
        const newRef = await fire.firestore().collection('posts').doc(`${post.id}`);
        
        switch(postState.state){
            case'upVoted':
                const filtered = postInfo.upvotes.filter(id=> id !== signedUser.id);
                await newRef.update({upvotes:filtered});
                setPostState(oldState=>({state:'none',voteNum:oldState.voteNum-1}));
                break
            case'downVoted':
                const filteredDownVotes = postInfo.downvotes.filter(id=> id!== signedUser.id);
                const addedUpvotes = [...postInfo.upvotes,signedUser.id]
                await newRef.update({downvotes:filteredDownVotes,upvotes:addedUpvotes});
                setPostState(oldState=>({state:'upVoted',voteNum:oldState.voteNum+2}))
                break
            case'none':
                const addedUpvotes1 = [...postInfo.upvotes,signedUser.id]
                await newRef.update({upvotes:addedUpvotes1});
                setPostState(oldState=>({state:'upVoted',voteNum:oldState.voteNum+1}))
                break
            default:
                console.log('nothing happend')
        }

    }
    const downVoteHandler = async()=>{
        const postRef = await getPost();
        const postInfo = postRef.docs[0].data();
        const newRef = await fire.firestore().collection('posts').doc(`${post.id}`);
        switch(postState.state){
            case'upVoted':
                const filteredUpVotes = postInfo.upvotes.filter(id=> id !== signedUser.id);
                const addedDownVote = [...postInfo.downvotes,signedUser.id]
                await newRef.update({upvotes:filteredUpVotes,downvotes:addedDownVote});
                setPostState(oldState=>({state:'downVoted',voteNum:oldState.voteNum-2}));
                break
            case'downVoted':
                const filteredDownVotes = postInfo.downvotes.filter(id=> id !== signedUser.id);
                await newRef.update({downvotes:filteredDownVotes});
                setPostState(oldState=>({state:'none',voteNum:oldState.voteNum+1}))
                break
            case'none':
                const AddedDownVote = [...postInfo.downvotes,signedUser.id];
                await newRef.update({downvotes:AddedDownVote});
                setPostState(oldState=>({state:'downVoted',voteNum:oldState.voteNum-1}));
                break
            default:
                console.log('nothing happend')
        }
    }
    const postClickHandler = ()=>{
        setPopActive(oldPopUp=>(!oldPopUp));
        setActivePost({post:post,state:postState})
    }
    return(
        <div  className="postContainer">
            <div className="postInfo">
                <div className="profilePic">
                    <span className="owenerId">{post.owner}</span>
                </div>
                <div className="votes">
                    <FontAwesomeIcon  onClick={upVoteHandler} icon={faArrowDown} className={`upVote vote ${postState.state==='upVoted'?'active':''}`} />
                    <p className={`voteDiff ${postState.state === 'upVoted' ? 'active':postState.state === 'downVoted' ?'downActive':''}`}>{postState.voteNum}</p>
                    <FontAwesomeIcon onClick={downVoteHandler} icon={faArrowDown} className={`${postState.state==='downVoted'?'active':''} downVote vote`} />
                </div>
                <div onClick={postClickHandler} className="commentsButton">
                    <FontAwesomeIcon icon={faMessage} className={'commentIcon'} />
                </div>
            </div>
            <div className="postText">
                    {post.text}
            </div>
        </div>
    )
}


export default Post;