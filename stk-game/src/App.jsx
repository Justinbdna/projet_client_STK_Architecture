import cardsData from './data/cards.json';
import './App.css';
import Card from './Card.jsx';
import { useState } from 'react';

export default function App() {
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]); // Mémoire des succès

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
        setSelectedCards([]);
      } else {
        // ERREUR : On vide après un court délai
        setTimeout(() => setSelectedCards([]), 1000);
      }
    }
  };
  return (
    <main className="stk-board">
      {cardsData.map((card) => (
        <Card 
          key={card.id} 
          card={card} 
          onClick={handleCardClick} 
          isSelected={selectedCards.some((c) => c.id === card.id)} 
          isMatched={matchedPairs.includes(card.pairId)} // Nouvelle info
        />
      ))}
    </main>
  );
}