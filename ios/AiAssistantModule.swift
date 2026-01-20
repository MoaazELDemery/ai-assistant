import ExpoModulesCore

public class AiAssistantModule: Module {
  public func definition() -> ModuleDefinition {
    Name("AiAssistant")

    Constants([
      "PI": Double.pi
    ])

    Events("onChange")

    Function("hello") {
      return "Hello world! 👋"
    }

    AsyncFunction("setValueAsync") { (value: String) in
      self.sendEvent("onChange", [
        "value": value
      ])
    }

    View(AiAssistantView.self) {
      Prop("url") { (view: AiAssistantView, url: URL) in
        if view.webView.url != url {
            view.webView.load(URLRequest(url: url))
        }
      }

      Events("onLoad")
    }
  }
}
