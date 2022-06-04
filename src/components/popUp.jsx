import React , {useState,useEffect,createRef,useLayoutEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown , faXmark} from "@fortawesome/free-solid-svg-icons";
import Comment from "./comment";
import { useRecoilState,useRecoilValue  } from "recoil";
import { popUpActiveAtom ,activePostAtom ,actualComments,signedInfo } from "../RecoilStuff";
import fire from "../fireconfig";
import { v4 as uuidv4 } from 'uuid';
const PopUp = ()=>{
    const [popUpActive , setPopUpActive] = useRecoilState(popUpActiveAtom);
    const [activePost,setActivePost] = useRecoilState(activePostAtom);
    const comments = useRecoilValue(actualComments);
    const activeUser = useRecoilValue(signedInfo);
    const postRef = createRef();
    const [text,setText] = useState('')
    const [owner,setOwner] = useState();
    useEffect(()=>{
        if(activePost.post){
            getowner()
            
        }
    },[activePost])
    
    
    const upVoteHandler =  async () => {
        const postRef = await fire.firestore().collection('posts').where('id','==',activePost.post.id).get();
        const postInfo = postRef.docs[0].data();
        const newRef = await fire.firestore().collection('posts').doc(`${activePost.post.id}`);
        
        switch(activePost.state.state){
            case'upVoted':
                const filtered = postInfo.upvotes.filter(id=> id !== activeUser.id);
                await newRef.update({upvotes:filtered});
                setActivePost(oldPost=>({...oldPost,state:{state:'none',voteNum:oldPost.state.voteNum-1}}))
                break
            case'downVoted':
                const filteredDownVotes = postInfo.downvotes.filter(id=> id!== activeUser.id);
                const addedUpvotes = [...postInfo.upvotes,activeUser.id]
                await newRef.update({downvotes:filteredDownVotes,upvotes:addedUpvotes});
                setActivePost(oldPost=>({...oldPost,state:{state:'upVoted',voteNum:oldPost.state.voteNum+2}}))
                break
            case'none':
                const addedUpvotes1 = [...postInfo.upvotes,activeUser.id]
                await newRef.update({upvotes:addedUpvotes1});
                setActivePost(oldPost=>({...oldPost,state:{state:'upVoted',voteNum:oldPost.state.voteNum+1}}))
                break
            default:
                console.log('nothing happend')
        }

    }
    const getowner = ()=>{
        fire.firestore().collection('users').where('id','==',activePost.post.owner).get().then(data=>{
            setOwner(data.docs[0].data())
        })
    }
    const textHandler = (e)=>{
        setText(e.target.value)
    }
    const postCommentHandler =async ()=>{
        if(!!text){
            const postRef = await fire.firestore().collection('posts').doc(`${activePost.post.id}`)
            const id = await uuidv4()
            const newComment = {
                time: new Date().getTime(),
                owner:activeUser.id,
                post:activePost.post.id,
                downvotes:[],
                upvotes:[],
                text:text,
                id,
            }
            await fire.firestore().collection('comments').doc(`${id}`).set(newComment)
            if(activePost.post.comments){
                console.log([...activePost.post.comments])
                await postRef.update({comments:[...activePost.post.comments,id]});
                setActivePost(oldActive =>({...oldActive,post:{...oldActive.post,comments:[...oldActive.post.comments,id]}}))
            }else{
                await postRef.update({comments:[id]});
                setActivePost(oldActive =>({...oldActive,post:{...oldActive.post,comments:[id]}}))
            }
            setText('');
        }else{
            return
        }
    }
    const downVoteHandler = async ()=>{
        const postRef = await fire.firestore().collection('posts').where('id','==',activePost.post.id).get();
        const postInfo =  postRef.docs[0].data();
        console.log(activePost.setState);
        const newRef = await fire.firestore().collection('posts').doc(`${activePost.post.id}`);
        switch(activePost.state.state){
            case'upVoted':
                const filteredUpVotes = postInfo.upvotes.filter(id=> id !== activeUser.id);
                const addedDownVote = [...postInfo.downvotes,activeUser.id]
                await newRef.update({upvotes:filteredUpVotes,downvotes:addedDownVote});
                setActivePost(oldPost=>({...oldPost,state:{state:'downVoted',voteNum:oldPost.state.voteNum-2}}))
                break
            case'downVoted':
                const filteredDownVotes = postInfo.downvotes.filter(id=> id !== activeUser.id);
                await newRef.update({downvotes:filteredDownVotes});
                setActivePost(oldPost=>({...oldPost,state:{state:'none',voteNum:oldPost.state.voteNum+1}}));
                break
            case'none':
                const AddedDownVote = [...postInfo.downvotes,activeUser.id];
                await newRef.update({downvotes:AddedDownVote});
                setActivePost(oldPost=>({...oldPost,state:{state:'downVoted',voteNum:oldPost.state.voteNum-1}}))
                break
            default:
                console.log('nothing happend')
        }
    }
    const closeHandler = ()=>{
        setPopUpActive(oldPopUp=>(!oldPopUp))
    }
    if(activePost.post?.id){
        
    return(
        <div  className={`PopUpContainer ${popUpActive?'popUpEnable':'popUpDisable'}`}>
            <span onClick={closeHandler} className="closeButton">
                <FontAwesomeIcon icon={faXmark} />
            </span>
            <div className="popUpPost" >
                <div className="popUpPostDetails">
                    <div className="profilePic popUpPic">
                    <span className="ownerPic">
                        {
                            owner?<img className="actualOwnerPic" src={owner.img} />:activePost.post.owner
                        }
                    </span>
                    </div>
                    <div className="votes">
                    <FontAwesomeIcon onClick={upVoteHandler} icon={faArrowDown} className={`upVote vote ${activePost.state.state === 'upVoted'?'active':''} `} />
                    <p className={`voteDiff ${activePost.state.state === 'upVoted'?'active':activePost.state.state === 'downVoted'?'downActive':''}`}>{activePost.state.voteNum}</p>
                    <FontAwesomeIcon onClick={downVoteHandler} icon={faArrowDown} className={` downVote vote ${activePost.state.state === 'downVoted'?'active':''}`} />
                    </div>
                </div>
                <div ref={postRef} className="popUpPostInfo">
                    {activePost.post.text}
                    <div className="commentInputContainer">
                    <textarea onChange={textHandler} value={text} placeholder="what are your thoughts on this" className="commentInput" rows={10} cols={10}></textarea>
                    <span onClick={postCommentHandler} className="postComment">Post</span>
                    </div>
                    
                </div>
                
                
            </div>
            <div className="commentsContainer">
                
                {
                    comments && comments.map(comment=>{
                        return <Comment key={comment.id} comment={comment} />
                    })
                }
            </div>
        </div>
    )
}
return(
    <></>
)
}

export default PopUp;