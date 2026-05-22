import { motion } from 'framer-motion';
export default function Card({ card, onClick, isSelected, isMatched, isHinted, index }) {
  // On ajoute une classe 'matched' si la paire est trouvée, et 'hinted' pour l'indice
  const classes = `stk-card ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''} ${isHinted ? 'hinted' : ''}`;
  
  return (
  <motion.button className={classes} onClick={() => onClick(card)} disabled={isMatched} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: index * 0.05 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', gridRow: card.type === 'nature' ? 1 : 2 }}>
     {card.image ? (
        <img src={card.image} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
      ) : (
        <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1rem', fontWeight: '600', padding: '15px', color: isMatched ? 'white' : '#222121' }}>{card.name}</span>
      )}
  </motion.button>
  );
}