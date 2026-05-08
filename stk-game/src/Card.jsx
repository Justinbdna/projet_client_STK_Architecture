export default function Card({ card, onClick }) {
  return (
    <button className="stk-card" onClick={() => onClick(card)}>
      {card.name}
    </button>
  );
}