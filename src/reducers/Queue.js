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
