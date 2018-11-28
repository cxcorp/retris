import { defaultTranslations, Translations } from "./default-translations"
import { createTranslate } from "./translate"

test("default translation", () => {
  const translate = createTranslate({} as any)
  const key = "display.waiting.header.big"

  const result = translate(key)

  expect(result).toEqual(defaultTranslations[key])
})

test("translation", () => {
  const translate = createTranslate(translations)
  const key = "display.waiting.header.big"

  const result = translate(key)

  expect(result).toEqual(translations[key])
})

test("interpolation", () => {
  const key = "display.waiting.header.big"
  const translate = createTranslate({
    ...translations,
    [key]: "hello {{world}}",
  })

  const result = translate(key, { world: "foo" })

  expect(result).toEqual("hello foo")
})

const translations: Translations = {
  "display.waiting.header.big": "play game!",
  "display.waiting.header.small": "go to",
  "display.waiting.info": "This screen will turn into a Tetris matrix.",
  "display.waiting-to-start.header.big": "ready",
  "display.waiting-to-start.header.small.line1": "press start",
  "display.waiting-to-start.header.small.line2": "on your mobile",
  "display.display-game.score": "score",
  "display.display-game.time": "time",
  "display.game-over.your-score": "your score",
  "display.game-over.about-us": "We solve the most complex puzzles.",
  "display.game-over.website": "reaktor.com",
  "controller.start-game.heading": "You're up! 🙋‍♀️",
  "controller.start-game.swipe-instruction": "Swipe to move them",
  "controller.start-game.tap-instruction": "Tap to rotate them",
  "controller.start-game.start-button": "Start",
  "controller.in-queue.heading": "Hang tight! 🎮",
  "controller.in-queue.queue-intro-start": "There are",
  "controller.in-queue.queue-intro-end": "players in the line before you.",
}
