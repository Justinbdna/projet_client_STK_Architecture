import cardsData from './data/cards.json';
import './App.css';
import Card from './Card.jsx';
import { useState } from 'react';

export default function App() {
  const [selectedCards, setSelectedCards] = useState([]);

  const handleCardClick = (clickedCard) => {
    // Empêcher de cliquer sur la même carte deux fois ou si 2 cartes sont déjà sélectionnées
    if (selectedCards.length === 2 || selectedCards.some((c) => c.id === clickedCard.id)) return;

    const newSelection = [...selectedCards, clickedCard];
    setSelectedCards(newSelection);

    if (newSelection.length === 2) {
      const [firstCard, secondCard] = newSelection;

      if (firstCard.pairId === secondCard.pairId) {
        console.log("SUCCÈS ! Lien biomimétique trouvé :", firstCard.pairId);
        // Ici on déclenchera la modale pédagogique plus tard
        setTimeout(() => setSelectedCards([]), 1000); // Réinitialise pour l'instant
      } else {
        console.log("ERREUR ! Aucun lien.");
        // Ici on jouera le son d'erreur plus tard
        setTimeout(() => setSelectedCards([]), 1000); // Réinitialise la sélection après 1s
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
          />
      ))}
    </main>
  );
}