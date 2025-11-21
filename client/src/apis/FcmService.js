import { getToken, onMessage } from 'firebase/messaging';
import Cookies from 'js-cookie'; 
import { messaging } from '../utils/firebase-config.js'; 
import { instance } from './instance'; 

const VAPID_KEY = import.meta.env.VITE_FCM_VAPID_KEY; 
const FCM_TOKEN_KEY = 'fcm_token'; 

export const requestFCMToken = async (userId) => {

  // Android 환경에서
  if (typeof window.Android !== 'undefined') {
    console.log(`WebView에서 가져온 User_Id : ${userId}`);
    
    const nativeToken = window.Android.getFcmToken();
    
    if (nativeToken) {
        console.log(`안드로이드 FCM Token: ${nativeToken}`);
        window.Android.setUserId(userId);
        return nativeToken;
    } else {
        console.warn(`Android에서 Fcm 토큰을 가져오지 못했습니다.`);
        window.Android.setUserId(userId);
        return 'NATIVE_MODE_PENDING';
    }
  }

  // 웹 환경에서
  try { 
    console.log('알림 권한 요청');
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('알림 요청 수락됨');
      
      const token = await getToken(messaging, { 
        vapidKey: VAPID_KEY 
      });
      
      if (token) {
        console.log('FCM 토큰 :', token);
        Cookies.set(FCM_TOKEN_KEY, token, { path: '/' });
        await sendTokenToServer(userId, token);
        return token;
      } else {
        console.warn('토큰을 가져올 수 없습니다.');
        return null;
      }
    } else {
      console.warn(`알림 권한 거부됨`);
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const sendTokenToServer = async (userId, fcmToken) => {
  try {
    const response = await instance.post('/api/notification/registerToken', {
      user_id: userId,
      fcm_token: fcmToken
    });
    console.log('서버에 토큰이 전달됨', response.data);
    return response.data;
  } catch (error) {
    console.error('토큰을 서버에 전달하지 못함', error);
    throw error;
  }
};

// 포그라운드 메시지 수신 처리
export const onForegroundMessage = (callback) => {
  if (!messaging) {
    console.log("메세지가 초기화되지 않음");
    return () => {}; 
  }

  return onMessage(messaging, (payload) => {
    console.log('메세지가 전달됨', payload);
    
    if (payload.notification) {
      const { title, body } = payload.notification;
      
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: body,
          icon: '/logo192.png', // 나중에 앱 아이콘으로 교체
          data: payload.data
        });
      }
      
      if (callback) {
        callback(payload);
      }
    }
  });
};