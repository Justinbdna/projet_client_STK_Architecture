export default function Card({ card, onClick, isSelected }) {
  return (
    <button className={`stk-card ${isSelected ? 'selected' : ''}`} onClick={() => onClick(card)}>
      {card.name}
    </button>
  );
}