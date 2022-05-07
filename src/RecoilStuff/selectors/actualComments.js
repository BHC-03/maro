import { selector ,noWait} from "recoil"
import { activePostCommentsSelector } from ".."

const ActualComments = selector({
    key:'actualCommentsSelector',
    get:({get})=>{
        const comments = get(noWait(activePostCommentsSelector));
        if(comments.state === 'hasValue'){
            const sorted =  comments.contents.map(comment=> comment);
            if(!!comments.contents[0]){
                sorted.sort((a,b)=>{
                    return ((b.upvotes.length - b.downvotes.length)-(a.upvotes.length - a.downvotes.length) )
                })
            }
            return sorted
        }
        if(comments.state === 'loading'){
            return null
        }
        if(comments.state === 'hasError'){
            return null
        }
    }
}) 



export default ActualComments;