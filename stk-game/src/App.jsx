import cardsData from './data/cards.json';
import './App.css';
import Card from './Card.jsx';
import { useState } from 'react';
import logoSTK from './assets/logo-stk-architecture.jpg';
import { motion } from 'framer-motion';


export default function App() {
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]); // Mémoire des succès
  const [modalText, setModalText] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [shuffledCards, setShuffledCards] = useState([]);
// Fonction pour mélanger les cartes de manière aléatoire (Algorithme de Fisher-Yates)
  const shuffleCards = (cardsArray) => {
    return [...cardsArray].sort(() => Math.random() - 0.5);
  };

  const handleCardClick = (clickedCard) => {
    // Bloquer si la carte est déjà trouvée, déjà sélectionnée, ou si 2 sont déjà en cours
    if (matchedPairs.includes(clickedCard.pairId) || 
        selectedCards.some(c => c.id === clickedCard.id) || 
        selectedCards.length === 2) return;

    const newSelection = [...selectedCards, clickedCard];
    setSelectedCards(newSelection);

    if (newSelection.length === 2) {
      const [first, second] = newSelection;
      if (first.pairId === second.pairId) {
        // SUCCÈS : On ajoute la paire à la mémoire
        setMatchedPairs([...matchedPairs, first.pairId]);
        setModalText(first.explanation);
      } else {
        // ERREUR : On vide après un court délai
        setTimeout(() => setSelectedCards([]), 1000);
      }
    }
  };
  return (
    <div className="app-container">
      <header className="stk-header">
        <img src={logoSTK} alt="STK Logo" className="stk-logo" onClick={() => setGameStarted(false)} style={{ cursor: 'pointer' }} />
      </header>

      {!gameStarted ? (
        <div className="stk-hero-section">
          <motion.h1 className="stk-hero-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="stk-serif">Architecture</span><br/>bioclimatique<br/>& <span className="stk-serif">écologique</span><br/><span className="stk-serif">par le jeu</span>
          </motion.h1>
          <button className="stk-button-hero-large" onClick={() => { setGameStarted(true); setShuffledCards(shuffleCards(cardsData)); }}>Découvrir l'expérience</button>
        </div>
      ) : (
        <main className="stk-board">
          {shuffledCards.map((card) => (
            <Card key={card.id} card={card} onClick={handleCardClick} isSelected={selectedCards.some((c) => c.id === card.id)} isMatched={matchedPairs.includes(card.pairId)} />
          ))}
        </main>
      )}
      {modalText && (
        <div className="stk-modal-overlay">
          <div className="stk-modal-content">
            <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>{modalText}</p>
            <button className="stk-button" onClick={() => { setModalText(null); setSelectedCards([]); }}>Continuer</button>
          </div>
        </div>
      )}
    </div>
  );
}