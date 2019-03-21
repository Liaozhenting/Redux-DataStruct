业务需求是自己空想的，也许并没有什么用。这里的复杂数据结构是指区别与JavaScript自带的数组，对象的诸如链表，队列，树之类的数据结构。网上已经有很多JavaScript实现的各种数据结构，直接抄他们的实现。

首先看这篇文章[JavaScript队列、优先队列与循环队列](https://blog.csdn.net/q1056843325/article/details/53121917).
这里实现了一个优先队列。基本上，redux的数据结构是扁平的数组或者是对象，现在我们做一些不平凡的事情。为了在网页上展示效果，我们引入react-redux。

create-react-app初始化项目,index.js,App.js里面的代码无关紧要，可以跳过不看。

假设有个洗手间，一群顾客排队上。

++按钮添加VIP顾客，优先级高可以插队；+按钮是普通顾客；-号按钮是顾客进洗手间了。


./index.js
```js
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import App from './App';

import queue from './reducers/PriorityQueue';

const myQueue = queue({});

const store = createStore(myQueue);

ReactDOM.render(  <Provider store={store}>
    <App />
</Provider>, document.getElementById('root'));
```
./App.js
```js
import React, { Component } from "react";
import { connect } from "react-redux";
class TempCustomer extends Component{
    render(){
        const {dataStore} = this.props
        if(dataStore.length>0){
            return <h1>最前面的人: {dataStore[0].name}</h1>
        } else {
            return null;
        }        
    }
}
const Customer = connect(mapStateToProps)(TempCustomer);

class App extends Component {
  onAddVip = function() {
    this.props.dispatch({
      type: "enqueue",
      payload: { name: "VIP_" + Math.random(), priority: 1 }
    });
  };
  onAdd = function() {
    this.props.dispatch({
      type: "enqueue",
      payload: { name: "" + Math.random(), priority: 2 }
    });
  };
  onDelete = function() {
    this.props.dispatch({ type: "dequeue" });
  };
  render() {
    return (
      <div className="App">
        {this.props.dataStore.map((ele, index) => {
          return <p key={`item-${index}`}>{ele.name}</p>;
        })}
        <button onClick={this.onAddVip.bind(this)}>++</button>
        <button onClick={this.onAdd.bind(this)}>+</button>
        <button onClick={this.onDelete.bind(this)}>-</button>
        <Customer></Customer>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    dataStore: state
  };
};

export default connect(mapStateToProps)(App);
```

我们参考JS实现队列的那篇文章，复制他的代码过来。由于要出发react的渲染机制，数组和对象重新给一个引用地址。所以我们用packageState函数去返回一个全新的数据。

重点 ./reducers/PriorityQueue.js
```js
class PriorityQueue {
  dataStore = [];
  enqueue = function (ele) {
    if (this.isEmpty()) {
      //如果队列是空的，直接插入
      this.dataStore.push(ele);
    } else {
      var bAdded = false;
      for (var i = 0, len = this.dataStore.length; i < len; i++) {
        if (ele.priority < this.dataStore[i].priority) {
          this.dataStore.splice(i, 0, ele); // 循环队列，如果优先级小于这个位置元素的优先级，插入
          bAdded = true;
          break;
        }
      }
      if (!bAdded) {
        this.dataStore.push(ele); // 如果循环一圈都没有找到能插队的位置，直接插入队列尾部
      }
    }
  }
  dequeue = function () {
    return this.dataStore.shift();
  };
  isEmpty = function () {
    return this.dataStore.length === 0;
  };

}

var queue = new PriorityQueue();

function itemGetter(action) {
  return action.payload;
}

function packageState(state) {
  state.dataStore = [].concat(state.dataStore);
  return Object.assign(new PriorityQueue(), state);
}

export default function ({ initialState = queue }) {
  return function (state = initialState, action) {
    switch (action.type) {
      case "enqueue":
        state.enqueue(itemGetter(action));
        return packageState(state);
      case "dequeue":
        state.dequeue(itemGetter(action));
        return packageState(state);
      default:
        return state;
    }
  };
}
```
OK，那么很简单，大功告成。


## 最终版
这是一种比较简单直观的方式。但是在比较大的项目中，可能会为了性能，引入不可变数据，以避免深度克隆数据。 我们这里引入seamless-immutable。这里时候由于数据是read-only了，对于这个队列的侵入性非常强。我们必须把出队入队的方法抽离出来，放在reducer里面。 ./reducers/PriorityQueue.js
```js
import Immutable from "seamless-immutable";

function isEmpty(data) {
  if(!data)return false;
  return data.length === 0;
}

function itemGetter(action) {
  return action.payload;
}

export default function ({ initialState = Immutable([]) }) {
  return function (state = initialState, action) {
    const { type } = action;
    const ele = itemGetter(action);
    if (type === "enqueue") {
      if (isEmpty(state.dataStore)) {
        //如果队列是空的，直接插入
        console.log(state.dataStore.concat([ele]));
        return state.concat([ele]);
        // this.set('dataStore', this.dataStore.concat([ele]))

      } else {
        var bAdded = false;
        const origin = state.asMutable();
        for (var i = 0, len = origin.length; i < len; i++) {
          if (ele.priority < origin[i].priority) {
            origin.splice(i, 0, ele); // 循环队列，如果优先级小于这个位置元素的优先级，插入
            bAdded = true;
            break;
          }
        }
        if (!bAdded) {
          return state.concat([ele]);
        }
        return Immutable(origin);
      }
    } else if (type === "dequeue") {
      const origin = state.asMutable();
      origin.shift();
      return Immutable(origin);
    } else {
      return state;
    }
  };
}
```