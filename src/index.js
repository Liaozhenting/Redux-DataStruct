import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import App from './App';


// 关于队列
import queue from './reducers/PriorityQueue';

const myQueue = queue({});

const store = createStore(myQueue);

store.subscribe(()=> console.log(store.getState()));

ReactDOM.render(  <Provider store={store}>
    <App />
</Provider>, document.getElementById('root'));


