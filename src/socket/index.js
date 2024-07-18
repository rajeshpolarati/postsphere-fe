import { getName } from '../utils/util';
import store from '../store'
const io = require('socket.io-client');
let connection = io.connect('http://localhost:3001');

export const connectSocket = async (user)=>{
    try {
        connection.on('connect', () => {
            console.log('Connected to the server');
        });
        connection.on('post-created', (postData)=> {
            if(postData && postData?.postId){
                let message = `${getName(postData)} has created a new post, Check it out!!`;
                let state = {state:{post:{_id: postData?.postId}}}
                store?.dispatch({type: 'SET_NOTIFICATIONS', payload: {message, state, from: 'post'}})
            }
        })
        connection.on('comment-created', (commentData)=> {
            if(commentData && commentData?.commentedByDetails && commentData?.commentDetails?.postId){
                let message = `${getName(commentData?.commentedByDetails)} has commented on your Post`;
                let state = {state:{post:{_id: commentData?.commentDetails?.postId}}}
                store?.dispatch({type: 'SET_NOTIFICATIONS', payload: {message, state, from: 'post'}})
            }
        })
        connection.on('post-like-created', (likeData)=> {
            if(likeData &&likeData?.post && likeData?.likedByDetails){
                let message = `${getName(likeData?.likedByDetails)} has Liked your Post`;
                let state = {state:{post:{_id: likeData?.post?.postId}}}
                store?.dispatch({type: 'SET_NOTIFICATIONS', payload: {message, state, from: 'post'}})

            }
        })
        connection.on('comment-like-created', (likeData)=> {
            if(likeData &&likeData?.post && likeData?.likedByDetails){
                let message = `${getName(likeData?.likedByDetails)} has Liked your Comment`;
                let state = {state:{post:likeData?.post}}
                store?.dispatch({type: 'SET_NOTIFICATIONS', payload: {message, state, from: 'post'}})

            }
        })
        connection.on('follow-created', (followerData)=> {
            if(followerData &&followerData?.follower && followerData?.following){
                let message = `${getName(followerData?.follower)} is Following you`;
                let state = {state:{userId:followerData?.follower?.id}}
                store?.dispatch({type: 'SET_NOTIFICATIONS', payload: {message, state, from: 'profile'}})

            }
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const disconnectSockets = async () => {
    connection.off('connect')
    connection.off('post-created');
    connection.off('comment-created');
    connection.off('post-like-created');
    connection.off('comment-like-created');
    connection.off('follow-created');
}
console.log({connection});
export default connection;