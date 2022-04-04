import { EffectComposer } from "@react-three/postprocessing"
// import { EdgeDetectionMode } from "postprocessing"
import React, { Fragment } from "react"
import Outline from "./Outline"
import SelectiveBloom from "./SelectiveBloom"

const Effects = () => {
  return (
    <Fragment>
      <EffectComposer autoClear={false} multisampling={8} disableNormalPass>
        <Outline />
        <SelectiveBloom />

        {/* <SMAA edgeDetectionMode={EdgeDetectionMode.DEPTH} /> */}
      </EffectComposer>
    </Fragment>
  )
}

export default Effects
