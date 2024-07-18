import { Avatar, Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure, useToast } from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineInsertComment } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiBookmark } from "react-icons/fi";

import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import "../styles/post.css";
import { useDispatch, useSelector } from "react-redux";
import { getName, handleSuccesToast, timeAgo } from "../utils/util";
import { editPostApi } from "../api/user";
import { useAsync } from "../utils/useAsync";
import { useSetLoading } from "../utils/handlers";
import connection from "../socket";
 
const Post = ({post, deletePost, hideSettings = false, refFunc = null}) => {
  const {loggedInUser} = useSelector(state => state.login)
  const [time, setTime] = useState(timeAgo(post?.createdAt))
  const {showLatest, showTrending} = useSelector(state => state.posts)
  const {data: editInfoData, isLoading:editInfoLoading, execute: editPost} = useAsync(editPostApi)
  const [userLiked, setUserLiked] = useState(!!(post?.userlikes))
  const [isBookmarked, setIsBookmarked] = useState(!!(post?.bookMarkCount))
  const [likes, setLikes] = useState(post?.likeCount)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [editContent, setEditContent] = useState('')
  const toast = useToast()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  let timeInterval;

  const handleEdit = (e) => {
    e.preventDefault()
    editPost({content: editContent}, post?._id);
  }
  useEffect(() => {
    setLikes(post?.likeCount)
    timeInterval = setInterval(() => {
      setTime(timeAgo(post?.createdAt, post?.content));
    },[1000])
    return () => clearInterval(timeInterval)
  },[post])

  useEffect(() => {
    if(editInfoData?.success){
    handleSuccesToast('Post updated successfully', toast)
    dispatch({type: 'UPDATE_SPECIFIC_POST', payload: { from:  showLatest? 'latestPosts' : showTrending? 'trendingPosts' : 'userPosts', post: editInfoData.data}})
    onClose()
    }
  },[editInfoData])

  const debounceLike = (func, delay) => {
    let timerId;
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        func(...args);
        timerId = null;
      }, delay);
    };
  };
  const handleLikeChange = () => {
    connection?.emit('postLike', post?._id)
  };
  const debouncedChange = debounceLike(handleLikeChange, 1000);
  const debounceBookmark = (func, delay) => {
    let timerId;
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        func(...args);
        timerId = null;
      }, delay);
    };
  };
  const handleBookmarkChange = () => {
    connection?.emit('postBookmark', post?._id)
  };
  const debouncedBookmarkChange = debounceBookmark(handleBookmarkChange, 1000);
  const showLoading = useMemo(()=>{return editInfoLoading}, [editInfoLoading])
  useSetLoading(showLoading)
  return (
    <div className={`post_card`} ref={refFunc}>
      <div className="person_profile_img">
      <Avatar
        name={getName(post?.user?.[0])}
        src="https://bit.ly/broken-link"
        size="md"
        bg={post?.user?.[0]?.color}
      />
      </div>
      <div className="post_info">
        <div className="post_person_details">
          <div className="person_name">
            <Link to={`/profile/${post?.user?.[0]?.firstName}${post?.user?.[0]?.lastName}`} state={ {userId: post?.user?.[0]?._id }}>{`${post?.user?.[0]?.firstName} ${post?.user?.[0]?.lastName}`}</Link>
          </div>
          <div className="posted_time">{time}</div>
        </div>
        <div className="post_content" onClick={()=>{navigate('/post', {state:{post:post}})}}>
         {post?.content}
        </div>
        <div className="post_actions">
        <div className="like-icon">
           <AiOutlineLike className="icon like_icon" color={`${userLiked? 'teal': ''}`} onClick={()=>{
              if(userLiked){
                setLikes(likes - 1)
              }else{
                setLikes(likes + 1)
              }
              setUserLiked(!userLiked)
              debouncedChange()
            }
            }/> &nbsp;
          <div className="like_count">{likes}</div>
          </div>
          <div className="comment-icon">
          <MdOutlineInsertComment className="icon comment_icon "/>
          {post?.commentCount ? <div className="comment_count">{post?.commentCount > 9 ? '9+':  post?.commentCount}</div>: ''}
          </div>
          <div className="bookmark-icon">
           <FiBookmark className="icon bookmark_icon" color={`${isBookmarked? 'teal': ''}`} onClick={()=>{
            setIsBookmarked(!isBookmarked)
            debouncedBookmarkChange()
            }}/>
           </div>
        </div>
      </div>
      {loggedInUser?.id === post?.user?.[0]?._id && hideSettings === false && <div className="post_settings">
        <Menu isLazy >
          <MenuButton>
            <IconButton icon={<BsThreeDotsVertical w={3} h={3} />} />
          </MenuButton>
          <MenuList className="profile_options">
            <MenuItem onClick={()=>{
              setEditContent(post?.content)
              onOpen()
            }}>Edit</MenuItem>
            <MenuItem onClick={()=>{deletePost(post?._id)}}>Delete</MenuItem>
          </MenuList>
        </Menu>
      </div>}
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className="edit_post_modal">
        <form onSubmit={handleEdit}>
          <ModalHeader>Edit Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
          <Textarea  focusBorderColor="white" value={editContent} size="sm"onChange={(e)=>{
            setEditContent(e.target.value)
           }} required/>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='teal' mr={3} type='submit'>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

    </div>
  );
};

export default Post;
