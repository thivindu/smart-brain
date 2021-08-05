import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import './App.css';
import Particles from 'react-particles-js';

const particleOptions = {
  particles: {
    number: {
      value: 120,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initalState = {
  input: '',
  imageURL: '',
  box: {},
  route: 'signIn',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
};

class App extends Component {

  constructor(){
    super();
    this.state = initalState;
  }

  loadUser = (userData) => {
    this.setState({user: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      entries: userData.entries,
      joined: userData.joined
    }});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  calculateFaceLocation = (response) => {
    const clarifaiFace = response.outputs[0].data.regions[0].region_info.bounding_box;
    // response.outputs[0].data.regions.map(face => console.log(face.region_info.bounding_box));
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      top_row: clarifaiFace.top_row*height,
      left_col: clarifaiFace.left_col*width,
      bottom_row: height-clarifaiFace.bottom_row*height,
      right_col: width-clarifaiFace.right_col*width
    }
    
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onSubmit = () => {

    this.setState({imageURL: this.state.input});
      fetch('https://fierce-lowlands-49100.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())

      .then(response => {
        if(response){
          fetch('https://fierce-lowlands-49100.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
          })
          .catch(console.log)
        }

        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(e => console.log(e));
  }

  onRouteChange = (route) => {
    if(route === 'home')
      this.setState({isSignedIn: true});
    else
      this.setState(initalState);

    this.setState({route: route});
  }

  render() {
    const {imageURL, box, route, isSignedIn} = this.state;
    return (
      <div className="App">
        <Particles className='particles' params={particleOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>

        { route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/> 
              <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>           
              <FaceRecognition imageURL={imageURL} box={box}/>
            </div>
          : (route === 'signIn' 
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>)
        }

      </div>
    );
  }

}

export default App;
