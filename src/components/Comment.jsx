import { Avatar, Button, IconButton, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { getName, handleSuccesToast, timeAgo } from '../utils/util';
import connection from "../socket";
import { useSelector } from 'react-redux';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useAsync } from '../utils/useAsync';
import { updateComment } from '../api/user';
import { useSetLoading } from '../utils/handlers';

const Comment = ({comment, lastChildCallBack, deleteComment, handleUpdateComment}) => {
  const {data: editInfoData, isLoading:editInfoLoading, execute: editPost} = useAsync(updateComment)
  const [isLiked, setIsLiked] = useState(comment?.isUserLiked || false)
  const [time, setTime] = useState(timeAgo(comment?.createdAt))
  const { loggedInUser } = useSelector((state) => state.login);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [editContent, setEditContent] = useState('')
  const toast = useToast()
  let timeInterval;
  useEffect(() => {
    timeInterval = setInterval(() => {
      setTime(timeAgo(comment?.createdAt, comment?.content));
    },[1000])
    return () => clearInterval(timeInterval)
  },[comment])
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
    connection?.emit('commentLike', comment?._id)
  };
  const handleEdit = (e) => {
    e.preventDefault()
    editPost({comment: editContent}, comment?._id);
  }
  useEffect(() => {
    if(editInfoData?.success){
    handleSuccesToast('Comment updated successfully', toast)
    handleUpdateComment(editInfoData?.data)
    onClose()
    }
  },[editInfoData])
  const debouncedChange = debounceLike(handleLikeChange, 1000);
  const showLoading = useMemo(() => {
    return editInfoLoading;
  }, [editInfoLoading]);  
  useSetLoading(showLoading);
  return (
    <div className='post_comment_section' ref={lastChildCallBack}>
     <div className="person_profile_img">
     <Avatar
      name={getName(comment?.user?.[0])}
      src="https://bit.ly/broken-link"
      size="md"
      bg={comment?.user?.[0]?.color}
     />
      </div>
      <div className="comment_info">
        <div className="comment_person_details">
          <div className="person_name">
            <Link to="">{`${comment?.user?.[0]?.firstName} ${comment?.user?.[0]?.lastName}`}</Link>
          </div>
          <div className="commented_time">{time}</div>
        </div>
        <div className="comment_content">
         {comment?.comment}
        </div>
       { (loggedInUser?.id === comment?.user?.[0]?._id || loggedInUser?.id === comment?.user?.[0]?.id) ?<div className='options'>
          <p onClick={()=>{
            setEditContent(comment?.comment)
            onOpen()
          }}>Edit</p>
          <p onClick={()=>{deleteComment(comment?._id)}}>Delete</p>
        </div> : ''}
      </div>
      {(loggedInUser?.id === comment?.user?.[0]?._id || loggedInUser?.id === comment?.user?.[0]?.id) ?   <div className="comment_interaction">
          {isLiked ? <FaHeart className='icon icon_liked' onClick={()=>{
              debouncedChange()
              setIsLiked(!isLiked)
            }
            }/>: <FaRegHeart className='icon' onClick={()=>{
              debouncedChange()
              setIsLiked(!isLiked)
            }}/>}
      </div> : ''}
      {/* {(loggedInUser?.id === comment?.user?.[0]?._id || loggedInUser?.id === comment?.user?.[0]?.id) && <div className="post_settings">
        <Menu isLazy >
          <MenuButton>
            <IconButton icon={<BsThreeDotsVertical w={3} h={3} />} />
          </MenuButton>
          <MenuList className="profile_options">
            <MenuItem onClick={()=>{
              setEditContent(comment?.comment)
              onOpen()
            }}>Edit</MenuItem>
            <MenuItem onClick={()=>{deleteComment(comment?._id)}}>Delete</MenuItem>
          </MenuList>
        </Menu>
      </div>} */}
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
  )
}

export default Comment
