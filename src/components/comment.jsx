import React,{useState,useEffect} from "react";
import { useRecoilValue } from "recoil";
import { signedInfo } from "../RecoilStuff";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import fire from "../fireconfig";
const Comment = ({comment})=>{
    const [commentState , setCommentState] = useState({state:'none',voteNum:0});
    const [owner,setOwner] = useState();
    const activeUser = useRecoilValue(signedInfo);
    useEffect(()=>{
        getowner();    

        setCommentState(oldState=>({...oldState,voteNum:comment.upvotes.length - comment.downvotes.length}));
        const upvoted = comment.upvotes.find(upvote=> upvote === activeUser.id);
        if(upvoted){
            return setCommentState(oldState=>({...oldState,state:'upVoted'}))
        }else{
        comment.downvotes.forEach(downvote=>{
            if(downvote === activeUser.id){
                return setCommentState(oldState=>({...oldState,state:'downVoted'}))
            }
        })
    }

    },[])
    const getowner = ()=>{
        fire.firestore().collection('users').where('id','==',comment.owner).get().then(data=>{
            setOwner(data.docs[0].data())
        })
    }
    const upVoteHandler =async ()=>{
        const commentRef = await fire.firestore().collection('comments').where('id','==',comment.id).get();
        const commentData = commentRef.docs[0].data();
        const newRef = await fire.firestore().collection('comments').doc(`${comment.id}`);
        switch(commentState.state){
            case 'upVoted':
                const filteredUpVoted = commentData.upvotes.filter(upvote=> upvote !== activeUser.id);
                await newRef.update({upvotes:filteredUpVoted});
                setCommentState(oldState=>({state:'none',voteNum:oldState.voteNum-1}))
                break
            case 'downVoted':
                const filteredDownVotes = commentData.downvotes.filter(downvote=> downvote !== activeUser.id);
                const addedUpVote = [...commentData.upvotes,activeUser.id];
                await newRef.update({upvotes:addedUpVote,downvotes:filteredDownVotes});
                setCommentState(oldState=>({state:'upVoted',voteNum:oldState.voteNum+2}))
                break;
            case 'none':
                const addedUpVote1 = [...commentData.upvotes,activeUser.id];
                await newRef.update({upvotes:addedUpVote1});
                setCommentState(oldState=>({state:'upVoted',voteNum:oldState.voteNum+1}))
                break;
            default:
                console.log('nothing happened');
                break;
        }
    }
    const downVoteHandler = async ()=>{
        const commentRef = await fire.firestore().collection('comments').where('id','==',comment.id).get();
        const commentData = commentRef.docs[0].data();
        const newRef = await fire.firestore().collection('comments').doc(`${comment.id}`);
        switch(commentState.state){
            case 'upVoted':
                const filteredUpVotes = commentData.upvotes.filter(upvote=> upvote !== activeUser.id);
                const addedDownVote = [...commentData.downvotes,activeUser.id];
                await newRef.update({upvotes:filteredUpVotes,downvotes:addedDownVote});
                setCommentState(oldState=>({state:'downVoted',voteNum:oldState.voteNum-2}))
                break
            case 'downVoted':
                const filteredDownVotes = commentData.downvotes.filter(downvote=> downvote !== activeUser.id);
                await newRef.update({downvotes:filteredDownVotes});
                setCommentState(oldState=>({state:'none',voteNum:oldState.voteNum+1}))
                break;
            case 'none':
                const addedDownVote1 = [...commentData.downvotes,activeUser.id];
                await newRef.update({downvotes:addedDownVote1});
                setCommentState(oldState=>({state:'downVoted',voteNum:oldState.voteNum-1}))
                break;
            default:
                console.log('nothing happened');
                break;
        }
    }
    return(
        <div className="comment">
            <div className="commentDetails">
                <div className="profilePic commentpic"> <span className="ownerPic">
                        {
                            owner?<img className="actualOwnerPic" src={owner.img} />:comment.owner
                        }
                    </span></div>
                <div className="votes commentVotes">
                    <FontAwesomeIcon onClick={upVoteHandler} icon={faArrowDown} className={`upVote vote commentVote ${commentState.state === 'upVoted'?'active':''}`} />
                    <p className={`voteDiff ${commentState.state ==='upVoted'?'active':commentState.state === 'downVoted'?'downActive':''}`}>{commentState.voteNum}</p>
                    <FontAwesomeIcon  onClick={downVoteHandler} icon={faArrowDown} className={` downVote vote commentVote ${commentState.state === 'downVoted'?'active':''}`} />
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