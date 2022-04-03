import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons"; 
const Post=({post})=>{
    return(
        <div className="postContainer">
            <div className="postInfo">
                <div className="profilePic">
                    <span className="owenerId">{post.owner}</span>
                </div>
                <div className="votes">
                    <FontAwesomeIcon icon={faArrowDown} className='upVote vote' />
                    <p className="voteDiff">{post.upvotes.length- post.downvotes.length}</p>
                    <FontAwesomeIcon icon={faArrowDown} className='downVote vote' />
                </div>
            </div>
            <div className="postText">
                    {post.text}
            </div>
        </div>
    )
}


export default Post;