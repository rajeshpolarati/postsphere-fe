import React, { useEffect, useMemo } from 'react'
import Home from './Home'
import { useAsync } from '../utils/useAsync'
import { deletePostApi, getBookmarks } from '../api/user'
import { useSetLoading } from '../utils/handlers'
import { useDispatch, useSelector } from 'react-redux'
import Post from './Post'
import UserPostSection from './UserPostSection'

const UserBookmarks = () => {
  const {bookmarks, hasBookmarkPostsMore, showPostsLoading, showBookmark} = useSelector(state => state.posts)
  const {data: bookmarksList, resetState: bookmarkReset, isLoading:bookMarksLoading, execute: getBookmarksList} = useAsync(getBookmarks)
  const dispatch = useDispatch()

  useEffect(()=>{
    if(bookmarksList?.success){
        dispatch({type: 'ADD_BOOKMARKS', payload: bookmarksList.data})
        bookmarkReset()
    }
  },[bookmarksList])

  useEffect(() => {
    if(showBookmark){
      getBookmarksList({pageSize: 10, page: 1})
    }
  }, [showBookmark]);

  useEffect(() => {
    dispatch({ type: "TOGGLE_SHOW_BOOKMARK" });
  }, []);
  const showLoading = useMemo(()=>{return bookMarksLoading }, [bookMarksLoading])
  useSetLoading(showLoading)
  return (
    <Home>
      <UserPostSection
        showLoading={showLoading}
        posts={bookmarks || []}
        hasMore={hasBookmarkPostsMore}
      >
        <div className='header_main_content'>
            My Bookmarks
          </div>
          {bookmarks?.length === 0 && showPostsLoading?.length === 0 ? (
          <div className="empty_list">
            No bookmarks so far. Save your top picks!
          </div>
        ) : (
          ""
        )}
      </UserPostSection>
    </Home>
  )
}

export default React.memo(UserBookmarks);
