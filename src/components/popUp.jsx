import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown , faXmark} from "@fortawesome/free-solid-svg-icons";
import Comment from "./comment";
import { useRecoilState,useRecoilValue  } from "recoil";
import { popUpActiveAtom ,activePostAtom ,actualComments } from "../RecoilStuff";
const PopUp = ()=>{
    const [popUpActive , setPopUpActive] = useRecoilState(popUpActiveAtom);
    const activePost = useRecoilValue(activePostAtom);
    const comments = useRecoilValue(actualComments);
    const closeHandler = ()=>{
        setPopUpActive(oldPopUp=>(!oldPopUp))
    }
    if(activePost.id){
    return(
        <div  className={`PopUpContainer ${popUpActive?'popUpEnable':'popUpDisable'}`}>
            <span onClick={closeHandler} className="closeButton">
                <FontAwesomeIcon icon={faXmark} />
            </span>
            <div className="popUpPost">
                <div className="popUpPostDetails">
                    <div className="profilePic popUpPic">
                        <span className="owenerId">{activePost.owner}</span>
                    </div>
                    <div className="votes">
                    <FontAwesomeIcon  icon={faArrowDown} className={`upVote vote `} />
                    <p className={`voteDiff`}>{activePost.upvotes.length - activePost.downvotes.length}</p>
                    <FontAwesomeIcon  icon={faArrowDown} className={` downVote vote`} />
                    </div>
                </div>
                <div className="popUpPostInfo">
                    {activePost.text}
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
    <div>FUvk</div>
)
}

export default PopUp;