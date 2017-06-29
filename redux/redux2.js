const {combineReducers,createStore} = Redux;

const userReducer = (state={},action)=>{
  switch(action.type){
    case 'CHANGE_NAME' : {
      //state.name = action.payload;
      state = {...state,name:action.payload};
      break;
    }
    case 'CHANGE_AGE' : {
      //state.age = action.payload;
      state = {...state,age:action.payload};
      break;
    }
  }
  return state;
}
const tweetReducer = (state=[],action)=>{
  return state;
}
const reducers = combineReducers({
  user:userReducer,
  tweets:tweetReducer
});
const store = createStore(reducers);

store.subscribe(()=>{
  console.log("Store changed",store.getState());
});
store.dispatch({type:"CHANGE_NAME",payload:"Will"});
store.dispatch({type:"CHANGE_AGE",payload:35});
