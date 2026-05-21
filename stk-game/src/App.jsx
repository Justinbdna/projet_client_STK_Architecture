import cardsData from './data/cards.json';
import './App.css';
import Card from './Card.jsx';
import IntroPage from './IntroPage.jsx';   // ← AJOUT : importer la nouvelle page 
import logoSTK from './assets/logo-stk-architecture.jpg';
import natureSound from './assets/Bird_sounds.mp3';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import effetdessin from './assets/effetdessin.png';


export default function App() {
  // ── MODIFIÉ : on remplace gameStarted (boolean) par page (string) ──
  // 3 valeurs possibles : "home" | "intro" | "game"
  const [page, setPage] = useState("home");

  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]); // Mémoire des succès
  const [modalText, setModalText] = useState(null);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const [turns, setTurns] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [finalTime, setFinalTime] = useState(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      isMuted ? audioRef.current.pause() : audioRef.current.play();
    }
  }, [isMuted]);

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
      setTurns(prev => prev + 1);
      
      if (first.pairId === second.pairId) {
        setMatchedPairs([...matchedPairs, first.pairId]);
        setModalText(first.explanation);
        if (matchedPairs.length + 1 === cardsData.length / 2) {
          setFinalTime(Math.floor((Date.now() - startTime) / 1000));
        }
      } else {
        setTimeout(() => setSelectedCards([]), 1000);
      }
    }
  };
  // Vérifie si toutes les paires ont été trouvées
  const isVictory = matchedPairs.length > 0 && matchedPairs.length === cardsData.length / 2;
  return (
    <div className="app-container">
     <header className="stk-header">
        <img
          src={logoSTK}
          alt="STK Logo"
          className="stk-logo"
          onClick={() => {
            setPage("home");
            setMatchedPairs([]);
            setSelectedCards([]);
          }}
          style={{ cursor: 'pointer' }}
        />
        <button className="stk-audio-toggle" onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? "🔇 Audio Off" : "🔊 Audio On"}
        </button>
        <audio ref={audioRef} src={natureSound} loop />
      </header>

      {/* ════════════════════════════════════════
          PAGE 1 — Accueil (inchangée)
          ════════════════════════════════════════ */}
      {page === "home" ? (
        <div className="stk-hero-section">
          <motion.h1
            className="stk-hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="stk-serif">Architecture</span><br />
            bioclimatique<br />
            & <span className="stk-serif">écologique</span><br />
            <span className="stk-serif">par le jeu</span>
          </motion.h1>
         <button className="stk-button-hero-large" onClick={() => setPage("intro")}>Découvrir l'expérience</button>
         <div className="stk-hero-image-container"><img src={effetdessin} alt="Architecture" className="stk-hero-image" /></div>
        </div>

      ) : page === "intro" ? (
        <IntroPage onStartGame={() => { setPage("game"); setShuffledCards(shuffleCards(cardsData)); setStartTime(Date.now()); setTurns(0); }} onBack={() => setPage("home")} />
      ) : isVictory ? (
        <div className="stk-hero-section">
          <h1 className="stk-hero-title"><span className="stk-serif">Félicitations</span><br/>Écosystème complété.</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Temps record : {finalTime} secondes | Manches utilisées : {turns}/22</p>
          <button className="stk-button-hero-large" onClick={() => { setPage("home"); setMatchedPairs([]); }}>Retourner à l'accueil</button>
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
            <button
              className="stk-button"
              onClick={() => {
                setModalText(null);
                setSelectedCards([]);
              }}
            >
              Continuer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}