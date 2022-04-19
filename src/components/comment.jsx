import React,{useState,useEffect} from "react";
import { useRecoilValue } from "recoil";
import { signedInfo } from "../RecoilStuff";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
const Comment = ({comment})=>{
    const [commentState , setCommentState] = useState('none');
    const activeUser = useRecoilValue(signedInfo);
    useEffect(()=>{
        const upvoted = comment.upvotes.find(upvote=> upvote === activeUser.id);
        if(upvoted){
            return setCommentState('upVoted')
        }else{
        comment.downvotes.forEach(downvote=>{
            if(downvote === activeUser.id){
                return setCommentState('downVoted')
            }
        })
    }
        
    },[])
    return(
        <div className="comment">
            <div className="commentDetails">
                <div className="profilePic commentpic"><span className="owenerId">1</span></div>
                <div className="votes commentVotes">
                    <FontAwesomeIcon  icon={faArrowDown} className={`upVote vote commentVote ${commentState === 'upVoted'?'active':''}`} />
                    <p className={`voteDiff ${commentState ==='upVoted'?'active':commentState === 'downVoted'?'downActive':''}`}>{comment.upvotes.length - comment.downvotes.length}</p>
                    <FontAwesomeIcon  icon={faArrowDown} className={` downVote vote commentVote ${commentState === 'downVoted'?'active':''}`} />
                </div>
            </div>
            <div className="commentText">
                {
                    comment.text
                }
            </div>
        </div>
    )
}


export default Comment