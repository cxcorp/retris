import React, { Component, Fragment } from "react"
import css from "styled-jsx/css"
import { commands } from "../../commands"
import { JoinHelpBar } from "../../components/join-help-bar"
import { OnGameOver, Tetris } from "../../components/tetris"

interface Emitter {
  on(event: string, handler: (command: string) => void): void
  removeListener(event: string, handler: (command: string) => void): void
}

interface DisplayGameProps {
  emitter: Emitter
  onGameOver: OnGameOver
}

export class Game extends Component<DisplayGameProps> {
  componentDidMount() {
    const { emitter } = this.props
    emitter.on(commands.ACTION, this.handleCommand)
  }

  componentWillUnmount() {
    const { emitter } = this.props
    emitter.removeListener(commands.ACTION, this.handleCommand)
  }

  handleCommand = (command: string) => {
    const tetris = this.refs.tetris as Tetris
    switch (command) {
      case commands.LEFT:
        tetris.left()
        break
      case commands.RIGHT:
        tetris.right()
        break
      case commands.DOWN:
        tetris.down()
        break
      case commands.TAP:
        tetris.rotate()
        break
    }
  }

  render() {
    const { className, styles } = css.resolve`{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
    }`

    return (
      <Fragment>
        <div className="wrap">
          <div className="tetris-wrap">
            <Tetris ref="tetris" onGameOver={this.props.onGameOver} />
          </div>
          <JoinHelpBar className={className} />
        </div>
        {styles}
        <style jsx>{`
          .wrap {
            flex-grow: 1;
          }

          .tetris-wrap {
            text-align: center;
            height: calc(100% - 80px);
          }
        `}</style>
      </Fragment>
    )
  }
}
