import React from "react";
import "../styles/post.css";
import {
  Avatar,
  Button,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { getName } from "../utils/util";
import { useSelector } from "react-redux";

const PostAcomment = ({setCommentText, commentText, handleComment}) => {
  const {loggedInUser} = useSelector((state) => state.login)
  return (
    <div className="add_comment_section">
      <div className="profile_img">
      <Avatar
        name={getName(loggedInUser)}
        src="https://bit.ly/broken-link"
        size="md"
        bg={loggedInUser?.color}
      />
      </div>
      <InputGroup size="lg">
          <Input
            pr="4.5rem"
            className="comment_input"
            placeholder="Post your comment here..."
            type="text"
            size="lg"
            value={commentText}
            onChange={(e)=>{
              setCommentText(e.target.value)
            }}
          />
          <InputRightElement width="4.5rem" size="lg">
            <Button className= "post-btn" h="1.75rem" size="sm" bg="black" color="white" onClick={()=> {
              if(commentText?.length) handleComment()
            }}>
              Post
            </Button>
          </InputRightElement>
        </InputGroup>
    </div>
  );
};

export default PostAcomment;
