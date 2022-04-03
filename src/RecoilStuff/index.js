import SignedInfo from "./atoms/signedInfo";
import IsLogged from "./selectors/isLogged";
import Posts from "./selectors/PostsSelector";
import PostNumber from "./atoms/postnumber";
import ActualPostsSelector from "./selectors/actualPostSelector";


export const actualPostsSelector = ActualPostsSelector;
export const postNumber = PostNumber;
export const posts = Posts;
export const signedInfo = SignedInfo;
export const isLogged = IsLogged;