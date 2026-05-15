import { motion } from 'framer-motion';
export default function Card({ card, onClick, isSelected, isMatched, index }) {
  // On ajoute une classe 'matched' si la paire est trouvée
  const classes = `stk-card ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''}`;
  
  return (
    <motion.button 
      className={classes} onClick={() => onClick(card)} disabled={isMatched}
      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
        {card.name}
      </span>
    </motion.button>
  );
}