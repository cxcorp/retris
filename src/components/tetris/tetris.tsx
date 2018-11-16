import React, { Component, Fragment } from "react"
import { OnBoardChange } from "../../games/tetris/board"
import { Game, OnLevelChange, OnScoreChange } from "../../games/tetris/game"
import { TetrisMatrix } from "../../games/tetris/shape"
import { wait } from "../../helpers"
import { fonts } from "../../styles/fonts"
import { calculateCanvasSize } from "./calculate-canvas-size"

export type OnGameOver = (totalScore: number) => void

interface TetrisProps {
  onGameOver: OnGameOver
}

interface TetrisState {
  board: TetrisMatrix
  totalScore: number
  gainedScore?: number
  currentLevel: number
}

type Ctx = CanvasRenderingContext2D
type Canvas = HTMLCanvasElement

const ONE_SECOND = 1000

export class Tetris extends Component<TetrisProps, TetrisState> {
  private game: Game
  private columnCount = 10
  private rowCount = 16
  private onBoardChange: OnBoardChange
  private onScoreChange: OnScoreChange
  private onLevelChange: OnLevelChange

  state: TetrisState = {
    board: [],
    totalScore: 0,
    gainedScore: undefined,
    currentLevel: 1,
  }

  async componentDidMount() {
    this.resizeCanvasToParentSize()
    window.onresize = () => this.resizeCanvasToParentSize()

    this.onBoardChange = (board: TetrisMatrix) => this.setState({ board })
    this.onScoreChange = async (gainedScore: number, totalScore: number) => {
      this.setState({ gainedScore, totalScore })
      await wait(ONE_SECOND)
      this.setState({ gainedScore: undefined })
    }
    this.onLevelChange = (currentLevel: number) =>
      this.setState({ currentLevel })

    this.game = new Game(
      this.onBoardChange,
      this.onScoreChange,
      this.onLevelChange,
      this.columnCount,
      this.rowCount,
    )
    await this.game.start()

    this.props.onGameOver(this.state.totalScore)
  }

  componentWillUnmount() {
    this.onBoardChange = () => undefined
    this.onScoreChange = () => undefined
  }

  rotate() {
    this.game.rotate()
  }

  left() {
    this.game.left()
  }

  right() {
    this.game.right()
  }

  down() {
    this.game.down()
  }

  render() {
    const canvas = this.canvas
    const ctx = this.ctx
    if (canvas && ctx) {
      this.renderGame(canvas, ctx)
    }

    return (
      <Fragment>
        <canvas ref="canvas" />
      </Fragment>
    )
  }

  private renderGame(canvas: Canvas, ctx: Ctx): void {
    const { gainedScore } = this.state

    this.clearCanvas(canvas, ctx)
    this.drawBoard(canvas, ctx)
    this.drawBorder(canvas, ctx)

    if (gainedScore) {
      this.drawGainedScore(canvas, ctx, gainedScore)
    }

    this.drawTotalScore(canvas, ctx)
    this.drawCurrentLevel(canvas, ctx)
  }

  private clearCanvas(canvas: Canvas, ctx: Ctx): void {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  private drawBlock(x: number, y: number, width: number, height: number, ctx: Ctx): void {
    const radius = Math.floor(width / 10)

    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.arcTo(x + width, y,   x + width, y + height, radius)
    ctx.arcTo(x + width, y + height, x,   y + height, radius)
    ctx.arcTo(x,   y + height, x,   y,   radius)
    ctx.arcTo(x,   y,   x + width, y,   radius)
    ctx.closePath()
    ctx.fill()
  }

  private drawBoard(canvas: Canvas, ctx: Ctx): void {
    const { board } = this.state

    // Calculate board size so that borders end on exact pixels
    const boardWidth = canvas.width - (canvas.width % this.columnCount)
    const boardHeight = canvas.height - (canvas.height % this.rowCount)

    // Draw the board background
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0 , boardWidth, boardHeight)

    const cellWidth = boardWidth / this.columnCount
    const cellHeight = boardHeight / this.rowCount
    const innerWidth = Math.floor(cellWidth * 0.97)
    const innerHeight = Math.floor(cellHeight * 0.97)
    const paddingX = Math.floor((cellWidth - innerWidth) / 2)
    const paddingY = Math.floor((cellHeight - innerHeight) / 2)

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {

        const x = (columnIndex * cellWidth) + paddingX
        const y = (rowIndex * cellHeight) + paddingY

        ctx.fillStyle = "#1d1f21"
        ctx.fillRect(x, y, innerWidth, innerHeight)

        if (cell) {
          ctx.fillStyle = cell ? cell.color : "white"
          this.drawBlock(x, y, innerWidth, innerHeight, ctx)
        }
      })
    })
  }

  private drawBorder(canvas: Canvas, ctx: Ctx): void {
    ctx.strokeStyle = "black"
    ctx.strokeRect(0, 0, canvas.width, canvas.height)
  }

  private drawGainedScore(canvas: Canvas, ctx: Ctx, gainedScore: number) {
    ctx.font = `60px '${fonts.PRESS_START_2P}'`
    ctx.fillStyle = "black"
    ctx.textAlign = "center"
    ctx.fillText(`+${gainedScore}`, canvas.width / 2, canvas.height / 2)
  }

  private drawTotalScore(canvas: Canvas, ctx: Ctx) {
    const { totalScore } = this.state

    const coeff = canvas.width / 30
    ctx.font = `${coeff}px '${fonts.PRESS_START_2P}'`
    ctx.fillStyle = "black"
    ctx.textAlign = "left"
    ctx.fillText(`${totalScore}`.padStart(8, "0"), 20, 2 * coeff)
  }

  private drawCurrentLevel(canvas: Canvas, ctx: Ctx) {
    const { currentLevel } = this.state
    const coeff = canvas.width / 30
    ctx.font = `${coeff}px '${fonts.PRESS_START_2P}'`
    ctx.fillStyle = "black"
    ctx.textAlign = "left"
    ctx.fillText(`Level ${`${currentLevel}`.padStart(2, "0")}`, 20, 4 * coeff)
  }

  private get ctx(): Ctx | undefined {
    const canvas = this.canvas
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      return
    }

    return ctx
  }

  private get canvas(): Canvas | undefined {
    return this.refs.canvas as Canvas | undefined
  }

  private resizeCanvasToParentSize(): void {
    const canvas = this.canvas
    if (!canvas) {
      return
    }

    const parentElement = canvas.parentElement
    if (!parentElement) {
      return
    }

    const parent = {
      width: parentElement.clientWidth,
      height: parentElement.clientHeight,
    }
    const aspectRatio = this.columnCount / this.rowCount
    const { width, height } = calculateCanvasSize({
      parent,
      aspectRatio,
    })

    canvas.width = width
    canvas.height = height

    const ctx = this.ctx
    if (!ctx) {
      return
    }

    this.renderGame(canvas, ctx)
  }
}
