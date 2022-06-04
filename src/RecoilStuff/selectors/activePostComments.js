import { selector ,selectorFamily,waitForAll} from "recoil";
import { activePostAtom } from "..";
import fire from "../../fireconfig";
const singleCommentSelector = selectorFamily({
    key:'singleCommentSelector',
    get:(commentId)=>async({get})=>{
        const ref = await fire.firestore().collection('comments').doc(`${commentId}`).get()
        return await ref.data();
    }
})
const ActivePostCommentsSelector = selector({
    key:'activePostCommentsSelector',
    get:async ({get})=>{
        const activePost = get(activePostAtom);
        if(activePost.post?.comments){
            const commentArray = get(waitForAll(
                activePost.post.comments.map(comment=> singleCommentSelector(comment))
            ))
            return commentArray
        }
    }
});




export default ActivePostCommentsSelector;