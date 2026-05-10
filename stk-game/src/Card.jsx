import { motion } from 'framer-motion';
export default function Card({ card, onClick, isSelected, isMatched }) {
  // On ajoute une classe 'matched' si la paire est trouvée
  const classes = `stk-card ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''}`;
  
  return (
    <motion.button 
      className={classes} onClick={() => onClick(card)} disabled={isMatched}
      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
    >
      <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
        {card.name}
      </span>
    </motion.button>
  );
}