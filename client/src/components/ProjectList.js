import React from 'react';
import '../App.css';
import axios from 'axios';
import {NavLink} from 'react-router-dom';

class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showActions: false,
      actions: []
    }
  }

  showActionsHandler = (event) => {
    console.log(event.target);
    console.log(event.target.getAttribute('id'));
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
      <div key={this.props.project.id}>
        <NavLink to={`/projects/${this.props.project.id}`} id={this.props.project.id}><h1>{this.props.project.name}</h1></NavLink>
        <div>{this.state.showActions ? this.state.actions.map(action => {
          return (
            <div key={action.id}>
              <h3>{action.description}</h3>
              <h4>{action.notes}</h4>
            </div>
          )
        }): null}
        <p onClick={this.showActionsHandler} id={this.props.project.id}>Click to {this.state.showActions ? "hide":"show"} actions</p>
        </div>
        <hr className="horizontal-rule"/>
      </div>
    )
  }
}

export default ProjectList;
