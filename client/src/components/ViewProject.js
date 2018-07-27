import React from 'react';
import '../App.css';
import axios from 'axios';
import styled from 'styled-components';

const Button = styled.button`
background: firebrick;
color: white;
height: 45px;
width: 200px;
margin-top: 20px;
font-size: 16px;
font-family: 'Roboto', sans-serif;
border: 1px solid black;
margin: auto;

`;

const ViewProjectDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin-top: 100px;
`;

const ProjectTitle = styled.h1`
  text-align: center;
`;

const ShowButton = styled.button`
  background: teal;
  color: white;
  width: 180px;
  margin auto;
  border-radius: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 14px;
`;

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
      <ViewProjectDiv>
      <Button onClick={() => {this.props.history.push('/')}}>Go Home</Button>
      <h1 className="project-title">{this.state.name.length > 0 ? this.state.name: "Loading..."}</h1>
      <ShowButton onClick={this.showActionsHandler} id={this.props.match.params.id}>Click to {this.state.showActions ? "hide":"show"} actions</ShowButton>
      <div>{this.state.showActions ? this.state.actions.map(action => {
        return (
          <div key={action.id}>
            <h2>{action.description}</h2>
            <p>{action.notes}</p>
          </div>
        )
      }): null}
      </div>
      </ViewProjectDiv>
    )
  }
}

export default ViewProject;
