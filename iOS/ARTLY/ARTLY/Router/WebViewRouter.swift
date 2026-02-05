import UIKit
import SafariServices

protocol WebViewRoutable: AnyObject {
    func routeToSettingsForPermission()
    func openExternalURLInSafari(_ url: URL)
    func dismissWebView()
}

final class WebViewRouter: WebViewRoutable {
    weak var viewController: UIViewController?
    
    init(viewController: UIViewController) {
        self.viewController = viewController
    }
    
    /// 권한 거부 시 사용자에게 설정 앱으로 이동하도록 안내하는 Alert
    func routeToSettingsForPermission() {
        guard let vc = viewController else { return }
        
        DispatchQueue.main.async {
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
            vc.present(alert, animated: true)
        }
    }
    
    func openExternalURLInSafari(_ url: URL) {
        UIApplication.shared.open(url, options: [:], completionHandler: nil)
    }
    
    func showAlert(title: String, message: String, actions: [UIAlertAction]) {
        guard let vc = viewController else { return }
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .alert)
        actions.forEach { alertController.addAction($0) }
        vc.present(alertController, animated: true)
    }
    
    func dismissWebView() {
        DispatchQueue.main.async {
            self.viewController?.dismiss(animated: true, completion: nil)
        }
    }
}
