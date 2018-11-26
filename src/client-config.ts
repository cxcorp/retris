console.log("static", process.env.STATIC_PATH, typeof process.env.STATIC_PATH) // tslint:disable-line no-console

export const clientConfig = {
  googleAnalytics: {
    trackingCode: process.env.GA_TRACKING_CODE || "UA-XXXXXXXXX-X",
    debugMode: process.env.GA_DEBUG_MODE === "true",
  },
  staticPath: typeof process.env.STATIC_PATH === "undefined" ? "/static" : "",
}
