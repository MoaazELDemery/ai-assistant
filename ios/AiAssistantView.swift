import ExpoModulesCore
import WebKit

class AiAssistantView: ExpoView {
  let webView = WKWebView()
  let onLoad = EventDispatcher()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    clipsToBounds = true
    addSubview(webView)
    webView.navigationDelegate = self
  }

  override func layoutSubviews() {
    webView.frame = bounds
  }
}

extension AiAssistantView: WKNavigationDelegate {
  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    onLoad([
      "url": webView.url?.absoluteString ?? ""
    ])
  }
}
