import AdminNav from "../common/AdminNav.jsx";
import "./AdminLayout.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminNav />
      <main className="admin-layout-content">
        {children}
      </main>
    </div>
  );
}