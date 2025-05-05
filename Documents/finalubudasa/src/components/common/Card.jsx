import './card.css';

const Card = ({ title, value, color }) => {
  return (
    <div className="stat-card" style={{ borderLeft: `5px solid ${color}` }}>
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
};

export default Card;
