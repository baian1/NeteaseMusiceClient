import React from "react"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import store from "./stroe"
import { renderRoutes } from "react-router-config"
import routes from "./routes"

class App extends React.Component {
  public render(): JSX.Element {
    return (
      <Provider store={store}>
        <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
      </Provider>
    )
  }
}

export { App }
