/* eslint-disable react/jsx-pascal-case */
import { useThree } from "@react-three/fiber"
import { Outline as Outline_ } from "@react-three/postprocessing"
import { useSnapshot } from "valtio"
import state from "../state"

const useOutlined = () => {
  const { outlined } = useSnapshot(state)
  return outlined
}

const Outline = () => {
  const size = useThree((three) => three.size)
  const outlined = useOutlined()
  return (
    <Outline_
      blur
      selection={outlined as any}
      // // selectionLayer={EffectsLayer.outline}
      visibleEdgeColor={0xffffff}
      hiddenEdgeColor={0xffffff}
      // xRay={scopeType !== ScopeTypeEnum.Enum.HOUSE}
      edgeStrength={32}
      width={size.width / 2}
      height={size.height / 2}
    />
  )
}

export default Outline
