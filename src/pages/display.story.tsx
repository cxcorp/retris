import { storiesOf } from "@storybook/react"
import React from "react"
import { ReplaySubject } from "rxjs"
import { Analytics } from "../analytics"
import { commands } from "../commands"
import { TranslationContext } from "../components/contexts"
import { withAutoUnsubscribe } from "../components/with-auto-unsubscribe"
import { SocketPayload } from "../components/with-socket"
import { defaultTranslations } from "../i18n/default-translations"
import { createTranslate } from "../i18n/translate"
import { views } from "../views"
import { _Display } from "./display"

const analyticsStub: Analytics = {
  sendCustomEvent: () => undefined,
  sendPageView: () => undefined,
}

const socket = new ReplaySubject<SocketPayload>()

document.addEventListener("keyup", e => {
  switch (e.key) {
    case "ArrowDown":
      socket.next({ event: commands.ACTION, payload: commands.DOWN })
      break
    case "ArrowLeft":
      socket.next({ event: commands.ACTION, payload: commands.LEFT })
      break
    case "ArrowRight":
      socket.next({ event: commands.ACTION, payload: commands.RIGHT })
      break
    case "Enter":
    case "Enter":
    case " ":
    case "ArrowUp":
      socket.next({ event: commands.ACTION, payload: commands.TAP })
      break
  }
})

const Display = withAutoUnsubscribe(_Display)

const View = () => {
  return (
    <TranslationContext.Provider value={createTranslate(defaultTranslations)}>
      <Display
        analytics={analyticsStub}
        address={window.location.hostname}
        socket={socket}
      />
    </TranslationContext.Provider>
  )
}

storiesOf("Display", module)
  .add("Waiting", () => {
    socket.next({
      event: "state",
      payload: { activeView: views.DISPLAY_WAITING },
    })

    return <View />
  })
  .add("Waiting To Start", () => {
    socket.next({
      event: "state",
      payload: { activeView: views.DISPLAY_WAITING_TO_START },
    })

    return <View />
  })
  .add("Game", () => {
    socket.next({
      event: "state",
      payload: { activeView: views.DISPLAY_GAME },
    })

    return <View />
  })
  .add("Game Over", () => {
    socket.next({
      event: "state",
      payload: { activeView: views.DISPLAY_GAME_OVER },
    })

    return <View />
  })
