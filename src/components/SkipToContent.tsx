export default function SkipToContent() {
  return (
    <>
      <style>{`
        .skip-link {
          position: absolute;
          left: -9999px;
          top: auto;
          width: 1px;
          height: 1px;
          overflow: hidden;
          z-index: 999999;
          text-decoration: none;
        }
        .skip-link:focus {
          position: fixed;
          left: 16px;
          top: 16px;
          width: auto;
          height: auto;
          padding: 12px 24px;
          background: #10a37f;
          color: white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          outline: 2px solid white;
        }
      `}</style>
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>
    </>
  );
}
