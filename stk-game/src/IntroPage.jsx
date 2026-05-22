import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import avatarImg from './assets/Avatar.png';

const introText = "Bienvenue dans l'expérience STK CyanoFold! Prêt à explorer les fondamentaux du design durable ?";

const rules = [
  { num: "01", text: "Retrouvez les paires de concepts liés à l'architecture bioclimatique." },
  { num: "02", text: "Cliquez sur deux cartes. Si elles correspondent, une explication apparaît." },
  { num: "03", text: "Trouvez toutes les paires pour compléter l'écosystème." },
];

export default function IntroPage({ onStartGame, onBack }) {
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [textDone, setTextDone] = useState(false);

  // Machine à écrire pour chaque règle — une par une
  const [ruleTexts, setRuleTexts] = useState(['', '', '']);
  const [ruleIndices, setRuleIndices] = useState([0, 0, 0]);
  const [currentRule, setCurrentRule] = useState(0);
  const [allRulesDone, setAllRulesDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 600);
    return () => clearTimeout(t);
  }, []);

  // Typewriter — texte intro
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
    }
  }, [charIndex, showBubble]);

  // Typewriter — règles une par une
  useEffect(() => {
    if (!showRules || currentRule >= rules.length) return;
    const ruleText = rules[currentRule].text;
    const idx = ruleIndices[currentRule];
    if (idx < ruleText.length) {
      const t = setTimeout(() => {
        setRuleTexts(prev => {
          const next = [...prev];
          next[currentRule] = ruleText.slice(0, idx + 1);
          return next;
        });
        setRuleIndices(prev => {
          const next = [...prev];
          next[currentRule] = idx + 1;
          return next;
        });
      }, 22);
      return () => clearTimeout(t);
    } else {
      // Cette règle est finie → attendre un peu puis passer à la suivante
      if (currentRule < rules.length - 1) {
        const t = setTimeout(() => setCurrentRule(c => c + 1), 250);
        return () => clearTimeout(t);
      } else {
        setAllRulesDone(true);
      }
    }
  }, [showRules, currentRule, ruleIndices]);

  return (
    <div className="intro-container">

      {/* ── GAUCHE : Avatar grand ── */}
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

      {/* ── DROITE : Bulle géante ── */}
      <div className="intro-bubble-side">
        <AnimatePresence>
          {showBubble && (
            <motion.div
              className="speech-bubble"
              initial={{ opacity: 0, scale: 0.85, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'backOut' }}
            >
              {/* Queue nuage vers l'avatar */}
              <span className="cloud-dot cloud-dot-1" />
              <span className="cloud-dot cloud-dot-2" />
              <span className="cloud-dot cloud-dot-3" />

              {/* Badge */}
              <motion.div
                className="intro-badge"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                Jeu pédagogique
              </motion.div>

              {/* Texte intro animé */}
              <p className="bubble-text">
                {displayedText}
                {!textDone && <span className="bubble-cursor">|</span>}
              </p>

              {/* Bouton "Comment ça marche ?" */}
              <AnimatePresence>
                {textDone && !showRules && (
                  <motion.button
                    className="bubble-btn-howto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.35 }}
                    onClick={() => setShowRules(true)}
                  >
                    Comment ça marche ? →
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Règles — typewriter une par une */}
              <AnimatePresence>
                {showRules && (
                  <motion.div
                    className="bubble-rules"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {rules.map((r, i) => (
                      <motion.div
                        key={r.num}
                        className="bubble-rule"
                        initial={{ opacity: 0, x: 12 }}
                        animate={currentRule >= i ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
                        transition={{ duration: 0.35 }}
                      >
                        <span className="bubble-rule-num">{r.num}</span>
                        <p>
                          {ruleTexts[i]}
                          {/* curseur clignotant sur la règle en cours */}
                          {currentRule === i && !allRulesDone && ruleIndices[i] <= r.text.length && (
                            <span className="bubble-cursor">|</span>
                          )}
                        </p>
                      </motion.div>
                    ))}

                    {/* Boutons d'action — apparaissent quand tout est écrit */}
                    <AnimatePresence>
                      {allRulesDone && (
                        <motion.div
                          className="bubble-actions"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                          <button className="bubble-btn" onClick={onStartGame}>
                            Commencer à jouer
                          </button>
                          <button className="bubble-btn-back" onClick={onBack}>
                            ← Retour
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