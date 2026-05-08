import cardsData from './data/cards.json';
import './App.css';
import Card from './Card.jsx';

export default function App() {
  return (
    <main className="stk-board">
      {cardsData.map((card) => (
        <Card key={card.id} card={card} onClick={(c) => console.log("Clic sur:", c.name)} />
      ))}
    </main>
  );
}