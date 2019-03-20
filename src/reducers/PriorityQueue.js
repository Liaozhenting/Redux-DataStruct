class QueEle {
  //封装我们的元素为一个对象
  constructor(name, priority) {
    this.name = name; //元素
    this.priority = priority; //优先级
  }
}
class PriorityQueue {
  dataStore = [];
  enqueue(ele) {
    var queObj = new QueEle(ele); //创建队列元素对象
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
  dequeue = function() {
    return this.dataStore.shift();
  };
  front = function() {
    return this.dataStore[0];
  };
  isEmpty = function() {
    return this.dataStore.length === 0;
  };
  size = function() {
    return this.dataStore.length;
  };
  clear = function() {
    this.dataStore = [];
  };
  print = function() {
    //这个地方稍微修改一下下
    var temp = [];
    for (var i = 0, len = this.dataStore.length; i < len; i++) {
      temp.push(this.dataStore[i].ele);
    }
    console.log(temp.toString());
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

export default function({ initialState = queue }) {
  return function(state = initialState, action) {
    const { type } = action;
    if (type === "enqueue") {
      state.enqueue(itemGetter(action));
      return packageState(state);
    } else if (type === "dequeue") {
      state.dequeue();
      return packageState(state);
    } else {
      return state;
    }
  };
}
