import Firebase
import FirebaseMessaging
import Foundation

class FCMService: NSObject {
    
    static let shared = FCMService()
    
    private override init() {}
    
    func setup() {
        Messaging.messaging().delegate = self
    }
    
    // MARK: - 토큰 및 UserID 관리
    
    func saveToken(_ token: String) {
        UserDefaults.standard.set(token, forKey: "fcmToken")
    }
    
    func getToken() -> String? {
        return UserDefaults.standard.string(forKey: "fcmToken")
    }
    
    func saveUserId(_ userId: Int) {
        UserDefaults.standard.set(userId, forKey: "userId")
    }
    
    func getUserId() -> Int? {
        let userId = UserDefaults.standard.integer(forKey: "userId")
        return userId > 0 ? userId : nil
    }
    
    // MARK: - 서버 전송 로직
    
    func sendTokenToServer(_ token: String, userId: Int? = nil) {
        // 전달받은 userId가 없으면 저장된 userId를 사용
        let targetUserId = userId ?? getUserId()
        
        // userId가 없으면(비로그인) 토큰만 로컬에 저장하고 종료
        guard let uid = targetUserId else {
            saveToken(token)
            return
        }
        
        // userId가 있으면 서버로 전송
        registerTokenToServer(userId: uid, fcmToken: token)
    }
    
    private func registerTokenToServer(userId: Int, fcmToken: String) {
        guard let url = URL(string: "https://artly.soundgram.co.kr/api/notification/registerToken") else { return }
        
        let parameters: [String: Any] = [
            "user_id": userId,
            "fcm_token": fcmToken
        ]
        
        guard let httpBody = try? JSONSerialization.data(withJSONObject: parameters) else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = httpBody
        request.timeoutInterval = 10
        
        let task = URLSession.shared.dataTask(with: request) { _, response, error in
            if error != nil { return }
            
            guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else { return }
            
            // 전송 성공 시 로컬에도 최신 정보 업데이트
            self.saveToken(fcmToken)
            self.saveUserId(userId)
        }
        
        task.resume()
    }
    
    /// 현재 토큰 가져오기 (앱 시작 시 호출)
    func fetchCurrentToken() {
        Messaging.messaging().token { token, error in
            if error != nil { return }
            
            guard let token = token else { return }
            
            self.saveToken(token)
            
            if let userId = self.getUserId() {
                self.sendTokenToServer(token, userId: userId)
            }
        }
    }
}

// MARK: - MessagingDelegate
extension FCMService: MessagingDelegate {
    
    /// 토큰이 갱신되었을 때 자동 호출
    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        guard let token = fcmToken else { return }
        
        saveToken(token)
        
        if let userId = getUserId() {
            sendTokenToServer(token, userId: userId)
        }
    }
}
