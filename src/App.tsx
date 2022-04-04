import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { pipe } from "fp-ts/lib/function"
import { map } from "fp-ts/lib/ReadonlyArray"
import { keys } from "fp-ts/lib/ReadonlyRecord"
import React, { useRef } from "react"
import { Group, Mesh, Object3D } from "three"
import { ref, useSnapshot } from "valtio"
import { subscribeKey } from "valtio/utils"
import Effects from "./Effects"
import state, { V3 } from "./state"
import { isMesh } from "./util"

// boxes and stacks...
// two stacks of boxes
// color the hovered box
// outline the hovered stack

const Box = ({
  stackName,
  position,
  index,
}: {
  position: V3
  stackName: string
  index: number
}) => {
  const meshRef = useRef<Mesh>()

  const hover = () => {
    state.hoveredStack = stackName
    state.hoveredBox = index
  }

  subscribeKey(state, "hoveredBox", () => {
    if (!meshRef.current) return
    if (state.hoveredStack === stackName && state.hoveredBox === index) {
      state.outlined = [ref(meshRef.current)]
    }
  })
  return (
    <mesh
      ref={meshRef}
      position={[...position]}
      {...{ onPointerOver: hover, onPointerMove: hover }}
    >
      <boxBufferGeometry />
      <meshStandardMaterial color="#234" emissive="red" />
    </mesh>
  )
}

const Stack = ({ name }: { name: string }) => {
  const groupRef = useRef<Group>()
  const { stacks } = useSnapshot(state)
  const { boxes, position } = stacks[name]

  subscribeKey(state, "hoveredStack", () => {
    if (!groupRef.current) return
    if (state.hoveredStack === name) {
      const collection: Object3D[] = []
      groupRef.current!.traverse((o3) => {
        if (isMesh(o3)) {
          collection.push(ref(o3))
        }
      })
      state.illuminated = collection
    }
  })

  return (
    <group ref={groupRef} position={position as [number, number, number]}>
      {pipe(
        boxes,
        map(({ index, position }) => (
          <Box key={index} index={index} position={position} stackName={name} />
        ))
      )}
    </group>
  )
}

const Main = () => {
  const { stacks } = useSnapshot(state)
  return (
    <group>
      {pipe(
        keys(stacks),
        map((name) => <Stack key={name} name={name} />)
      )}
    </group>
  )
}

const App = () => {
  return (
    <div style={{ position: "absolute", width: "100%", height: "100%" }}>
      <Canvas
        gl={{ antialias: false }}
        orthographic
        dpr={[1, 2]}
        camera={{ zoom: 100 }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor("#222")
        }}
      >
        <Main />
        <ambientLight intensity={5} />
        <Effects />
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default App
