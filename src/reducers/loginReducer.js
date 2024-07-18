const initialState = {
    isLoggedIn: false,
    loggedInUser: null,
    notifications: [],
    showNotifications: false
}

export const LoginReducer = (state = initialState, action) => {
    switch (action.type) {
       case 'LOGIN_SUCCESS':{
         return {...state,isLoggedIn: true, loggedInUser: action.payload }
       }
      case 'LOGOUT':
         return {notifications:[], loggedInUser: null,isLoggedIn:false}
      case 'SET_NOTIFICATIONS': 
         return {...state, notifications: [...state.notifications, action.payload], showNotifications: true}
      case 'RESET_NOTIFICATIONS': 
         return {...state, showNotifications: false}
       default:
          return state;
    }
 }