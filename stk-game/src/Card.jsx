export default function Card({ card, onClick, isSelected, isMatched }) {
  // On ajoute une classe 'matched' si la paire est trouvée
  const classes = `stk-card ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''}`;
  
  return (
    <button className={classes} onClick={() => onClick(card)} disabled={isMatched}>
      <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
        {card.name}
      </span>
    </button>
  );
}