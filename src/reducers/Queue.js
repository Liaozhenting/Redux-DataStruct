import Immutable from 'seamless-immutable';
class Queue{
    constructor(){
        this.dataStore = [];
    }
    
    enqueue (ele) {
        this.dataStore.push(ele)
    }
    dequeue (){
        return this.dataStore.shift();
    }
    front(){return this.dataStore[0]}

    back(){ return this.dataStore[this.dataStore.length-1]}

    toString (){
        let retStr = '';
        for(let i=0;i<this.dataStore.length;i++){
            retStr  += `${this.dataStore[i]}\n`;
        }
        return retStr;
    }

    empty (){
        if(this.dataStore.length===0) return true;
        else return false;
    }

    count(){
        return this.dataStore.length;
    }

}

// var queue = Immutable(new Queue());
var queue = new Queue();

export default function ({
    initialState = queue,
    itemGetter = action => (action.payload),
}){
    return function(state = initialState,action){
        const {type} = action;
        if(type === 'enqueue'){
            state.enqueue(itemGetter(action));
            state.dataStore = state.dataStore.slice(0);
            return Object.assign(new Queue(),state);
            // return state;
        } else if(type=== 'dequeue') {
            state.dequeue();
            state.dataStore = state.dataStore.slice(0);
            return Object.assign(new Queue(),state);
            // return state;
        }
    }
}