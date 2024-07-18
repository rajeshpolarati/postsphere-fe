import { combineReducers } from 'redux';
import { LoginReducer } from './loginReducer';
import { ApperanceReducer } from './appearanceReducer';
import { postsReducer } from './postsReducer';


const rootReducer = combineReducers({
  login: LoginReducer,
  appearance: ApperanceReducer,
  posts: postsReducer
});

export default rootReducer;
