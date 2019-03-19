import React, { Component } from "react";
import { connect } from "react-redux";
class App extends Component {
  onClick = function() {
    this.props.dispatch({ type: "enqueue", payload: Math.random() });
  };
  onDelete = function() {
    this.props.dispatch({ type: "dequeue"});
  };
  render() {
    console.log(this.props);
    return (
      <div className="App">
        <header className="App-header" />
        {this.props.dataStore.map((ele, index) => {
          return <p key={`item-${index}`}>{ele}</p>;
        })}
        <button onClick={this.onClick.bind(this)} />
        <button onClick={this.onDelete.bind(this)} />
      </div>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    dataStore: state.dataStore
  };
};

export default connect(mapStateToProps)(App);
