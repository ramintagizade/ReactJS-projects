const {applyMiddleware,createStore} = Redux;
const reducer = function(state,action){
  if(action.type==="INC"){
    return state+action.payload;
  }
  else if(action.type==="DEC"){
    return state-action.payload;
  }
  else if(action.type==="E"){
    throw new Error("AAAAAA !!!!!");
  }
  return state;
}
//middleware
const logger = (store) => (next) => (action) => {
  try{
    next(action);
  }
  catch(e){
    console.log("Ahhhh !! ",e);
  }
}
const error = (store) => (next) => (action) => {
  console.log("Action fired " ,action);
  next(action);
}
const middleware = applyMiddleware(logger,error);
const store = createStore(reducer,1,middleware);
store.subscribe(()=>{
  console.log("store changed ",store.getState());
});

store.dispatch({type:"INC",payload:1});
store.dispatch({type:"INC",payload:2});
store.dispatch({type:"INC",payload:1});
store.dispatch({type:"DEC",payload:10});
store.dispatch({type:"E"});
