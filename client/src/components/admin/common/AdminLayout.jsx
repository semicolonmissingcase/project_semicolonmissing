import { Outlet } from "react-router-dom";
import AdminNav from "./AdminNav.jsx";
import "./AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminNav />
      <main className="admin-layout-content">
        <Outlet />
      </main>
    </div>
  );
}