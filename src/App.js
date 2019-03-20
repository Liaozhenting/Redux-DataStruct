import React, { Component } from "react";
import { connect } from "react-redux";
class TempCustomer extends Component{
    render(){
        const {dataStore} = this.props
        if(dataStore.length>0){
            return <h1>当前为: {dataStore[0].name}</h1>
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
    dataStore: state.dataStore
  };
};

export default connect(mapStateToProps)(App);
