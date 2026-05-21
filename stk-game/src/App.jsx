import cardsData from './data/cards.json';
import './App.css';
import Card from './Card.jsx';
import IntroPage from './IntroPage.jsx';   // ← AJOUT : importer la nouvelle page 
import logoSTK from './assets/logo-stk-architecture.jpg';
import natureSound from './assets/Bird_sounds.mp3';
import erreurSound from './assets/erreur.mp3';
import successSound from './assets/Succes.mp3';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import image from './assets/image.png';
import EndPage from './EndPage.jsx';



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
  const successRef = useRef(null);
  const errorRef = useRef(null);
  const [turns, setTurns] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [finalTime, setFinalTime] = useState(null);
  const [currentWave, setCurrentWave] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintedCards, setHintedCards] = useState([]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      isMuted ? audioRef.current.pause() : audioRef.current.play();
    }
  }, [isMuted]);

// Fonction pour mélanger les cartes de manière aléatoire (Algorithme de Fisher-Yates)
  const generateWaves = (data) => {
    const pairs = Array.from({length: data.length/2}, (_, i) => [data[i*2], data[i*2+1]]).sort(() => Math.random() - 0.5);
    return [pairs.slice(0, 7).flat(), pairs.slice(7, 14).flat(), pairs.slice(14, 22).flat()].map(w => w.sort(() => Math.random() - 0.5));
  };
  const triggerHint = () => {
    if (selectedCards.length !== 1) return; const w = shuffledCards[currentWave];
    const m = w.find(c => c.pairId === selectedCards[0].pairId && c.id !== selectedCards[0].id);
    const d = w.filter(c => c.pairId !== selectedCards[0].pairId && !matchedPairs.includes(c.pairId)).sort(() => 0.5 - Math.random());
    setHintedCards([m.id, d[0]?.id, d[1]?.id]); setHintsUsed(h => h + 1); setTimeout(() => setHintedCards([]), 3000);
  };

  const handleCardClick = (clickedCard) => {
    if (matchedPairs.includes(clickedCard.pairId) || 
        selectedCards.some(c => c.id === clickedCard.id) || 
        selectedCards.length === 2) return;

    const newSelection = [...selectedCards, clickedCard];
    setSelectedCards(newSelection);

    if (newSelection.length === 2) {
      const [first, second] = newSelection;
      setTurns(prev => prev + 1);
      
      if (first.pairId === second.pairId) {
        // AJOUT ICI : Jouer le son de succès
        if (!isMuted && successRef.current) successRef.current.play();
        
        setMatchedPairs([...matchedPairs, first.pairId]);
        setModalText(first.explanation);
        const total = matchedPairs.length + 1;
        if (total === 7 || total === 14) setCurrentWave(w => w + 1);
        if (total === 22) setFinalTime(Math.floor((Date.now() - startTime) / 1000));
      } else {
        // AJOUT ICI : Jouer le son d'erreur
        if (!isMuted && errorRef.current) errorRef.current.play();
        
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
        
        {/* AJOUT ICI : Les balises pour les bruitages */}
        <audio ref={successRef} src={successSound} />
        <audio ref={errorRef} src={erreurSound} />
      </header>
      {/* ════════════════════════════════════════
          PAGE 1  — Accueil (inchangée)
          ════════════════════════════════════════ */}
          {/* --- DÉBUT MODE DEV --- À SUPPRIMER AVANT LA PROD */}
        <button 
         onClick={() => {
            // 1. Force le passage à l'état de jeu pour bypasser l'écran d'accueil
            setPage("game");
            
            // 2. Extrait uniquement les identifiants de paires uniques
            const allPairIds = [...new Set(cardsData.map(c => c.pairId))]; 
            setMatchedPairs(allPairIds);
            
            // 3. Simule un chrono pour éviter un affichage "null" sur l'écran de fin
            setFinalTime(120); 
          }}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#ff4444',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '8px',
            fontWeight: 'bold',
            zIndex: 9999,
            border: '2px solid darkred',
            cursor: 'pointer'
          }}
        >
          🚨 [DEV] Forcer Victoire
        </button>
        {/* --- FIN MODE DEV --- */}
        
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
        <div className="stk-hero-image-container"><img src={image} alt="Architecture" className="stk-hero-image" /></div>
        </div>
      

      ) : page === "intro" ? (
        <IntroPage onStartGame={() => { setPage("game"); setShuffledCards(generateWaves(cardsData)); setStartTime(Date.now()); setTurns(0); setCurrentWave(0); setHintsUsed(0); }} onBack={() => setPage("home")} />
      ) : isVictory ? (
        <EndPage 
          finalTime={finalTime} 
          turns={turns} 
          hintsUsed={hintsUsed}
          onRestart={() => {
            setMatchedPairs([]);
            setSelectedCards([]);
            setPage("game");
            setShuffledCards(generateWaves(cardsData));
            setStartTime(Date.now());
            setTurns(0);
            setCurrentWave(0);
            setHintsUsed(0);
          }}
          onHome={() => {
            setPage("home");
            setMatchedPairs([]);
            setSelectedCards([]);
          }}
        />
     ) : (
        <>
          <div style={{ width: '100%', textAlign: 'center', marginTop: '-60px', zIndex: 10, position: 'relative' }}>
            <button className="stk-button" onClick={triggerHint} style={{ background: '#d4af37', color: '#222121' }}>💡 Indice</button>
          </div>
          <main className="stk-board">
            {shuffledCards[currentWave]?.map((c, i) => (
              <Card key={c.id} card={c} onClick={handleCardClick} isSelected={selectedCards.some(s => s.id === c.id)} isMatched={matchedPairs.includes(c.pairId)} isHinted={hintedCards.includes(c.id)} index={i} />
            ))}
          </main>
        </>
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