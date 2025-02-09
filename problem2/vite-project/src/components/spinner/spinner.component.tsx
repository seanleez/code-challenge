import './spinner.style.css';

export const Spinner: React.FC = () => {
  return (
    <div className="spinner-container">
      <div className="spinner-border text-warning" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
