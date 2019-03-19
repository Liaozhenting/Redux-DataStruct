import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import App from './App';


// 关于队列
import queue from './reducers/Queue';

const myQueue = queue({});

const store = createStore(myQueue);

store.subscribe(()=> console.log(store.getState()));

store.dispatch({ type: 'enqueue',payload: 'new' });
store.dispatch({ type: 'dequeue' });

// import rootReducer from './reducers/index';

// import createSaga from 'redux-saga';
// import createLog from './redux-middlewares/log';
// const saga = createSaga(); 
// const log = createLog();
// const middlewares = [saga,log];
// const store = createStore(
//   rootReducer,
//   applyMiddleware(...middlewares)
// );
// store.dispatch({type:'myAction'});

ReactDOM.render(  <Provider store={store}>
    <App />
</Provider>, document.getElementById('root'));


