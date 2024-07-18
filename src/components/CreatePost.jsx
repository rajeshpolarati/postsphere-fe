import { Button, Textarea, useToast } from '@chakra-ui/react'
import React, { useEffect, useMemo } from 'react'
import { addPost } from '../api/user'
import { useAsync } from '../utils/useAsync'
import { useSetLoading } from '../utils/handlers'
import { handleSuccesToast } from '../utils/util'
import { useDispatch } from 'react-redux'

const CreatePost = () => {
  const toast = useToast()
  const [content, setContent] = React.useState('')
  const {data: postCreatedData, isLoading, execute: createPost} = useAsync(addPost)
  const dispatch = useDispatch()
  const handleSubmit = async(e) => {
    e.preventDefault()
    await createPost({content})
  }
  useEffect(()=>{
    if(postCreatedData?.success){
      handleSuccesToast('Post created successfully', toast)
      setContent('')
      dispatch({type:'ADD_NEW_POST', payload: postCreatedData?.data})
    }
  },[postCreatedData])

  const showLoading = useMemo(()=>{return isLoading}, [isLoading])
  useSetLoading(showLoading)
  return (
    <div className='create_post_section'>
      <form onSubmit={handleSubmit}>
      <div className='create_post_section_inner'>
        <div className='post_input'>
        <Textarea className='create_post_input' focusBorderColor="white" required placeholder='Create a Post...' value={content} onChange={(e)=>{
          setContent(e.target.value)
        }}/>
        </div>
        <div className='create_post_btn'>
            <Button colorScheme='teal' size={"sm"} type='submit'>Share</Button>
        </div>
      </div>
      </form>

    </div>
  )
}

export default CreatePost
