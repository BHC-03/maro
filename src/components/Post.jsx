import React,{useState,useEffect} from "react";
import { useSetRecoilState } from "recoil";
import { popUpActiveAtom , activePostAtom } from "../RecoilStuff";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown,faMessage } from "@fortawesome/free-solid-svg-icons"; 
import fire from '../fireconfig'
import { useRecoilValue } from "recoil";
import { signedInfo } from "../RecoilStuff";
const Post  =  ({post})=>{
    const setPopActive = useSetRecoilState(popUpActiveAtom);
    const setActivePost = useSetRecoilState(activePostAtom);
    const [postState,setPostState] = useState('none');
    const signedUser = useRecoilValue(signedInfo);
    const voteNum = post.upvotes.length- post.downvotes.length;
    async function getPost(){
        const postRef = await fire.firestore().collection('posts').where('id','==',post.id).get();
        return postRef
    } 
    useEffect(()=>{
        getPost().then(
            data=>{
                const postRef = data;
                const upvoted = postRef.docs[0].data().upvotes.find(id=> id === signedUser.id);
                if(upvoted){
                    return setPostState('upVoted')
                }
                const downvoted = postRef.docs[0].data().downvotes.find(id=> id===signedUser.id);
                if(downvoted){
                     return setPostState('downVoted');
                 }
            }
        )
         
    },[])
    const upVoteHandler =  async () => {
        const postRef = await getPost();
        const postInfo = postRef.docs[0].data();
        const newRef = await fire.firestore().collection('posts').doc(`${post.id}`);
        
        switch(postState){
            case'upVoted':
                const filtered = postInfo.upvotes.filter(id=> id !== signedUser.id);
                await newRef.update({upvotes:filtered});
                setPostState('none');
                break
            case'downVoted':
                const filteredDownVotes = postInfo.downvotes.filter(id=> id!== signedUser.id);
                const addedUpvotes = [...postInfo.upvotes,signedUser.id]
                await newRef.update({downvotes:filteredDownVotes,upvotes:addedUpvotes});
                setPostState('upVoted')
                break
            case'none':
                const addedUpvotes1 = [...postInfo.upvotes,signedUser.id]
                await newRef.update({upvotes:addedUpvotes1});
                setPostState('upVoted')
                break
            default:
                console.log('nothing happend')
        }

    }
    const downVoteHandler = async()=>{
        const postRef = await getPost();
        const postInfo = postRef.docs[0].data();
        const newRef = await fire.firestore().collection('posts').doc(`${post.id}`);
        switch(postState){
            case'upVoted':
                const filteredUpVotes = postInfo.upvotes.filter(id=> id !== signedUser.id);
                const addedDownVote = [...postInfo.downvotes,signedUser.id]
                await newRef.update({upvotes:filteredUpVotes,downvotes:addedDownVote});
                setPostState('downVoted');
                break
            case'downVoted':
                const filteredDownVotes = postInfo.downvotes.filter(id=> id !== signedUser.id);
                await newRef.update({downvotes:filteredDownVotes});
                setPostState('none')
                break
            case'none':
                const AddedDownVote = [...postInfo.downvotes,signedUser.id];
                await newRef.update({downvotes:AddedDownVote});
                setPostState('downVoted');
                break
            default:
                console.log('nothing happend')
        }
    }
    const postClickHandler = ()=>{
        setPopActive(oldPopUp=>(!oldPopUp));
        setActivePost(post)
    }
    return(
        <div onClick={postClickHandler} className="postContainer">
            <div className="postInfo">
                <div className="profilePic">
                    <span className="owenerId">{post.owner}</span>
                </div>
                <div className="votes">
                    <FontAwesomeIcon  onClick={upVoteHandler} icon={faArrowDown} className={`upVote vote ${postState==='upVoted'?'active':''}`} />
                    <p className={`voteDiff ${postState === 'upVoted' ? 'active':postState === 'downVoted' ?'downActive':''}`}>{postState==='upVoted'?voteNum+1:postState==='downVoted'?voteNum-1:voteNum}</p>
                    <FontAwesomeIcon onClick={downVoteHandler} icon={faArrowDown} className={`${postState==='downVoted'?'active':''} downVote vote`} />
                </div>
                <div className="commentsButton">
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