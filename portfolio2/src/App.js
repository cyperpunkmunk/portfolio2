import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { Physics, usePlane, useSphere, useBox } from '@react-three/cannon'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import lerp from "lerp"
import './App.css'

function Plane({ color, ...props }) {
  const [ref] = usePlane(() => ({ ...props }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      <meshPhysicalMaterial attach="material" 
      

      color={'#bfd3ff'} />
    </mesh>
  )
}


function Dodecahedron(props) {
  
  // viewport = canvas in 3d units (meters)
  
  const [ref] = useSphere(() => ({ mass: 1, position: [0,6,0], ...props }))
 
  // useFrame(({ mouse }) => {
  //   const x = (mouse.x * viewport.width) / 2
  //   const y = (mouse.y * viewport.height) / 2
  //   ref.current.position.set(x, y, 1)
  //   ref.current.rotation.set(-y, x, 1)
  // })

  return (
    <mesh ref={ref} castShadow>
      
      <instancedMesh ref={ref} castShadow receiveShadow >
      <sphereBufferGeometry attach="geometry" args={[1, 16, 16]}>
        <instancedBufferAttribute attachObject={['red']}  />
      </sphereBufferGeometry>
      <meshPhysicalMaterial
        attach="material"
        clearcoat={1}
        roughness={0}
        color="red"
      />
      </instancedMesh>
    </mesh>
  )
}

function Cube(props) {
  
  const [ref, api] = useBox(() => ({ type: "Kinematic", args: [3.4, 1, 3.5], onCollide: (e) => (e.contact.impactVelocity) }))
  // use-frame allows the component to subscribe to the render-loop for frame-based actions
  let values = useRef([0, 0])
  useFrame((state) => {
    // The paddle is kinematic (not subject to gravitation), we move it with the api returned by useBox
    values.current[0] = lerp(values.current[0], (state.mouse.x * Math.PI) / 5, 0.2)
    values.current[1] = lerp(values.current[1], (state.mouse.x * Math.PI) / 5, 0.2)
    api.position.set(state.mouse.x * 10, state.mouse.y * 5, 0)
    api.rotation.set(0, 0, values.current[1])
  
  })
  return (
    <mesh ref={ref}>
      <instancedMesh ref={ref}>
      <boxBufferGeometry>
      <instancedBufferAttribute attachObject={['red']}  />

      </boxBufferGeometry>
      <meshPhysicalMaterial
        attach="material"
        clearcoat={1}
        roughness={0}
        color="red"
      />
      </instancedMesh>
    </mesh>
  )
}



function InstancedSpheres({ number = 100 }) {
  
  const [ref] = useSphere(index => ({
    
    mass: 1,
    position: [Math.random() - 0.5, Math.random() - 0.5, index * 2],
    args: 1
  }))
  
    
  return (
    <instancedMesh ref={ref} castShadow receiveShadow args={[null, null, number]}>
      <sphereBufferGeometry attach="geometry" args={[1, 16, 16]}>
        <instancedBufferAttribute attachObject={['color']}  />
      </sphereBufferGeometry>
      <meshPhysicalMaterial
        attach="material"
        clearcoat={1}
        roughness={0}
      />
    </instancedMesh>
  )
}


export default function App() {

  return (
    <Canvas concurrent shadowMap sRGB gl={{ alpha: false }} camera={{ position: [0, -10, 8] }}>
    <hemisphereLight intensity={0.35} />
    <spotLight position={[30, 0, 30]} angle={0.3} penumbra={1} intensity={2} castShadow shadow-mapSize-width={256} shadow-mapSize-height={256} />
    <pointLight position={[-30, 0, -30]} intensity={0.5} />
    <Physics gravity={[0, 0, -30]} 
          iterations={20}
          tolerance={0.0001}
          defaultContactMaterial={{
            friction: 1,
            restitution: 0.7,
            contactEquationStiffness: 1e7,
            contactEquationRelaxation: 1,
            frictionEquationStiffness: 1e7,
            frictionEquationRelaxation: 2,
          }}
          
          allowSleep={false}>
      <Plane color="black" />
      <Plane color="black" position={[-8, 0, 0]} rotation={[0, 0.9, 0]} />
      <Plane color="black" position={[8, 0, 0]} rotation={[0, -0.9, 0]} />
      <Plane color="black" position={[0, 8, 0]} rotation={[0.9, 0, 0]} />
      <Plane color="black" position={[0, -8, 0]} rotation={[-0.9, 0, 0]} />
      <Dodecahedron/>
      <Cube/>
      
      <InstancedSpheres number={100} />
     
    </Physics>
    </Canvas>
  )
}