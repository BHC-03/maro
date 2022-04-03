import { selector } from "recoil";
import fire from '../../fireconfig';
import postNumber from "../atoms/postnumber";

const number ={value:0}
const posts = selector({
    key: 'postsSelector',
    get: async ({ get }) => {
        const postsnumbers = get(postNumber);
        const postsArray = [];
        const ref = await fire.firestore().collection('posts').orderBy('id').limit(10).startAt(postsnumbers).get();
        if (ref.empty) {
            const newRef = await fire.firestore().collection('posts').orderBy('id').startAt(number.value).get();
            if (newRef.empty) {
                return null
            }
            newRef.forEach(post => {
                postsArray.push(post.data());
                number.value++
            })
            return postsArray;
        }
        ref.forEach(post => {
            console.log(post)
            postsArray.push(post.data());
            number.value++;
        })
        return postsArray
    }

})

export default posts;