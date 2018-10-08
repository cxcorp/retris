import { Component } from 'react'
import {
  DISPLAY_WAITING,
  DISPLAY_WAITING_TO_START,
  DISPLAY_GAME,
  DISPALY_GAME_OVER
} from '../lib/views'
import Waiting from '../views/display/waiting'
import WaitingToStart from '../views/display/waitingToStart'
import Game from '../views/display/game'
import GameOver from '../views/display/gameOver'
import { PETER_RIVER } from '../lib/styles/colors'

export default class Display extends Component {
  state = {
    commands: [],
    context: null,
    activeView: DISPLAY_WAITING,
    score: 0
  }

  componentDidMount() {
    this.props.socket.emit('createGame')
  }

  addToScore = integer => {
    this.setState(prevState => {
      return { score: prevState.score + integer }
    })
  }

  resetScore = () => {
    this.setState({ score: 0 })
  }

  render () {
    let { activeView, score } = this.state

    return (
      <main>
        {(() => {
          switch(activeView) {
            case DISPLAY_WAITING:
              return <Waiting />
            case DISPLAY_WAITING_TO_START:
              return <WaitingToStart />
            case DISPLAY_GAME:
              return <Game
                       socket={this.props.socket}
                       addToScore={this.addToScore}
                       resetScore={this.resetScore}
                       score={score}
                     />
            case DISPALY_GAME_OVER:
              return <GameOver score={score} />
          }
        })()}
        <style jsx>{`
          main {
            background-color: ${PETER_RIVER};
            background-image: url('/static/r-symbol.png');
            background-size: 50px;
            background-repeat: no-repeat;
            background-position: 1vw 1vw;
          }
        `}</style>
      </main>
    )
  }
}
