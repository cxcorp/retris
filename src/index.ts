import express from "express"
import { createServer } from "http"
import next from "next"
import socketio from "socket.io"
import { logger } from "./logger"
import { createSocketIOServer } from "./server/socketio"
import {
  SocketIOControllers,
  SocketIODisplays,
} from "./server/socketio-adapters"
import { State } from "./server/state"

const port = parseInt(process.env.PORT || "3000", 10)
const dev = process.env.NODE_ENV !== "production"
const nextApp = next({ dev, dir: __dirname })
const nextHandler = nextApp.getRequestHandler()

nextApp.prepare().then(() => {
  const app = express()
  const server = createServer(app)
  const io = socketio(server)
  const displayNamespace = io.of("/display")
  const controllerNamespace = io.of("/controller")

  const state = new State(
    new SocketIODisplays(displayNamespace),
    new SocketIOControllers(controllerNamespace),
  )
  createSocketIOServer(state, {
    display: displayNamespace,
    controller: controllerNamespace,
  })

  app.get("*", (req, res) => {
    return nextHandler(req, res)
  })

  server.listen(port, (err: Error) => {
    if (err) {
      throw err
    }
    logger.info(`> Ready on http://localhost:${port}`)
  })
})