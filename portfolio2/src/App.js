import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import React, { Component } from 'react';
import * as THREE from 'three';



class Viewer extends Component{


  componentDidMount(){
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    //ADD SCENE
    this.scene = new THREE.Scene()

    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )
    this.camera.position.z = 3
    this.camera.position.y = 0.5

    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor('#888888')
    this.renderer.setSize(width, height)
    this.mount.appendChild(this.renderer.domElement)

      
    //ADD LIGHT
    const color = 0xFFFFFF;
    const intensity = .7;
    const light = new THREE.AmbientLight(color, intensity);
    this.scene.add(light);

    //ADD CUBE
  

    //ADD OBJECT
    const loader = new GLTFLoader();
      loader.load('./untitled.gltf', (object) => {
        this.scene.add(object.scene);
      });

    this.animate();

  }

  

  animate = () => {
   this.renderScene()
   this.frameId = window.requestAnimationFrame(this.animate)
 }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }


  render(){
    return(
      <div
        style={{ width: window.innerWidth, height: window.innerHeight }}
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}

export default Viewer;