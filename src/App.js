import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./store/layout/Layout";
import Membership from "./store/dashboard/Membership";
import SubscriptionPlans from "./store/subscription/SubscriptionPlans";
import Login from "./store/login/Login";
import ProductManage from "./store/product/ProductManage";
import OrderStatic from "./store/order/OrderStatic";
import OrderList from "./store/order/OrderList";
import Review from "./store/review/Review";
import EmployeeManage from "./store/employee/EmployeeManage";
import NoticeDetail from "./store/customerservice/NoticeDetail";
import Notices from "./store/customerservice/Notices";
import Questions from "./store/customerservice/Questions";
import MyPage from "./store/dashboard/MyPage";
import MyPageEdit from "./store/dashboard/MyPageEdit";
import Sale from "./store/sale/Sale";
import SaleHistory from "./store/sale/SaleHistory";
import Negotiation from "./store/order/Negotiation";
import NegotiationHistory from "./store/order/NegotiationHistory";
import RegisterStep from "./store/register/RegisterStep";
import MembershipChange from "./store/dashboard/MembershipChange";
import AdminLayout from "./admin/layout/Layout";
import AdminMain from "./admin/main/AdminMain";
import AdminProduct from "./admin/product/AdminProduct";
import AdminCust from "./admin/user/AdminCust";
import AdminStore from "./admin/user/AdminStoreInfo";
import AdminRegion from "./admin/static/AdminRegion";
import AdminPlan from "./admin/static/AdminPlan";
import AdminCategory from "./admin/static/AdminCategory";
import AdminReview from "./admin/review/AdminReview";
import AdminEmp from "./admin/employee/AdminEmp";
import AdminAlarm from "./admin/alarm/AdminAlarm";
import AdminPush from "./admin/alarm/AdminPush";
import AdminNotice from "./admin/cs/AdminNotice";
import AdminQuestion from "./admin/cs/AdminQuestion";
import AdminReport from "./admin/cs/AdminReport";
import AdminAccept from "./admin/system/AdminAccept";
import CategoryManage from "./admin/system/CategoryManage";
import AuthManage from "./admin/system/AuthManage";
import AdminLogin from "./admin/login/AdminLogin";
import FaqPage from "./store/customerservice/FaqPage";
import { useEffect } from "react";
import apiClient from "./utils/apiClient";
import AdminReportedReview from "./admin/review/AdminReportedReview";
import AdminPayout from "./admin/payout/AdminPayout";
import AdminPayoutCompleted from "./admin/payout/AdminPayoutCompleted";

// React Query Client 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000, // 30초
    },
  },
});

function App() {
  // 페이지 로드 시 사용자(가맹점 또는 관리자)가 로그인되어 있으면 토큰 갱신 시작
  useEffect(() => {
    const user = localStorage.getItem("user");
    const admin = localStorage.getItem("admin");
    
    if (user || admin) {
      apiClient.startTokenRefresh();
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      apiClient.stopTokenRefresh();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
        <Routes>
          {/* 로그인/회원가입 */}
          <Route path="/store/login" element={<Login />} />
          <Route path="/store/register" element={<RegisterStep />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* 기본 경로 리다이렉트 */}
          <Route path="/" element={<Navigate to="/store/login" replace />} />
          {/* 스토어 관리자 - 보호된 경로 */}
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/store/plan" element={<SubscriptionPlans />} />
            <Route path="/store/dashboard" element={<Membership />} />
            <Route path="/store/product" element={<ProductManage />} />
            <Route path="/store/orderstatic" element={<OrderStatic />} />
            <Route path="/store/orderlist" element={<OrderList />} />
            <Route path="/store/review" element={<Review />} />
            <Route path="/store/employeemanage" element={<EmployeeManage />} />
            <Route path="/store/notices" element={<Notices />} />
            <Route path="/store/questions" element={<Questions />} />
            <Route path="/store/notice/:id" element={<NoticeDetail />} />
            <Route path="/store/sale" element={<Sale />} />
            <Route path="/store/sale/history" element={<SaleHistory />} />
            <Route path="/store/mypage" element={<MyPage />} />
            <Route path="/store/edit" element={<MyPageEdit />} />
            <Route path="/store/negotiation" element={<Negotiation />} />
            <Route path="/store/negotiation/history" element={<NegotiationHistory />} />
            <Route path="/store/faq" element={<FaqPage />} />
            <Route
              path="/store/membership-change"
              element={<MembershipChange />}
            />
          </Route>
          <Route
            element={
              <AdminPrivateRoute>
                <AdminLayout />
              </AdminPrivateRoute>
            }
          >
            <Route path="/admin" element={<AdminMain />} />
            <Route path="/admin/product" element={<AdminProduct />} />
            <Route path="/admin/cust" element={<AdminCust />} />
            <Route path="/admin/store" element={<AdminStore />} />
            <Route path="/admin/region" element={<AdminRegion />} />
            <Route path="/admin/plan" element={<AdminPlan />} />
            <Route path="/admin/category" element={<AdminCategory />} />
            <Route path="/admin/review" element={<AdminReview />} />
            <Route path="/admin/review/reported" element={<AdminReportedReview />} />
            <Route path="/admin/emp" element={<AdminEmp />} />
            <Route path="/admin/alarm" element={<AdminAlarm />} />
            <Route path="/admin/push" element={<AdminPush />} />
            <Route path="/admin/notice" element={<AdminNotice />} />
            <Route path="/admin/question" element={<AdminQuestion />} />
            <Route path="/admin/report" element={<AdminReport />} />
            <Route path="/admin/accept" element={<AdminAccept />} />
            <Route path="/admin/categorymanage" element={<CategoryManage />} />
            <Route path="/admin/authmanage" element={<AuthManage />} />
            <Route path="/admin/payout" element={<AdminPayout />} />
            <Route path="/admin/payout/completed" element={<AdminPayoutCompleted />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
    </QueryClientProvider>
  );
}
export default App;