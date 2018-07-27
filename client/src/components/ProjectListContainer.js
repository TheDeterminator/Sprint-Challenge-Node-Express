import React from 'react';
import '../App.css';
import logo from '../logo.svg';
import ProjectList from './ProjectList';

class ProjectListContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Alec Jordan Node-Express Sprint Challenge</h1>
        </header>
        <div className="post-container">
        {this.props.projects ? this.props.projects.map(project => {
          return (
            <ProjectList key={project.id} project={project} />
          )
        }) : <p>Loading...</p>}
        </div>
        </div>
    )
  }
}

export default ProjectListContainer;
