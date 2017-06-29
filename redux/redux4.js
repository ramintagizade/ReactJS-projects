const {applyMiddleware,createStore,promise} = Redux;
const logger = reduxLogger();
const thunk = ReduxThunk.default;

const initialState = {
  fetching:false,
  fetched:false,
  users:[],
  error:null
};
const reducer = function(state=initialState,action){
  switch (action.type) {
    case "FETCH_USERS_PENDING" :{
      return {...state,fetching:true}
      break;
    }
    case "FETCH_USERS_REJECTED": {
      return {...state ,fetching :false,error:action.payload}
      break;
    }
    case "RECIEVE_USERS_FULFILLED":{
      return {...state,fetching:false,fetched:true,users:action.payload}
      break;
    }
  }
  return state;
}

const middleware = applyMiddleware(logger);
const store = createStore(reducer,middleware);

store.dispatch({
  type:"FETCH_USERS",
  payload: axios.get("https://codepen.io/jobs.json")
})
