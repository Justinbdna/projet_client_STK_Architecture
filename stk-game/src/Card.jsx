import { motion } from 'framer-motion';
export default function Card({ card, onClick, isSelected, isMatched, index }) {
  // On ajoute une classe 'matched' si la paire est trouvée
  const classes = `stk-card ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''}`;
  
  return (
   <motion.button 
      className={classes} onClick={() => onClick(card)} disabled={isMatched}
      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: index * 0.05 }}
      style={{ border: 'none', background: 'transparent', padding: 0 }}
    >
      <div className="stk-card-inner">
        <div className="stk-card-front">
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '2rem', color: '#222121' }}>STK</span>
        </div>
        <div className="stk-card-back">
          <img src="" alt={card.name} style={{ width: '80%', height: 'auto', marginBottom: '10px' }} />
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'center' }}>
            {card.name}
          </span>
        </div>
      </div>
    </motion.button>
  );
}