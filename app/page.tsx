import { useEffect, useState } from "react";
import EletjatekSzimulator from "@/app/EletjatekSzimulator";

const ROWS = 20;
const COLS = 20;

export default function App() {
  const [game] = useState(
    new EletjatekSzimulator(ROWS, COLS)
  );

  const [, forceUpdate] = useState(0);

  const [currentPlayer, setCurrentPlayer] =
    useState(1);

  const [running, setRunning] = useState(false);

  const [winner, setWinner] = useState("");

  const refresh = () => {
    forceUpdate((v) => v + 1);
  };

  const placeCell = (r: number, c: number) => {
    if (running) return;

    const current =
      game.matrix.getCell(r, c).getValue();

    if (current === 0) {
      game.matrix.setCell(
        r,
        c,
        currentPlayer
      );

      setCurrentPlayer(
        currentPlayer === 1 ? 2 : 1
      );

      refresh();
    }
  };  

  useEffect(() => { 
    if (!running) return; 

    const interval = setIn  terval(() => {
      game.nextGeneration();

      const counts = game.countPlayers();

      if (counts.p1 === 0 || counts.p2 === 0) {
        setRunning(false);

        if (counts.p1 > counts.p2) {
          setWinner("Játékos 1 nyert!");
        } else if (counts.p2 > counts.p1) {
          setWinner("Játékos 2 nyert!");
        } else {
          setWinner("Döntetlen!");
        }
      }

      refresh();
    }, 300);

    return () => clearInterval(interval);
  }, [running]);

  return (
    <div
      className="flex flex-col"
    >
      <h1>Kétjátékos Életjáték</h1>

      <h2>
        Aktuális játékos:
        {currentPlayer}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 25px)`,
        }}
      >
        {game.matrix
          .getRows()
          .map((row, r) =>
            row
              .getColumns()
              .map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  onClick={() =>
                    placeCell(r, c)
                  }
                  style={{
                    width: 25,
                    height: 25,
                    border:
                      "1px solid black",
                    background:
                      cell.getValue() === 1
                        ? "red"
                        : cell.getValue() === 2
                        ? "blue"
                        : "white",
                  }}
                />
              ))
          )}
      </div>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => setRunning(true)}
        >
          Start
        </button>

        <button
          onClick={() => setRunning(false)}
        >
          Stop
        </button>
      </div>

      <h2>{winner}</h2>
    </div>
  );
}
