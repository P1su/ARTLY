import UIKit
import WebKit
import AVFoundation

// MARK: - Delegate Protocol
protocol WebViewHandlerDelegate: AnyObject {
    func webViewLoadingStateChanged(isLoading: Bool)
    func webViewShouldOpenExternal(url: URL) -> Bool
    func webViewNeedsPermissionAlert()
    func webViewDidReceiveJSMessage(name: String, body: Any)
}

// MARK: - WebViewHandler Class
final class WebViewHandler: NSObject, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler {
    
    // MARK: - Constants
    private let messageHandlerName = "NativeBridge"
    private let setUserIdHandlerName = "setUserId"
    private let getFcmTokenHandlerName = "getFcmToken"
    private let downloadImageHandlerName = "downloadImage"
    
    // MARK: - Properties
    weak var delegate: WebViewHandlerDelegate?
    let webView: WKWebView

    // MARK: - Init
    override init() {
        let webConfiguration = WKWebViewConfiguration()
        
        self.webView = WKWebView(frame: .zero, configuration: webConfiguration)
        
        super.init()
        
        setupUserContentController(webConfiguration.userContentController)
        
        // 다운로드 핸들러 (혹시 나중에 쓸 수도 있으니 유지)
        webConfiguration.userContentController.add(self, name: downloadImageHandlerName)
        
        self.webView.navigationDelegate = self
        self.webView.uiDelegate = self
        self.webView.allowsBackForwardNavigationGestures = true
        self.webView.translatesAutoresizingMaskIntoConstraints = false
        self.webView.configuration.preferences.javaScriptEnabled = true
        
        if #available(iOS 14.0, *) {
            self.webView.configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        }
        
        if #available(iOS 16.4, *) {
            self.webView.isInspectable = true
        }
    }
    
    deinit {
        webView.configuration.userContentController.removeAllUserScripts()
        webView.configuration.userContentController.removeScriptMessageHandler(forName: messageHandlerName)
        webView.configuration.userContentController.removeScriptMessageHandler(forName: setUserIdHandlerName)
        webView.configuration.userContentController.removeScriptMessageHandler(forName: getFcmTokenHandlerName)
        webView.configuration.userContentController.removeScriptMessageHandler(forName: downloadImageHandlerName)
    }
    
    // MARK: - Public Methods
    func loadInitialPage() {
        guard let url = URL(string: "https://artly.soundgram.co.kr/") else { return }
        
        let request = URLRequest(url: url)
        delegate?.webViewLoadingStateChanged(isLoading: true)
        
        DispatchQueue.main.async { [weak self] in
            self?.webView.load(request)
        }
    }
    
    // MARK: - Private Setup Methods
    private func setupUserContentController(_ contentController: WKUserContentController) {
        // Zoom 방지
        let zoomScript = WKUserScript(
            source: """
            var meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            var head = document.getElementsByTagName('head')[0];
            if (head) { head.appendChild(meta); }
            """,
            injectionTime: .atDocumentEnd,
            forMainFrameOnly: true
        )
        contentController.addUserScript(zoomScript)
        
        // iOS Service Worker 충돌 방지
        let swPolyfillScript = WKUserScript(
            source: """
            if (typeof navigator.serviceWorker === 'undefined') {
                Object.defineProperty(navigator, 'serviceWorker', {
                    value: {
                        register: function() { return Promise.resolve(); },
                        addEventListener: function() {},
                        removeEventListener: function() {},
                        ready: Promise.resolve()
                    },
                    writable: false
                });
            }
            """,
            injectionTime: .atDocumentStart,
            forMainFrameOnly: true
        )
        contentController.addUserScript(swPolyfillScript)
        
        // [Handlers] 메시지 핸들러 등록
        contentController.add(self, name: messageHandlerName)
        contentController.add(self, name: setUserIdHandlerName)
        contentController.add(self, name: getFcmTokenHandlerName)
    }
    
    // MARK: - Image Download Logic
    private func saveImageToGallery(urlString: String) {
        // Case 1: Base64 데이터가 넘어온 경우 (리액트 html-to-image가 보내는 방식)
        if urlString.hasPrefix("data:image") {
            // "data:image/png;base64," 같은 앞부분 떼어내기
            guard let range = urlString.range(of: "base64,") else {
                return
            }
            let base64String = String(urlString[range.upperBound...])
            
            // 공백이나 줄바꿈 제거
            let cleanBase64 = base64String.replacingOccurrences(of: "\r\n", with: "")
                                          .replacingOccurrences(of: "\n", with: "")
            
            if let data = Data(base64Encoded: cleanBase64),
               let image = UIImage(data: data) {
                DispatchQueue.main.async {
                    UIImageWriteToSavedPhotosAlbum(image, self, #selector(self.image(_:didFinishSavingWithError:contextInfo:)), nil)
                }
            }
            return
        }
        
        // Case 2: 일반 HTTP URL이 넘어온 경우
        guard let url = URL(string: urlString) else { return }
        URLSession.shared.dataTask(with: url) { [weak self] data, response, error in
            guard let self = self else { return }
            guard let data = data, let image = UIImage(data: data), error == nil else {
                return
            }
            
            DispatchQueue.main.async {
                UIImageWriteToSavedPhotosAlbum(image, self, #selector(self.image(_:didFinishSavingWithError:contextInfo:)), nil)
            }
        }.resume()
    }

    // 저장 완료 후 알림 띄우기
    @objc func image(_ image: UIImage, didFinishSavingWithError error: Error?, contextInfo: UnsafeRawPointer) {
        if let error = error {
            print("저장 실패에 실패하셨습니다.: \(error.localizedDescription)")
        } else {
            // 저장 성공 알림창 띄우기
            let alertController = UIAlertController(title: "저장 완료", message: "이미지가 갤러리에 저장되었습니다.", preferredStyle: .alert)
            alertController.addAction(UIAlertAction(title: "확인", style: .default))
            webView.presentingViewController()?.present(alertController, animated: true)
        }
    }
}

// MARK: - WKNavigationDelegate Implementation
extension WebViewHandler {

    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        delegate?.webViewLoadingStateChanged(isLoading: true)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        delegate?.webViewLoadingStateChanged(isLoading: false)
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        delegate?.webViewLoadingStateChanged(isLoading: false)
    }
    
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        delegate?.webViewLoadingStateChanged(isLoading: false)
    }
    
    func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationAction: WKNavigationAction,
        decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
    ) {
        guard let url = navigationAction.request.url else {
            decisionHandler(.allow)
            return
        }
        
        // 웹에서 이미지를 다운받으려고 하면 가로채서 iOS에 저장
        if url.absoluteString.hasPrefix("data:image") {
            saveImageToGallery(urlString: url.absoluteString)
            decisionHandler(.cancel) // 페이지 이동 차단
            return
        }

        // iframe 등 서브 프레임 처리
        if navigationAction.targetFrame == nil {
            webView.load(navigationAction.request)
            decisionHandler(.cancel)
            return
        }
        if let targetFrame = navigationAction.targetFrame, !targetFrame.isMainFrame {
            decisionHandler(.allow)
            return
        }
        
        // 외부 링크 처리
        if delegate?.webViewShouldOpenExternal(url: url) == true {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
            decisionHandler(.cancel)
            return
        }

        decisionHandler(.allow)
    }
    
    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        webView.reload()
    }
}

// MARK: - WKUIDelegate Implementation
extension WebViewHandler {
    
    func webView(
        _ webView: WKWebView,
        runJavaScriptAlertPanelWithMessage message: String,
        initiatedByFrame frame: WKFrameInfo,
        completionHandler: @escaping () -> Void
    ) {
        let alertController = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alertController.addAction(UIAlertAction(title: "확인", style: .default, handler: { _ in
            completionHandler()
        }))
        webView.presentingViewController()?.present(alertController, animated: true)
    }

    // 아까 여기에 잘못 들어갔던 코드를 삭제하고 원상복구 했습니다.
    func webView(
        _ webView: WKWebView,
        runJavaScriptConfirmPanelWithMessage message: String,
        initiatedByFrame frame: WKFrameInfo,
        completionHandler: @escaping (Bool) -> Void
    ) {
        let alertController = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alertController.addAction(UIAlertAction(title: "취소", style: .cancel, handler: { _ in
            completionHandler(false)
        }))
        alertController.addAction(UIAlertAction(title: "확인", style: .default, handler: { _ in
            completionHandler(true)
        }))
        webView.presentingViewController()?.present(alertController, animated: true)
    }
    
    func webView(
        _ webView: WKWebView,
        createWebViewWith configuration: WKWebViewConfiguration,
        for navigationAction: WKNavigationAction,
        windowFeatures: WKWindowFeatures
    ) -> WKWebView? {
        if let url = navigationAction.request.url {
            if delegate?.webViewShouldOpenExternal(url: url) == true {
                UIApplication.shared.open(url, options: [:], completionHandler: nil)
            } else {
                webView.load(navigationAction.request)
            }
        }
        return nil
    }

    func webView(
        _ webView: WKWebView,
        requestMediaCapturePermissionFor origin: WKSecurityOrigin,
        initiatedByFrame frame: WKFrameInfo,
        type: WKMediaCaptureType,
        decisionHandler: @escaping (WKPermissionDecision) -> Void
    ) {
        guard type == .camera else {
            decisionHandler(.deny)
            return
        }

        let authStatus = AVCaptureDevice.authorizationStatus(for: .video)
        switch authStatus {
        case .authorized:
            decisionHandler(.grant)
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { granted in
                DispatchQueue.main.async {
                    if !granted {
                        self.delegate?.webViewNeedsPermissionAlert()
                    }
                    decisionHandler(granted ? .grant : .deny)
                }
            }
        case .denied, .restricted:
            delegate?.webViewNeedsPermissionAlert()
            decisionHandler(.deny)
        @unknown default:
            decisionHandler(.deny)
        }
    }
}

// MARK: - WKScriptMessageHandler Implementation
extension WebViewHandler {
    func userContentController(
        _ userContentController: WKUserContentController,
        didReceive message: WKScriptMessage
    ) {
        switch message.name {
        case setUserIdHandlerName:
            handleSetUserId(message: message)
            
        case getFcmTokenHandlerName:
            handleGetFcmToken(message: message)
            
        case messageHandlerName:
            delegate?.webViewDidReceiveJSMessage(name: message.name, body: message.body)
            
        case downloadImageHandlerName:
            if let urlString = message.body as? String {
                saveImageToGallery(urlString: urlString)
            }
            
        default:
            break
        }
    }
    
    private func handleSetUserId(message: WKScriptMessage) {
        var finalUserId: Int? = nil
        
        if let intValue = message.body as? Int { finalUserId = intValue }
        else if let strValue = message.body as? String { finalUserId = Int(strValue) }
        else if let doubleValue = message.body as? Double { finalUserId = Int(doubleValue) }
        else if let numValue = message.body as? NSNumber { finalUserId = numValue.intValue }
        
        guard let userId = finalUserId else { return }
        
        FCMService.shared.saveUserId(userId)
        
        if let token = FCMService.shared.getToken() {
            FCMService.shared.sendTokenToServer(token, userId: userId)
        }
    }
    
    private func handleGetFcmToken(message: WKScriptMessage) {
        let token = FCMService.shared.getToken() ?? ""
        
        let script = """
            if (window.receiveFcmToken) {
                window.receiveFcmToken('\(token)');
            }
        """
        
        webView.evaluateJavaScript(script, completionHandler: nil)
    }
}

// MARK: - Helper Extension
extension WKWebView {
    func presentingViewController() -> UIViewController? {
        var responder: UIResponder? = self
        while let nextResponder = responder?.next {
            responder = nextResponder
            if let vc = responder as? UIViewController {
                return vc
            }
        }
        return nil
    }
}
