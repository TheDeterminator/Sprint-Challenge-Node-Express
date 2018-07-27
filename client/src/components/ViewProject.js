import React from 'react';
import '../App.css';
import axios from 'axios';

class ViewProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      showActions: false
    }
  }

  componentDidMount() {
    axios.get(`http://localhost:8000/projects/${this.props.match.params.id}`)
    .then(response => {
      this.setState({name: response.data.name})
    })
    .catch(err => {
      console.log("ERR:", err)
    })
  }

  showActionsHandler = (event) => {
    let id = event.target.getAttribute('id');
    axios.get(`http://localhost:8000/projects/${id}/actions`)
      .then(response => {
        this.setState({showActions: !this.state.showActions, actions: response.data});
      }).catch(err => {
        console.log("Err from app:", err);
      })
  }

  render() {
    return (
      <div>
      <button onClick={() => {this.props.history.push('/')}}>Go Home</button>
      <h1 className="project-title">{this.state.name}</h1>
      <p onClick={this.showActionsHandler} id={this.props.match.params.id}>Click to {this.state.showActions ? "hide":"show"} actions</p>
      <div>{this.state.showActions ? this.state.actions.map(action => {
        return (
          <div key={action.id}>
            <h3>{action.description}</h3>
            <h6>{action.notes}</h6>
          </div>
        )
      }): null}
      <p onClick={this.showActionsHandler} id={this.props.match.params.id}>Click to {this.state.showActions ? "hide":"show"} actions</p>
      </div>
      </div>
    )
  }
}

export default ViewProject;
