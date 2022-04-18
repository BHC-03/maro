import SignedInfo from "./atoms/signedInfo";
import IsLogged from "./selectors/isLogged";
import Posts from "./selectors/PostsSelector";
import PostNumber from "./atoms/postnumber";
import ActualPostsSelector from "./selectors/actualPostSelector";
import PopUpActiveAtom from "./atoms/popUpActive";
import ActivePostAtom from "./atoms/activePost";
import ActivePostCommentsSelector from "./selectors/activePostComments";
import ActualComments from "./selectors/actualComments";

export const actualComments = ActualComments;
export const activePostCommentsSelector = ActivePostCommentsSelector;
export const activePostAtom = ActivePostAtom;
export const actualPostsSelector = ActualPostsSelector;
export const postNumber = PostNumber;
export const posts = Posts;
export const signedInfo = SignedInfo;
export const isLogged = IsLogged;
export const popUpActiveAtom = PopUpActiveAtom;