export default function Footer() {
  return (
    <footer className="footer">
      <p>© 2026 Competitive Programming Analytics Platform</p>
      <p>Designed & Developed by Dammu Sheshi Kumar</p>

      <div className="footer-links">
        <a
          href="https://www.linkedin.com/in/dammusheshikumar"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>

        {" | "}

        <a
          href="https://leetcode.com/u/dammu_sheshikumar/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LeetCode
        </a>
      </div>
    </footer>
  );
}