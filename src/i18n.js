import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          // Dashboard
          dashboard: "Dashboard",
          admindashboard: "Admin Dashboard",
          dreamGateAdminSignIn: "Dream Gate Admin Sign in",
          userlist: "User List",
          apikey: "API Key",
          logout: "Logout",
          gatePublicKey: "Gate.io Public Key",
          gateSecretKey: "Gate.io Secret Key",
          SearchHere: "Search here",
          save: "Save",
          table: "Table",
          name: "Name",
          email: "Email",
          referredBy: "Referred By",
          action: "Action",
          active: "Active",
          inactive: "Inactive",
          rememberMe: "Remember me",
          // Auth
          dreamGateSignIn: "Dream Gate Sign in",
          signupTitle: "Dream Gate Sign up",
          dontHaveAccount: "Don't have an account?",
          dreamGate: "Dream Gate",
          signUp: "Sign Up",
          signIn: "Sign In",
          password: "Password",
          confirmPassword: "Confirm Password",
          referralCode: "Referrel Code",
          termsAndConditions: "Terms and Conditions",
          alreadyHaveAccount: "Already have an account?",
          iAgree: "I agree the",
        },
      },
      ko: {
        translation: {
          // Dashboard
          dashboard: "대시보드",
          admindashboard: "관리자 대시보드",
          userlist: "사용자 목록",
          confirmPassword: "비밀번호 확인",
          referralCode: "추천 코드",
          termsAndConditions: "이용 약관",
          alreadyHaveAccount: "이미 계정이 있으신가요?",
          iAgree: "동의합니다",
          dreamGateAdminSignIn: "드림 게이트 관리자 로그인",

          apikey: "API 키",
          logout: "로그아웃",
          signupTitle: "드림 게이트 회원가입",
          gatePublicKey: "Gate.io 공개 키",
          gateSecretKey: "Gate.io 비밀 키",
          SearchHere: "여기에서 검색",
          save: "테이블",
          table: "저장",
          name: "이름",
          email: "이메일",
          referredBy: "추천인",
          action: "작업",
          active: "활성",
          inactive: "비활성",
          rememberMe: "기억하기",

          // Auth
          dreamGateSignIn: "드림 게이트 로그인",
          dreamGate: "드림 게이트",
          dontHaveAccount: "계정이 없으신가요?",
          signUp: "회원가입",
          signIn: "로그인",
          password: "비밀번호",
        },
      },
    },
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
