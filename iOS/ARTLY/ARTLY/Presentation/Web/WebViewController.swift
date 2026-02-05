import UIKit
import WebKit

typealias ActivityIndicatorType = UIActivityIndicatorView

class WebViewController: UIViewController {

    // MARK: - Properties
    
    private let webViewHandler: WebViewHandler = WebViewHandler()
    
    private var webView: WKWebView {
        return webViewHandler.webView
    }
    
    let activityIndicator = ActivityIndicatorType(style: .large)
    
    // 오프라인 안내 뷰
    private let offlineView: UIView = {
        let view = UIView()
        view.backgroundColor = .white
        view.isHidden = true // 처음엔 숨김
        view.translatesAutoresizingMaskIntoConstraints = false
        
        // 아이콘 (와이파이 끊김 모양)
        let icon = UIImageView(image: UIImage(systemName: "wifi.slash"))
        icon.tintColor = .gray
        icon.contentMode = .scaleAspectFit
        icon.translatesAutoresizingMaskIntoConstraints = false
        
        // 안내 텍스트
        let label = UILabel()
        label.text = "네트워크 연결을 확인해주세요.\n연결되면 자동으로 새로고침 됩니다."
        label.textColor = .darkGray
        label.textAlignment = .center
        label.numberOfLines = 0
        label.font = UIFont.systemFont(ofSize: 16, weight: .medium)
        label.translatesAutoresizingMaskIntoConstraints = false
        
        // 새로고침 버튼 (수동)
        let button = UIButton(type: .system)
        button.setTitle("다시 시도", for: .normal)
        button.setTitleColor(.white, for: .normal)
        button.backgroundColor = .black
        button.layer.cornerRadius = 8
        button.contentEdgeInsets = UIEdgeInsets(top: 10, left: 20, bottom: 10, right: 20)
        button.translatesAutoresizingMaskIntoConstraints = false
        button.addTarget(self, action: #selector(retryConnection), for: .touchUpInside)
        
        view.addSubview(icon)
        view.addSubview(label)
        view.addSubview(button)
        
        NSLayoutConstraint.activate([
            icon.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            icon.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: -60),
            icon.widthAnchor.constraint(equalToConstant: 80),
            icon.heightAnchor.constraint(equalToConstant: 80),
            
            label.topAnchor.constraint(equalTo: icon.bottomAnchor, constant: 20),
            label.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            
            button.topAnchor.constraint(equalTo: label.bottomAnchor, constant: 30),
            button.centerXAnchor.constraint(equalTo: view.centerXAnchor)
        ])
        
        return view
    }()

    // MARK: - Lifecycle

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // 1. Delegate 설정
        webViewHandler.delegate = self
        
        // 2. UI 설정
        setupUI()
        
        // 3. FCM 초기화
        DispatchQueue.global(qos: .background).async {
            FCMService.shared.fetchCurrentToken()
        }
        
        // 4. 페이지 로드
        webViewHandler.loadInitialPage()
        
        // 5. 네트워크 모니터링 시작
        startNetworkMonitoring()
    }
    
    // MARK: - Network Monitoring
    
    private func startNetworkMonitoring() {
        // 모니터 시작
        NetworkMonitor.shared.startMonitoring()
        
        // 상태 변화 감지 핸들러
        NetworkMonitor.shared.connectionStatusChangedHandler = { [weak self] isConnected in
            DispatchQueue.main.async {
                self?.handleNetworkChange(isConnected: isConnected)
            }
        }
    }
    
    private func handleNetworkChange(isConnected: Bool) {
        if isConnected {
            
            // 오프라인 뷰 숨기기
            self.offlineView.isHidden = true
            self.webView.isHidden = false
            
            // 연결이 복구되었는데 웹뷰가 비어있거나 에러 상태라면 새로고침
            if self.webView.url == nil || self.webView.url?.absoluteString == "about:blank" {
                self.webViewHandler.loadInitialPage()
            } else {
                // 이미 로드 중이었다면 굳이 처음부터 다시 할 필요 없이 리로드
                self.webView.reload()
            }
            
        } else {
            
            // 오프라인 뷰 띄우기
            self.offlineView.isHidden = false
            self.webView.isHidden = true // 웹뷰 숨김 (흰 화면 방지)
            self.activityIndicator.stopAnimating()
        }
    }
    
    @objc private func retryConnection() {
        // 수동 새로고침 버튼 눌렀을 때
        if NetworkMonitor.shared.isConnected {
            handleNetworkChange(isConnected: true)
        } else {
            let alert = UIAlertController(title: "알림", message: "아직 네트워크에 연결되지 않았습니다.", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "확인", style: .default))
            present(alert, animated: true)
        }
    }
    
    // MARK: - Setup

    private func setupUI() {
        view.backgroundColor = .white
        
        // WebView 추가
        view.addSubview(webView)
        
        // ActivityIndicator 추가
        view.addSubview(activityIndicator)
        activityIndicator.translatesAutoresizingMaskIntoConstraints = false
        activityIndicator.color = .gray
        
        view.addSubview(offlineView)

        let safeArea = view.safeAreaLayoutGuide
        NSLayoutConstraint.activate([
            // WebView constraints
            webView.topAnchor.constraint(equalTo: safeArea.topAnchor),
            webView.bottomAnchor.constraint(equalTo: safeArea.bottomAnchor),
            webView.leadingAnchor.constraint(equalTo: safeArea.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: safeArea.trailingAnchor),
            
            // ActivityIndicator constraints
            activityIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            activityIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            
            offlineView.topAnchor.constraint(equalTo: view.topAnchor),
            offlineView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            offlineView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            offlineView.trailingAnchor.constraint(equalTo: view.trailingAnchor)
        ])
    }
    
    private func showPermissionDeniedAlert() {
        let alert = UIAlertController(
            title: "카메라 접근 불가",
            message: "카메라를 사용하려면 '설정'에서 카메라 접근 권한을 허용해주세요.",
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "설정으로 이동", style: .default) { _ in
            guard let settingsUrl = URL(string: UIApplication.openSettingsURLString),
                  UIApplication.shared.canOpenURL(settingsUrl) else { return }
            UIApplication.shared.open(settingsUrl)
        })
        alert.addAction(UIAlertAction(title: "취소", style: .cancel))
        self.present(alert, animated: true)
    }
}

// MARK: - WebViewHandlerDelegate
extension WebViewController: WebViewHandlerDelegate {
    
    func webViewLoadingStateChanged(isLoading: Bool) {
        DispatchQueue.main.async {
            // 네트워크가 끊겨있으면 로딩 인디케이터도 돌지 않게 함
            if isLoading && NetworkMonitor.shared.isConnected {
                self.activityIndicator.startAnimating()
            } else {
                self.activityIndicator.stopAnimating()
            }
        }
    }
    
    func webViewShouldOpenExternal(url: URL) -> Bool {
        let appHost = URL(string: "https://artly.soundgram.co.kr/")?.host
        let targetHost = url.host
        
        return targetHost != appHost && (url.scheme == "http" || url.scheme == "https")
    }

    func webViewNeedsPermissionAlert() {
        DispatchQueue.main.async {
            self.showPermissionDeniedAlert()
        }
    }
    
    func webViewDidReceiveJSMessage(name: String, body: Any) {
        // 필요 시 처리
    }
}
