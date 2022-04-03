import { selector  ,  noWait} from "recoil";
import Posts from "./PostsSelector";

const actualPostsSelector = selector({
    key:'actualPostsSelector',
    get:({get})=>{
        const posts = get(noWait(Posts))
        if(posts.state === 'hasValue'){
            return posts.contents
        }
        if(posts.state === 'loading'){
            return null
        }
        if(posts.state === 'hasError'){
            return null
        }
    }
})

export default actualPostsSelector;