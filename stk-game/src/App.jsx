import cardsData from './data/cards.json';
import './App.css';
import Card from './Card.jsx';
import { useState } from 'react';

export default function App() {
  const [selectedCards, setSelectedCards] = useState([]);

  const handleCardClick = (clickedCard) => {
    console.log("Carte sélectionnée :", clickedCard.name);
    // On ajoutera la logique de comparaison ici à la prochaine étape
  };
  return (
    <main className="stk-board">
      {cardsData.map((card) => (
        <Card key={card.id} card={card} onClick={handleCardClick} />
      ))}
    </main>
  );
}