import { selector } from "recoil";
import { activePostAtom } from "..";
import fire from "../../fireconfig";
const ActivePostCommentsSelector = selector({
    key:'activePostCommentsSelector',
    get:async ({get})=>{
        const activePost = get(activePostAtom);
        const commentarray =[]  
        if(activePost.id){
            const commentsRef = await fire.firestore().collection('comments').where('post','==',activePost.id).get();
            commentsRef.forEach(comment=>{
            commentarray.push(comment.data());
        })
        }
        return commentarray;
    }
})

export default ActivePostCommentsSelector;