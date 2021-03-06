import { last } from "ramda"
import { colorGradients } from "../../styles/colors"
import { Active, Board } from "./board"
import { GetNextShape, getNextShape as _getNextShape } from "./get-next-shape"
import { createEmptyMatrix } from "./matrix"
import { Shape, TetrisMatrix } from "./shape"

const _ = undefined
const p = { color: colorGradients.RED }

interface Test {
  only?: boolean
  name: string
  initialMatrix?: TetrisMatrix
  expectedMatrix?: TetrisMatrix
  getNextShape?: GetNextShape
  actions?: (board: Board) => void
  active?: Active
  gameOverCalled?: boolean
  rowClearCalledWith?: number
}

const TOP = 0
const BOTTOM = 8
const MIDDLE = 4
const RIGHT = 7
const LEFT = 0
const I_SHAPE_LEFT = -2
const I_SHAPE_BOTTOM = 7

const tests: Test[] = [
  {
    name: "initialize board",
    initialMatrix: [
      [_, _, _], //
      [_, _, _],
    ],
    expectedMatrix: [
      [_, _, _], //
      [_, _, _],
    ],
  },
  {
    name: "add shape to board",
    getNextShape: () => Shape.createIShape(p.color),
    actions: board => {
      board.step()
    },
    expectedMatrix: [
      [_, _, _, _, _, p, _, _, _, _], //
      [_, _, _, _, _, p, _, _, _, _],
      [_, _, _, _, _, p, _, _, _, _],
      [_, _, _, _, _, p, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
    ],
  },
  {
    name: "add rotated shape to board",
    getNextShape: () => {
      const shape = Shape.createIShape(p.color)
      shape.rotate()
      return shape
    },
    actions: board => {
      board.step()
    },
    expectedMatrix: [
      [_, _, _, p, p, p, p, _, _, _], //
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
    ],
  },
  {
    name: "3 steps",
    getNextShape: () => Shape.createTShape(p.color),
    actions: board => {
      board.step()
      board.step()
      board.step()
    },
    expectedMatrix: [
      [_, _, _, _, _, _, _, _, _, _], //
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, p, _, _, _, _, _],
      [_, _, _, p, p, p, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
    ],
  },
  {
    name: "2 steps and a rotation",
    getNextShape: () => Shape.createZShape(p.color),
    actions: board => {
      board.step()
      board.step()
      board.rotate()
    },
    expectedMatrix: [
      [_, _, _, _, _, _, _, _, _, _], //
      [_, _, _, _, _, p, _, _, _, _],
      [_, _, _, _, p, p, _, _, _, _],
      [_, _, _, _, p, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
    ],
  },
  {
    name: "a step and 2 lefts",
    getNextShape: () => Shape.createSShape(p.color),
    actions: board => {
      board.step()
      board.left()
      board.left()
    },
    expectedMatrix: [
      [_, _, p, p, _, _, _, _, _, _], //
      [_, p, p, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
    ],
  },
  {
    name: "a step and 2 rights",
    getNextShape: () => Shape.createOShape(p.color),
    actions: board => {
      board.step()
      board.right()
      board.right()
    },
    expectedMatrix: [
      [_, _, _, _, _, _, p, p, _, _], //
      [_, _, _, _, _, _, p, p, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
    ],
  },
  {
    name: "a step and 2 downs",
    getNextShape: () => Shape.createOShape(p.color),
    actions: board => {
      board.step()
      board.down()
      board.down()
    },
    expectedMatrix: [
      [_, _, _, _, _, _, _, _, _, _], //
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, p, p, _, _, _, _],
      [_, _, _, _, p, p, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
    ],
  },
  {
    name: "active reached bottom",
    active: {
      position: { x: MIDDLE, y: BOTTOM },
      shape: Shape.createOShape(p.color),
    },
    actions: board => {
      board.step()
    },
    expectedMatrix: [
      [_, _, _, _, _, _, _, _, _, _], //
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, p, p, _, _, _, _],
      [_, _, _, _, p, p, _, _, _, _],
    ],
  },
  {
    name: "active reached bottom (because of occupied cell)",
    active: {
      position: { x: MIDDLE, y: BOTTOM - 1 },
      shape: Shape.createOShape(p.color),
    },
    actions: board => {
      board.step()
    },
    initialMatrix: [
      [_, _, _, _, _, _, _, _, _, _], //
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, p, _, _, _, _, _],
    ],
    expectedMatrix: [
      [_, _, _, _, _, _, _, _, _, _], //
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, p, p, _, _, _, _],
      [_, _, _, _, p, p, _, _, _, _],
      [_, _, _, _, p, _, _, _, _, _],
    ],
  },
  {
    name: "active reached bottom but dodges to the left",
    active: {
      position: { x: MIDDLE, y: BOTTOM - 1 },
      shape: Shape.createOShape(p.color),
    },
    actions: board => {
      board.step()
      board.left()
      board.step()
    },
    initialMatrix: [
      [_, _, _, _, _, _, _, _, _, _], //
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, p, _, _, _, _],
    ],
    expectedMatrix: [
      [_, _, _, _, _, _, _, _, _, _], //
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, p, p, _, _, _, _, _],
      [_, _, _, p, p, p, _, _, _, _],
    ],
  },
  {
    name: "active reached bottom (2 steps), new shape spawns (1 step)",
    active: {
      position: { x: MIDDLE, y: BOTTOM },
      shape: Shape.createOShape(p.color),
    },
    getNextShape: () => Shape.createIShape(p.color),
    actions: board => {
      board.step()
      board.step()
      board.step()
    },
    expectedMatrix: [
      [_, _, _, _, _, p, _, _, _, _], //
      [_, _, _, _, _, p, _, _, _, _], //
      [_, _, _, _, _, p, _, _, _, _], //
      [_, _, _, _, _, p, _, _, _, _], //
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, p, p, _, _, _, _],
      [_, _, _, _, p, p, _, _, _, _],
    ],
  },
  {
    name: "active can't go right due to edge",
    active: {
      position: { x: RIGHT, y: TOP },
      shape: Shape.createIShape(p.color),
    },
    actions: board => {
      board.right()
    },
    expectedMatrix: [
      [_, _, _, _, _, _, _, _, _, p], //
      [_, _, _, _, _, _, _, _, _, p],
      [_, _, _, _, _, _, _, _, _, p],
      [_, _, _, _, _, _, _, _, _, p],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
    ],
  },
  {
    name: "active can't go right due to occupied cell",
    active: {
      position: { x: RIGHT - 1, y: TOP },
      shape: Shape.createIShape(p.color),
    },
    actions: board => {
      board.right()
    },
    initialMatrix: [
      [_, _, _, _, _, _, _, _, _, p], //
      [_, _, _, _, _, _, _, _, _, p],
      [_, _, _, _, _, _, _, _, _, p],
      [_, _, _, _, _, _, _, _, _, p],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
    ],
    expectedMatrix: [
      [_, _, _, _, _, _, _, _, p, p], //
      [_, _, _, _, _, _, _, _, p, p],
      [_, _, _, _, _, _, _, _, p, p],
      [_, _, _, _, _, _, _, _, p, p],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
    ],
  },
  {
    name: "active can't go left due to edge",
    active: {
      position: { x: LEFT, y: TOP },
      shape: Shape.createZShape(p.color),
    },
    actions: board => {
      board.left()
    },
    expectedMatrix: [
      [p, p, _, _, _, _, _, _, _, _], //
      [_, p, p, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
    ],
  },
  {
    name: "active can't go left due to occupied cell",
    active: {
      position: { x: LEFT + 1, y: TOP },
      shape: Shape.createTShape(p.color),
    },
    actions: board => {
      board.left()
    },
    initialMatrix: [
      [_, p, _, _, _, _, _, _, _, _], //
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
    ],
    expectedMatrix: [
      [_, p, p, _, _, _, _, _, _, _], //
      [_, p, p, p, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
    ],
  },
  {
    name: "active can't go down due to edge",
    active: {
      position: { x: LEFT, y: BOTTOM },
      shape: Shape.createOShape(p.color),
    },
    actions: board => {
      board.down()
    },
    expectedMatrix: [
      [_, _, _, _, _, _, _, _, _, _], //
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [p, p, _, _, _, _, _, _, _, _],
      [p, p, _, _, _, _, _, _, _, _],
    ],
  },
  {
    name: "active can't go down due to occupied cell",
    active: {
      position: { x: I_SHAPE_LEFT + 2, y: TOP },
      shape: Shape.createIShape(p.color),
    },
    actions: board => {
      board.down()
    },
    initialMatrix: [
      [_, _, _, _, _, _, _, _, _, _], //
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, p, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
    ],
    expectedMatrix: [
      [_, _, p, _, _, _, _, _, _, _], //
      [_, _, p, _, _, _, _, _, _, _],
      [_, _, p, _, _, _, _, _, _, _],
      [_, _, p, _, _, _, _, _, _, _],
      [_, _, p, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
    ],
  },
  {
    name: "active can't rotate due to edge",
    active: {
      position: { x: I_SHAPE_LEFT, y: TOP },
      shape: Shape.createIShape(p.color),
    },
    actions: board => {
      board.rotate()
    },
    expectedMatrix: [
      [p, _, _, _, _, _, _, _, _, _], //
      [p, _, _, _, _, _, _, _, _, _],
      [p, _, _, _, _, _, _, _, _, _],
      [p, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
    ],
  },
  {
    name: "active can't rotate due to occupied cell",
    active: {
      position: { x: I_SHAPE_LEFT + 2, y: TOP },
      shape: Shape.createIShape(p.color),
    },
    actions: board => {
      board.rotate()
    },
    initialMatrix: [
      [_, _, _, _, _, _, _, _, _, _], //
      [_, _, _, _, _, _, _, _, _, _],
      [_, p, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
    ],
    expectedMatrix: [
      [_, _, p, _, _, _, _, _, _, _], //
      [_, _, p, _, _, _, _, _, _, _],
      [_, p, p, _, _, _, _, _, _, _],
      [_, _, p, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
    ],
  },
  {
    name: "row disappears if full",
    active: {
      position: { x: I_SHAPE_LEFT + 2, y: I_SHAPE_BOTTOM - 1 },
      shape: Shape.createIShape(p.color),
    },
    actions: board => {
      board.step()
      board.step()
    },
    initialMatrix: [
      [_, _, _, _, _, _, _, _, _, _], //
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, p, p, _, _, _, _],
      [_, _, _, _, p, _, _, _, _, _],
      [p, p, _, p, p, p, p, p, p, p],
    ],
    expectedMatrix: [
      [_, _, _, _, _, _, _, _, _, _], //
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, p, _, _, _, _, _, _, _],
      [_, _, p, _, p, p, _, _, _, _],
      [_, _, p, _, p, _, _, _, _, _],
    ],
  },
  {
    name: "game over",
    getNextShape: () => Shape.createIShape(p.color),
    actions: board => {
      board.step()
    },
    initialMatrix: [
      [_, _, _, _, _, _, _, _, _, _], //
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, p, _, _, _, _],
      [_, _, _, _, _, p, _, _, _, _],
      [_, _, _, _, _, p, _, _, _, _],
      [_, _, _, _, _, p, _, _, _, _],
      [_, _, _, _, _, p, _, _, _, _],
      [_, _, _, _, _, p, _, _, _, _],
      [_, _, _, _, _, p, _, _, _, _],
    ],
    gameOverCalled: true,
  },
  {
    name: "on row clear",
    active: {
      position: { x: I_SHAPE_LEFT + 2, y: I_SHAPE_BOTTOM - 1 },
      shape: Shape.createIShape(p.color),
    },
    actions: board => {
      board.step()
      board.step()
    },
    initialMatrix: [
      [_, _, _, _, _, _, _, _, _, _], //
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [p, p, _, p, p, p, p, p, p, p],
      [p, p, _, p, p, p, p, p, p, p],
      [p, p, _, p, p, p, p, p, p, p],
      [p, p, _, p, p, p, p, p, p, p],
    ],
    rowClearCalledWith: 4,
  },
  {
    name: "smash to bottom",
    active: {
      position: { x: MIDDLE, y: TOP },
      shape: Shape.createOShape(p.color),
    },
    actions: board => {
      board.smash()
    },
    expectedMatrix: [
      [_, _, _, _, _, _, _, _, _, _], //
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, p, p, _, _, _, _],
      [_, _, _, _, p, p, _, _, _, _],
    ],
  },
  {
    name: "smash until can",
    active: {
      position: { x: MIDDLE, y: TOP },
      shape: Shape.createTShape(p.color),
    },
    actions: board => {
      board.smash()
    },
    initialMatrix: [
      [_, _, _, _, _, _, _, _, _, _], //
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, p, _, _, _, _, _],
      [_, _, _, _, p, _, _, _, _, _],
      [_, _, _, _, p, _, _, _, _, _],
    ],
    expectedMatrix: [
      [_, _, _, _, _, _, _, _, _, _], //
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, p, _, _, _, _],
      [_, _, _, _, p, p, p, _, _, _],
      [_, _, _, _, p, _, _, _, _, _],
      [_, _, _, _, p, _, _, _, _, _],
      [_, _, _, _, p, _, _, _, _, _],
    ],
  },
]

tests.map(
  ({
    only,
    name,
    initialMatrix,
    getNextShape,
    actions,
    active,
    expectedMatrix,
    gameOverCalled,
    rowClearCalledWith,
  }) => {
    const t =
      typeof only !== "undefined" ? (only ? test.only : test.skip) : test
    t(name, () => {
      const board = createBoard({
        getNextShape,
        matrix: initialMatrix,
        active,
      })

      const onBoardChange = jest.fn()
      board.boardChange.subscribe(onBoardChange)
      const onGameOver = jest.fn()
      board.gameOver.subscribe(onGameOver)
      const onRowClear = jest.fn()
      board.rowClear.subscribe(onRowClear)

      if (actions) {
        actions(board)
      }

      const [resultBoard] = last(onBoardChange.mock.calls)

      if (expectedMatrix) {
        try {
          expect(resultBoard).toEqual(expectedMatrix)
        } catch (err) {
          throw new Error(`
Expected:
${printBoard(expectedMatrix)}

Got:
${printBoard(resultBoard)}
`)
        }
      }

      if (typeof gameOverCalled !== "undefined") {
        expect(onGameOver).toHaveBeenCalled()
      }

      if (typeof rowClearCalledWith !== "undefined") {
        expect(onRowClear).toHaveBeenCalledWith(rowClearCalledWith)
      }
    })
  },
)

function printBoard(board: TetrisMatrix): string {
  const mappedBoard = board.map(row => row.map(cell => (cell ? "O" : "_")))
  return mappedBoard.join("\n")
}

interface CreateBoardOptions {
  getNextShape?: GetNextShape
  matrix?: TetrisMatrix
  active?: Active
}

function createBoard({
  getNextShape = _getNextShape,
  matrix = createEmptyMatrix(10, 10),
  active,
}: CreateBoardOptions = {}) {
  return new Board(getNextShape, matrix, active)
}
