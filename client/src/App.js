import React, { Component } from 'react';
import './App.css';
import {Route} from 'react-router-dom';
import ProjectListContainer from './components/ProjectListContainer';
import ViewProject from './components/ViewProject';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: []
    }
  }

  componentDidMount() {
    axios.get(`http://localhost:8000/projects/`)
    .then(response => {
      this.setState({projects: response.data})
    })
    .catch(err => {
      console.log(err);
    })
  }

  render() {
    return (
      <div>
        <Route exact path='/' component={props => <ProjectListContainer {...props} projects={this.state.projects} />} />
        <Route path='/projects/:id' component={props => <ViewProject{...props} />} />
      </div>
    );
  }
}

export default App;
