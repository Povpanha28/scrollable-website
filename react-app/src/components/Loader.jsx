export default function Loader({ percentage, isHidden }) {
  return (
    <div id="loader" className={isHidden ? 'hidden' : ''}>
      <div className="loader-status">Loading {percentage}%</div>
      <div className="loader-bar-bg">
        <div
          className="loader-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
