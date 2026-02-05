import Network
import Foundation

final class NetworkMonitor {
    static let shared = NetworkMonitor()
    
    private let monitor: NWPathMonitor
    private let queue = DispatchQueue.global()
    
    public private(set) var isConnected: Bool = false
    
    // 연결 상태가 변할 때 실행될 클로저 (함수)
    public var connectionStatusChangedHandler: ((Bool) -> Void)?

    private init() {
        monitor = NWPathMonitor()
    }

    public func startMonitoring() {
        monitor.start(queue: queue)
        
        monitor.pathUpdateHandler = { [weak self] path in
            // 인터넷이 연결되어 있으면 true, 아니면 false
            let isConnected = path.status == .satisfied
            self?.isConnected = isConnected
            
            // 상태가 변했을 때 알림
            self?.connectionStatusChangedHandler?(isConnected)
        }
    }

    public func stopMonitoring() {
        monitor.cancel()
    }
}
