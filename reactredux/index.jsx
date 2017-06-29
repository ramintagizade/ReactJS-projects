const {Provider,connect} = ReactRedux;
const {applyMiddleware,createStore,combineReducers,promise,bindActionCreators} = Redux;
const logger = reduxLogger();
const thunk = ReduxThunk.default;

function fetchUser(){
  return {
    type:"FETCH_USER_FULFILLED",
    payload:{
      name:"Will",
      age:35
    }
  }
}

function fetchTweets() {
  return function(dispatch) {
    dispatch({type: "FETCH_TWEETS"});
    axios.get("http://rest.learncode.academy/api/reacttest/tweets")
      .then((response) => {
        dispatch({type: "FETCH_TWEETS_FULFILLED", payload: response.data})
      })
      .catch((err) => {
        dispatch({type: "FETCH_TWEETS_REJECTED", payload: err})
      })
  }
}

const initialStateUser = {
  user:{
    id:null,
    name:null,
    age:null
  },
  fetching:false,
  fetched:false,
  error:null
};
const initialStateTweet = {
    tweets: [],
    fetching: false,
    fetched: false,
    error: null,
}
const userReducer = function(state=initialStateUser,action){
  switch (action.type) {
    case "FETCH_USERS" :{
      return {...state,fetching:true}
    }
    case "FETCH_USER_REJECTED": {
      return {...state ,fetching :false,error:action.payload}
    }
    case "FETCH_USER_FULFILLED":{
      return {...state,fetching:false,fetched:true,users:action.payload}
    }
    case "SET_USER_NAME": {
      return {...state,user:{...state.user,name:action.payload}}
    }
    case "SET_USER_AGE" :{
      return {...state,user:{...state.user,age:action.payload}}
    }
  }
  return state;
}
const tweetReducer = function(state=initialStateTweet,action){
  switch (action.type) {
    case "FETCH_TWEETS": {
      return {...state,fetching:true}
    }
    case "FETCH_TWEETS_REJECTED":{
      return {...state,fetching:false,error :action.payload}
    }
    case "FETCH_TWEETS_FULFILLED":{
      return {...state,fetching:false,fetched:true,tweets:action.payload}
    }
    case "ADD_TWEET":{
      return {...state,tweets:[...state.tweets,action.payload]}
    }
    case "UPDATE_TWEET":{
      const {id,text} = action.payload;
      const newTweets = [...state.tweets];
      const tweetToUpdate = newTweets.findIndex(tweet => tweet.id===id);
      newTweets[tweetToUpdate] = action.payload;
      return {...state,tweets: newTweets}
    }
    case "DELETE_TWEET":{
      return {...state,tweets: state.tweets.filter(tweet=>tweet.id!=action.payload)}
    }
  }
  return state;
}

const reducer = combineReducers({userReducer,tweetReducer});
const middleware = applyMiddleware(thunk,logger);
const store = createStore(reducer,middleware);


class Layout extends React.Component{
  componentWillMount(){
    //dispatch(fetchUser());
    this.props.user();
  }
  componentDidMount(){
    console.log("fetching user ",store.getState().userReducer.users);
  }
  fetchTweets(){
    this.props.getTweets();

    console.log("after fetchTweets props : ",this.props);
  }
  render(){
    const user = store.getState().userReducer.users;
    const tweets = store.getState().tweetReducer.tweets;
    if(tweets && !tweets.length) {
      return (<button onClick={this.fetchTweets.bind(this)}>Load Tweets</button>)
    }
    const mappedTweets = tweets.map(tweet => <li key={tweet.id}>{tweet.text}</li>)
    return (
      <div>
        <h1>{user.name}</h1>
        <ul>{mappedTweets}</ul>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
           user: store.getState().userReducer.users,
           tweets: store.getState().tweetReducer.tweets
  };
}
const mapDispatchToProps = dispatch => {
  return {
    user :()=> dispatch(fetchUser()),
    getTweets:()=> dispatch(fetchTweets())
  }
}

Layout = connect(mapStateToProps,mapDispatchToProps)(Layout);
const app = document.getElementById('app');
ReactDOM.render(<Provider store={store}><Layout/></Provider> , app);
