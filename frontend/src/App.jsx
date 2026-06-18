import { Outlet, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import BoatDetailsPage from "./pages/BoatDetailsPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MarinaDetailsPage from "./pages/MarinaDetailsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import MyMarinasPage from "./pages/MyMarinasPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";

function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/boats/:boatId" element={<BoatDetailsPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/cancel" element={<PaymentCancelPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/marinas" element={<MyMarinasPage />} />
            <Route path="/marinas/:slug" element={<MarinaDetailsPage />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} newestOnTop theme="light" />
    </>
  );
}
