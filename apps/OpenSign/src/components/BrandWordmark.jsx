const BrandWordmark = ({ inverse = false, compact = false }) => (
  <div
    className={`tm-wordmark ${inverse ? "tm-wordmark-inverse" : ""} ${
      compact ? "tm-wordmark-compact" : ""
    }`}
    aria-label="Techmonium Sign"
  >
    <span className="tm-wordmark-mark" aria-hidden="true">
      T
    </span>
    <span className="tm-wordmark-name">
      Techmonium <strong>Sign</strong>
    </span>
  </div>
);

export default BrandWordmark;
