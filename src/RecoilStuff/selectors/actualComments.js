import { selector ,noWait} from "recoil"
import { activePostCommentsSelector } from ".."

const ActualComments = selector({
    key:'actualCommentsSelector',
    get:({get})=>{
        const comments = get(noWait(activePostCommentsSelector));
        if(comments.state === 'hasValue'){
            return comments.contents
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