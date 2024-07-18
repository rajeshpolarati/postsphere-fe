import { Avatar, Button } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getLastestPosts, getRecommendation, getTrendingPosts } from "../api/user";
import { useAsync } from "../utils/useAsync";
import { useDispatch, useSelector } from "react-redux";
import { useSetLoading } from "../utils/handlers";
import { getName } from "../utils/util";

const Recommendation = () => {
  const {recommendations, showLatest, showTrending} = useSelector(state => state.posts)
  const {data: trendingPostsList, resetState: resetTrendList, isLoading:trendingLoading, execute:getTrendingPostsList} = useAsync(getTrendingPosts)
  const {data: latestPostsList, resetState: resetLatestList, isLoading:latestLoading, execute: getLatestPostsList} = useAsync(getLastestPosts)
  const {data: recommendList, resetState: resetRecommendations, execute: getRecommendList} = useAsync(getRecommendation)
  const dispatch = useDispatch();
  
  useEffect(() => {
    if(trendingPostsList?.data){
      dispatch({type: 'TOGGLE_SHOW_TRENDING'})
      dispatch({type: 'ADD_TRENDING_POSTS', payload: trendingPostsList.data})
      resetTrendList()
    }
  }, [trendingPostsList])

  useEffect(() => {
    if(latestPostsList?.data){
      dispatch({type: 'TOGGLE_SHOW_LATEST'})
      dispatch({type: 'ADD_LATEST_POSTS', payload: latestPostsList.data})
      resetLatestList()
    }
  }, [latestPostsList])
  
  useEffect(() => {
    if(recommendList?.data){
      dispatch({type: 'ADD_RECOMMENDATIONS', payload: recommendList.data})
      resetRecommendations()
    }
  }, [recommendList])
  useEffect(() => {
    getRecommendList()
  }, [])
  const showLoading = useMemo(() => {
    return trendingLoading || latestLoading;
  }, [trendingLoading, latestLoading]);
  useSetLoading(showLoading)

  return (
    <div className="recommend_section">
      {window?.location?.pathname === '/home' && <div className="recommend_btns">
        <button className="latest_btn" onClick={()=>{
          if(!showLatest){
            dispatch({type: 'RESET_DEFAULT_STATE'})
            getLatestPostsList({ page: 1, pageSize: 10 })
          }
        }}><span>Get Latest Post</span></button>
        <button className="trending_btn" onClick={()=>{
           if(!showTrending){
            dispatch({type: 'RESET_DEFAULT_STATE'})
            getTrendingPostsList({ page: 1, pageSize: 10 })
           }
        }} ><span>Show trending</span></button>
      </div>}
      <div className="recommend_people">
        <div className="rec_header">Recommended People</div>

        <div className="rec_people_ls">
        {
            recommendations?.map((person, index) => (
              <div key={index} className="rec_people_details">
                 <div className="person_pic">
                 <Avatar
                  name={getName(person)}
                  src="https://bit.ly/broken-link"
                  size="md"
                  bg={person.color}
                />
                 </div>
                 <div className="person_name_info">
                      <div className="person_name"><Link to={`/profile/${person?.firstName}${person?.lastName}`} state={ {userId: person?._id }}>{`${person?.firstName} ${person?.lastName}`}</Link></div>
                      <div className="person_bio">{person?.bio}</div>
                 </div>
              </div>
            ))
        }
        </div>
      </div>
    </div>
  );
};

export default Recommendation;
