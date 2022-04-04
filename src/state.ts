import { Object3D } from "three"
import { proxy } from "valtio"

export type V3 = readonly [number, number, number]

export type BoxT = {
  position: V3
  index: number
}

export type StackT = {
  boxes: Array<BoxT>
  position: V3
}

export type State = {
  stacks: { [key: string]: StackT }
  hoveredBox: number | null
  hoveredStack: string | null
  outlined: Object3D[]
  illuminated: Object3D[]
}

const state = proxy<State>({
  stacks: {
    stack1: {
      boxes: [
        {
          position: [0, 0, 0],
          index: 0,
        },
        {
          position: [0, 1, 0],
          index: 1,
        },
        {
          position: [0, 2, 0],
          index: 2,
        },
      ],
      position: [-1, 0, 0],
    },
    stack2: {
      boxes: [
        {
          position: [0, 0, 0],
          index: 0,
        },
        {
          position: [0, 1, 0],
          index: 1,
        },
        {
          position: [0, 2, 0],
          index: 2,
        },
      ],
      position: [1, 0, 0],
    },
  },
  hoveredBox: null,
  hoveredStack: null,
  outlined: [],
  illuminated: [],
})

export default state
