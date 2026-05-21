import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import './EndPage.css';
import avatarImg from './assets/Avatar.png';

export default function EndPage({ finalTime, turns, onRestart, onHome }) {
  const introText = "Félicitations ! Vous avez brillamment complété l'écosystème.";
  const handleShare = async () => {
    // Note : On met (hintsUsed || 0) au cas où la valeur serait indéfinie
    const shareText = `J'ai terminé le jeu STK Architecture en ${finalTime} secondes avec seulement ${hintsUsed || 0} indice(s) utilisé(s) ! 🌿 Peux-tu faire mieux ?`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mon score STK Architecture',
          text: shareText,
        });
      } catch (error) {
        console.log('Partage annulé ou échoué', error);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Ton score a été copié dans le presse-papier ! Tu peux le coller sur tes réseaux sociaux.");
    }
  };
  
  const stats = [
    { num: "⏱", text: `Temps total : ${finalTime} secondes.` },
    { num: "🎯", text: `Manches utilisées : ${turns} / 22.` }
  ];

  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [textDone, setTextDone] = useState(false);

  // Machine à écrire pour les statistiques
  const [statTexts, setStatTexts] = useState(['', '']);
  const [statIndices, setStatIndices] = useState([0, 0]);
  const [currentStat, setCurrentStat] = useState(0);
  const [allStatsDone, setAllStatsDone] = useState(false);

  // Apparition de la bulle
  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 600);
    return () => clearTimeout(t);
  }, []);

  // Animation du texte d'introduction
  useEffect(() => {
    if (!showBubble) return;
    if (charIndex < introText.length) {
      const t = setTimeout(() => {
        setDisplayedText(introText.slice(0, charIndex + 1));
        setCharIndex(c => c + 1);
      }, 30);
      return () => clearTimeout(t);
    } else {
      setTextDone(true);
      // On lance les statistiques peu après la fin du texte principal
      const tStats = setTimeout(() => setShowStats(true), 400); 
      return () => clearTimeout(tStats);
    }
  }, [charIndex, showBubble]);

  // Animation des statistiques une par une
  useEffect(() => {
    if (!showStats || currentStat >= stats.length) return;
    const statText = stats[currentStat].text;
    const idx = statIndices[currentStat];
    if (idx < statText.length) {
      const t = setTimeout(() => {
        setStatTexts(prev => {
          const next = [...prev];
          next[currentStat] = statText.slice(0, idx + 1);
          return next;
        });
        setStatIndices(prev => {
          const next = [...prev];
          next[currentStat] = idx + 1;
          return next;
        });
      }, 22);
      return () => clearTimeout(t);
    } else {
      if (currentStat < stats.length - 1) {
        const t = setTimeout(() => setCurrentStat(c => c + 1), 250);
        return () => clearTimeout(t);
      } else {
        setAllStatsDone(true);
      }
    }
  }, [showStats, currentStat, statIndices]);

  return (
    <div className="intro-container">

      {/* ── GAUCHE : Avatar ── */}
      <motion.div
        className="intro-avatar-zone"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
      >
        <div className="avatar-wrapper">
          <img src={avatarImg} alt="Avatar STK" className="avatar-img" />
        </div>
      </motion.div>

      {/* ── DROITE : Bulle ── */}
      <div className="intro-bubble-side">
        <AnimatePresence>
          {showBubble && (
            <motion.div
              className="speech-bubble"
              initial={{ opacity: 0, scale: 0.85, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'backOut' }}
            >
              <span className="cloud-dot cloud-dot-1" />
              <span className="cloud-dot cloud-dot-2" />
              <span className="cloud-dot cloud-dot-3" />

              {/* Badge doré pour la victoire */}
              <motion.div
                className="intro-badge"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                style={{ background: '#d4af37', color: '#222121' }} 
              >
                Victoire
              </motion.div>

              <p className="bubble-text">
                {displayedText}
                {!textDone && <span className="bubble-cursor">|</span>}
              </p>

              <AnimatePresence>
                {showStats && (
                  <motion.div
                    className="bubble-rules"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {stats.map((s, i) => (
                      <motion.div
                        key={s.num}
                        className="bubble-rule"
                        initial={{ opacity: 0, x: 12 }}
                        animate={currentStat >= i ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
                        transition={{ duration: 0.35 }}
                      >
                        <span className="bubble-rule-num" style={{ fontSize: '1.4rem', paddingTop: '4px' }}>{s.num}</span>
                        <p>
                          {statTexts[i]}
                          {currentStat === i && !allStatsDone && statIndices[i] <= s.text.length && (
                            <span className="bubble-cursor">|</span>
                          )}
                        </p>
                      </motion.div>
                    ))}

                    {/* Boutons de fin */}
                    <AnimatePresence>
                      {allStatsDone && (
                        <motion.div
                          className="bubble-actions"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                          <button className="bubble-btn-start" onClick={onRestart}>
                            Rejouer
                          </button>
                          
                          <button className="bubble-btn-start" onClick={handleShare} style={{ backgroundColor: '#2c4c3b' }}>
                            📱 Partager
                          </button>
                          
                          <button className="bubble-btn-back" onClick={onHome}>
                            Accueil
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}