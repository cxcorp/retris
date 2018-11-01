import React, { Component, Fragment } from "react"
import io from "socket.io-client"
import css from "styled-jsx/css"
import { commands } from "../../commands"
import { JoinHelpBar } from "../../components/join-help-bar"
import { OnGameOver, Tetris } from "../../components/tetris"

interface DisplayGameProps {
  socket: typeof io.Socket
  onGameOver: OnGameOver
}

export class Game extends Component<DisplayGameProps> {
  componentDidMount() {
    this.props.socket.on("action", this.handleCommand)
  }

  componentWillUnmount() {
    this.props.socket.removeListener("action", this.handleCommand)
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
    const { className, styles } = css.resolve`
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
    `

    return (
      <Fragment>
        <div className="wrap">
          <Tetris ref="tetris" onGameOver={this.props.onGameOver} />
          <JoinHelpBar className={className} />
        </div>
        {styles}
        <style jsx>{`
          .wrap {
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </Fragment>
    )
  }
}
