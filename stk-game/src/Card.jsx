import { motion } from 'framer-motion';
export default function Card({ card, onClick, isSelected, isMatched, isHinted, index }) {
  // On ajoute une classe 'matched' si la paire est trouvée, et 'hinted' pour l'indice
  const classes = `stk-card ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''} ${isHinted ? 'hinted' : ''}`;
  
  return (
  <motion.button className={classes} onClick={() => onClick(card)} disabled={isMatched} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: index * 0.05 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
     {card.image ? <img src={card.image} alt="" aria-hidden="true" /> : null}
      <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'center', color: isMatched ? 'white' : 'inherit' }}>{card.name}</span>
    </motion.button>
  );
}