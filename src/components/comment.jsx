import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
const Comment = ({comment})=>{
    return(
        <div className="comment">
            <div className="commentDetails">
                <div className="profilePic commentpic"><span className="owenerId">1</span></div>
                <div className="votes commentVotes">
                    <FontAwesomeIcon  icon={faArrowDown} className={`upVote vote commentVote`} />
                    <p className={`voteDiff`}>1</p>
                    <FontAwesomeIcon  icon={faArrowDown} className={` downVote vote commentVote`} />
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