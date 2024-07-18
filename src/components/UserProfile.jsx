import { Avatar, Button, useDisclosure, useToast } from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MdLocationPin } from "react-icons/md";
import { LuExternalLink } from "react-icons/lu";

import "../styles/userprofile.css";
import EditProfile from "./EditProfile";
import Home from "./Home";
import { deletePostApi, editUserDetails, getOtherUserPosts, getProfileInfo, getUserPosts } from "../api/user";
import { useDispatch, useSelector } from "react-redux";
import { useAsync } from "../utils/useAsync";
import { useLocation } from "react-router-dom";
import { useSetLoading } from "../utils/handlers";
import { getName, handleSuccesToast } from "../utils/util";
import Post from "./Post";
import connection from "../socket";
import UserPostSection from "./UserPostSection";

const UserProfile = () => {
  const {data: profileInfo, isLoading:profileInfoLoading, execute: getProfileInfoCall} = useAsync(getProfileInfo)
  const {data: editInfoData, isLoading:editInfoLoading, execute: editInfoCall} = useAsync(editUserDetails)
  // const {data: userPostsList,  isLoading:userPostLoading, execute: getuserPostsList} = useAsync(getUserPosts)
  const {data: otherUserPostsList,  isLoading:otherUserPostLoading, execute: getOtherUserPostsList} = useAsync(getOtherUserPosts)
  const [editPayload, setEditPayload] = React.useState({firstName: '', lastName: '', bio: '', url: ''})
  const {personPosts, userPosts, showPostsLoading, hasUserPostsMore, showUserPosts} = useSelector(state => state.posts)
  const {loggedInUser} = useSelector(state => state.login)
  const [followingHim, setFollowingHim]= useState(false);
  const dispatch = useDispatch()
  const [profileData, setProfileData] = React.useState({})
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = useRef(null)
    const finalRef = useRef(null)
    const location = useLocation();
    const toast = useToast()
    const handleReset = async () => {
      setEditPayload({
        firstName: profileData?.firstName || '',
        lastName: profileData?.lastName || '',
        bio: profileData?.bio || '',
        url: profileData?.url || ''
      })
    }
    const handleOnClose = () => {
      handleReset();
      onClose()
    }
    const handleEdit = async(e) => {
      e.preventDefault()
     await editInfoCall(editPayload)
    }

    useEffect(() => {
      if(editInfoData?.success){
      handleSuccesToast('Details updated successfully', toast)
      handleReset()
      getProfileInfoCall({id:location.state?.userId})
      onClose()
      }
    },[editInfoData])
    
    useEffect(()=>{
      if(profileInfo?.success && profileInfo?.data){
        setProfileData(profileInfo?.data)
        setFollowingHim(profileInfo?.data?.followingHim)
        setEditPayload({
          firstName: profileInfo?.data?.firstName || '',
          lastName: profileInfo?.data?.lastName || '',
          bio: profileInfo?.data?.bio || '',
          url: profileInfo?.data?.url || ''
        })
      }
    },[profileInfo])

    useEffect(() => {
      if(otherUserPostsList?.data){
        dispatch({type: 'ADD_USER_POSTS', payload: otherUserPostsList.data})
      }
    }, [otherUserPostsList])

    useEffect(() => {
      if(showUserPosts){
        if(location.state?.userId){
          getProfileInfoCall({id:location.state?.userId})
          getOtherUserPostsList({pageSize:10, page:1}, location.state?.userId)
        }else if(loggedInUser?.id){
          getProfileInfoCall({id:loggedInUser?.id})
          getOtherUserPostsList({pageSize:10, page:1}, loggedInUser?.id)
        }
      }
    }, [showUserPosts]);
  
    useEffect(() => {
      if(location.state?.userId){
        dispatch({ type: "TOGGLE_SHOW_USER_POSTS", payload:location.state?.userId });
      }else if(loggedInUser?.id) {
        dispatch({ type: "TOGGLE_SHOW_USER_POSTS", payload:loggedInUser?.id });
      }
      return ()=> {
        dispatch({ type: "RESET_DEFAULT_STATE"});
      }
    }, [location]);
    const debounce = (func, delay) => {
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
    const handleLikeChange = (text) => {
      if(text === 'followUser'){
        connection?.emit('followUser', location.state?.userId)
      }
      if(text === 'unFollowUser'){
        connection?.emit('unfollowUser', location.state?.userId)
      }
    };
    const debouncedChange = debounce(handleLikeChange, 1000);
    const showLoading = useMemo(()=>{return profileInfoLoading || editInfoLoading || otherUserPostLoading}, [profileInfoLoading, editInfoLoading, otherUserPostLoading])
    useSetLoading(showLoading)
  return (
    <Home>
      <div className="user_profile_section">
      <div className="user_details">
        <div className="user_name">{ profileData?.firstName ? `${profileData?.firstName} ${profileData?.lastName}`: ''}  &nbsp;{loggedInUser?._id !== location.state?.userId && 
          <>
          {loggedInUser?.id !== profileData?._id &&
          <button className="follow-text" onClick={()=>{
            setFollowingHim(!followingHim)
            debouncedChange(followingHim? 'unFollowUser': 'followUser')
          }}>{followingHim ? 'Following':'Follow'}</button>
          }</>
          }</div>
        <div className="user_bio">{`${profileData?.bio || ''}`}</div>
        <div className="location_info">
           {profileData?.location &&<MdLocationPin/>}&nbsp;<span>{profileData?.location || ''}</span>&nbsp;<span>{profileData?.url && <a href={profileData?.url} target="_blank" ><LuExternalLink/></a>}</span>
        </div>
        {
          <div className="user_stats">
          <div className="stat_item">
            <div className="stat_label">Posts</div>
            <div className="stat_value">{profileData?.postCount || 0}</div>
          </div>
          <div className="stat_item">
            <div className="stat_label">Followers</div>
            <div className="stat_value">{profileData?.followerCount || 0}</div>
          </div>
          <div className="stat_item">
            <div className="stat_label">Following</div>
            <div className="stat_value">{profileData?.followingCount || 0}</div>
          </div>
        </div>
        }
 
      </div>
      <div className="user_profile_img">
        <Avatar
        name={getName(profileData)}
        src="https://bit.ly/broken-link"
        size="md"
        bg={profileData?.color}
         className="profile_avatar"
        />
         {
          location.state?.userId === loggedInUser?.id &&
        <Button variant="outline" size={"sm"} ref={finalRef} onClick={onOpen}>
          Edit Profile
        </Button>
        }
      </div>
      <EditProfile isOpen={isOpen} onOpen={onOpen} onClose={handleOnClose} initialRef={initialRef} finalRef={finalRef} editPayload={editPayload} setEditPayload={setEditPayload} handleEdit={handleEdit}/>
      </div>
      <UserPostSection
        showLoading={showLoading}
        posts={userPosts || []}
        hasMore={hasUserPostsMore}
      >
      {userPosts?.length === 0 && showPostsLoading?.length === 0 ? (
          <div className="empty_list">
            Your feed is empty. Share your story! 😃
          </div>
        ) : (
          ""
        )}
      </UserPostSection>
    </Home>

  );
};

export default UserProfile;
