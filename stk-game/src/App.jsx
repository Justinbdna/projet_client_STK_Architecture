import cardsData from './data/cards.json';
import './App.css';
import Card from './Card.jsx';
import { useState, useRef, useEffect } from 'react';
import logoSTK from './assets/logo-stk-architecture.jpg';
import { motion } from 'framer-motion';import effetdessin from './assets/effetdessin.png'; 
import natureSound from './assets/Bird_sounds.mp3';
import successSound from './assets/succes.mp3';
import errorSound from './assets/echec.mp3';


export default function App() {
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]); 
  const [modalText, setModalText] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);
  useEffect(() => {
    if (audioRef.current) isMuted ? audioRef.current.pause() : audioRef.current.play();
  }, [isMuted]);
// Fonction pour mélanger les cartes de manière aléatoire (Algorithme de Fisher-Yates)
  const shuffleCards = (cardsArray) => {
    return [...cardsArray].sort(() => Math.random() - 0.5);
  };

  const handleCardClick = (clickedCard) => {
    if (matchedPairs.includes(clickedCard.pairId) || 
        selectedCards.some(c => c.id === clickedCard.id) || 
        selectedCards.length === 2) return;

    const newSelection = [...selectedCards, clickedCard];
    setSelectedCards(newSelection);

    if (newSelection.length === 2) {
      const [first, second] = newSelection;
      if (first.pairId === second.pairId) {
        setMatchedPairs([...matchedPairs, first.pairId]);
        setModalText(first.explanation);
      } else {
        setTimeout(() => setSelectedCards([]), 1000);
      }
    }
  };

  const isVictory = matchedPairs.length > 0 && matchedPairs.length === cardsData.length / 2;

  return (
    <div className="app-container">
      <header className="stk-header">
        <img src={logoSTK} alt="STK Logo" className="stk-logo" onClick={() => setGameStarted(false)} style={{ cursor: 'pointer' }} />
        <button className="stk-audio-toggle" onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? "🔇 Audio Off" : "🔊 Audio On"}
        </button>
        <audio ref={audioRef} src={natureSound} loop />
      </header>

      {!gameStarted ? (
        <div className="stk-hero-section">
          <motion.h1 className="stk-hero-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="stk-serif">Architecture</span><br/>bioclimatique<br/>& <span className="stk-serif">écologique</span><br/><span className="stk-serif">par le jeu</span>
          </motion.h1>
          <button className="stk-button-hero-large" onClick={() => { setGameStarted(true); setShuffledCards(shuffleCards(cardsData)); }}>Découvrir l'expérience</button>
          
          {/* 2. AJOUTE L'IMAGE ICI JUSTE EN DESSOUS DU BOUTON : */}
          <div className="stk-hero-image-container">
            <img src={effetdessin} alt="Architecture éco-responsable" className="stk-hero-image" />
          </div>
        </div>
      ) : isVictory ? (
        <div className="stk-hero-section">
          <h1 className="stk-hero-title"><span className="stk-serif">Félicitations</span><br/>Écosystème complété.</h1>
          <button className="stk-button-hero-large" onClick={() => { setGameStarted(false); setMatchedPairs([]); }}>Retourner à l'accueil</button>
        </div>
      ) : (
        <main className="stk-board">
          <div className="stk-side">{shuffledCards.filter(c => c.type === 'archi').map((c, i) => (<Card key={c.id} card={c} onClick={handleCardClick} isSelected={selectedCards.some(s => s.id === c.id)} isMatched={matchedPairs.includes(c.pairId)} index={i} />))}</div>
          <div className="stk-side">{shuffledCards.filter(c => c.type === 'nature').map((c, i) => (<Card key={c.id} card={c} onClick={handleCardClick} isSelected={selectedCards.some(s => s.id === c.id)} isMatched={matchedPairs.includes(c.pairId)} index={i} />))}</div>
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