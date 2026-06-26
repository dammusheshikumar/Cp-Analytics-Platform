// src/components/layout/PageLayout.jsx


import Navbar from './Navbar';

export default function PageLayout({ children }) {
  return (
    <div className="page-layout">
      <Navbar />
      <main className="page-content">{children}</main>
    </div>
  );
}
