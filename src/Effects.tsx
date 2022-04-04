import { useFBO } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import {
  EffectComposer,
  EffectPass,
  OutlineEffect as OutlineEffectRaw,
  RenderPass,
  SelectiveBloomEffect,
} from "postprocessing"
import { useEffect, useMemo } from "react"
import { subscribeKey } from "valtio/utils"
import state from "./state"

export type UseOutlineEffectParams = ConstructorParameters<
  typeof OutlineEffectRaw
>[2]

export const defaultOutlineEffectParams: UseOutlineEffectParams = {
  edgeStrength: 8,
  pulseSpeed: 0.0,
  visibleEdgeColor: 0xffffff,
  hiddenEdgeColor: 0xffffff,
  blur: false,
}

const defaultRenderPriority: number = 1

const Effects = () => {
  const { gl, camera, size, scene } = useThree()

  const renderTarget = useFBO(size.width, size.height, { depthBuffer: true })

  const selectiveBloomEffect = useMemo(() => {
    const effect = new SelectiveBloomEffect(scene, camera, {
      intensity: 1,
      kernelSize: 4,
      luminanceSmoothing: 0,
      luminanceThreshold: 0,
    })
    effect.selection.layer = 11
    return effect
  }, [camera, scene])

  const outlineEffect = useMemo(() => {
    const effect = new OutlineEffectRaw(
      scene,
      camera,
      defaultOutlineEffectParams
    )
    effect.selection.layer = 12
    return effect
  }, [scene, camera])

  const effectComposer = useMemo(() => {
    const effectComposer = new EffectComposer(gl, renderTarget)
    const renderPass = new RenderPass(scene, camera)
    effectComposer.addPass(renderPass)
    effectComposer.addPass(new EffectPass(camera, selectiveBloomEffect))
    effectComposer.addPass(new EffectPass(camera, outlineEffect))
    return effectComposer
  }, [gl, renderTarget, scene, camera, outlineEffect, selectiveBloomEffect])

  subscribeKey(state, "outlined", () => {
    if (state.outlined.length > 0) outlineEffect.selection.set(state.outlined)
    else outlineEffect.selection.clear()
  })

  subscribeKey(state, "illuminated", () => {
    console.log(state.illuminated)
    if (state.illuminated.length > 0)
      selectiveBloomEffect.selection.set(state.illuminated)
    else selectiveBloomEffect.selection.clear()
  })

  useEffect(() => {
    effectComposer.setSize(size.width, size.height)
  }, [effectComposer, size])

  useFrame(() => {
    effectComposer.render(0.02)
  }, defaultRenderPriority)

  return null
}

export default Effects
