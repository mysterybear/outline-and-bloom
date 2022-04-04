import { Mesh, Object3D } from "three"

export const isMesh = (x: Object3D): x is Mesh => x.type === "Mesh"
