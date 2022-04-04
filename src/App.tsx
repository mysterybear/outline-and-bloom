import { Canvas, MeshProps } from "@react-three/fiber"
import { EffectComposer, SelectiveBloom } from "@react-three/postprocessing"
import { Fragment, useRef } from "react"
import { Mesh, Object3D } from "three"
import { proxy, ref, useSnapshot } from "valtio"
import { subscribeKey } from "valtio/utils"

type ObjectRef = {
  current: Object3D
}

const prox = proxy<{
  hovered: string[]
  illuminated: ObjectRef[]
}>({
  hovered: [],
  illuminated: [],
})

type SphereProps = Omit<MeshProps, "id"> & {
  id: string
}

const hover = (id: string) => {
  if (!prox.hovered.includes(id)) {
    prox.hovered.push(id)
  }
}

const unhover = (id: string) => {
  if (prox.hovered.includes(id)) {
    prox.hovered = prox.hovered.filter((x) => x !== id)
  }
}

function Sphere(props: SphereProps) {
  const { id, ...meshProps } = props
  const meshRef = useRef<Mesh>(null!)

  subscribeKey(prox, "hovered", () => {
    if (!meshRef.current) return

    const hovered = prox.hovered.includes(id)
    const illuminated =
      prox.illuminated.filter((x) => x.current.id === meshRef.current?.id)
        .length >= 1

    switch (true) {
      case hovered && !illuminated: {
        prox.illuminated.push(ref(meshRef as ObjectRef))
        break
      }
      case !hovered && illuminated: {
        prox.illuminated = prox.illuminated.filter(
          (x) => x.current.id !== meshRef.current.id
        )
        break
      }
    }
  })

  return (
    <mesh
      ref={meshRef}
      name={id}
      {...meshProps}
      onPointerOver={() => hover(id)}
      onPointerOut={() => unhover(id)}
    >
      <sphereGeometry args={[0.75, 32, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

const Effects = () => {
  const { illuminated } = useSnapshot(prox)

  // const lightRef = useRef()

  return (
    <Fragment>
      <EffectComposer multisampling={0}>
        <SelectiveBloom
          // lights={[lightRef]}
          selection={illuminated}
          selectionLayer={13}
          kernelSize={4}
          luminanceThreshold={0}
          intensity={1}
          luminanceSmoothing={0}
        />
      </EffectComposer>
    </Fragment>
  )
}

export default function App() {
  return (
    <div style={{ position: "absolute", width: "100%", height: "100%" }}>
      <Canvas
        gl={{ antialias: false }}
        orthographic
        dpr={[1, 2]}
        camera={{ zoom: 100 }}
        onCreated={({ gl }) => {
          gl.setClearColor("#222")
        }}
      >
        <Effects />
        <Sphere id="foo" position={[-1, 0, 0]} />
        <Sphere id="bar" position={[1, 0, 0]} />

        <ambientLight intensity={0.5} />
        {/* <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          color="red"
          intensity={2}
        />
        <pointLight position={[-10, -10, -10]} /> */}
      </Canvas>
    </div>
  )
}
