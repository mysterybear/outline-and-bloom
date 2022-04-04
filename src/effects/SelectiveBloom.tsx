/* eslint-disable react/jsx-pascal-case */
import { SelectiveBloom as SelectiveBloom_ } from "@react-three/postprocessing"
import React, { Fragment, useRef } from "react"
import { useSnapshot } from "valtio"
import state from "../state"

const useIlluminated = () => {
  const { illuminated } = useSnapshot(state)
  return illuminated
}

const SelectiveBloom = () => {
  const lightRef = useRef()
  const illuminated = useIlluminated()

  const intensity = 1

  return (
    <Fragment>
      <ambientLight />
      <ambientLight ref={lightRef} color="red" />
      <SelectiveBloom_
        lights={[lightRef]}
        selection={illuminated}
        kernelSize={4}
        luminanceThreshold={0}
        luminanceSmoothing={0}
        intensity={intensity}
        // selectionLayer={10}
      />
    </Fragment>
  )
}

export default SelectiveBloom
