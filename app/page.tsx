"use client";

import { useEffect, useState } from "react";
import EletjatekSzimulator from "@/app/EletjatekSzimulator";

export default function App() {
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(20);

  const [game, setGame] = useState(
    () => new EletjatekSzimulator(20, 20)
  );

  const [, forceUpdate] = useState(0);

  const [currentPlayer, setCurrentPlayer] =
    useState<number>(1);

  const [running, setRunning] =
    useState<boolean>(false);

  const [winner, setWinner] =
    useState<string>("");

  const refresh = () => {
    forceUpdate((v) => v + 1);
  };

  const createNewGame = () => {
    const newGame =
      new EletjatekSzimulator(rows, cols);

    setGame(newGame);
    setWinner("");
    setRunning(false);
    setCurrentPlayer(1);

    refresh();
  };

  const placeCell = (r: number, c: number) => {
    if (running) return;

    const current = game.getCell(r, c);

    if (current === 0) {
      game.setCell(r, c, currentPlayer);

      setCurrentPlayer((prev) =>
        prev === 1 ? 2 : 1
      );

      refresh();
    }
  };

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      refresh();
    }, 300);

    return () => clearInterval(interval);
  }, [running]);

  return (
    <div className="min-h-screen flex flex-col items-center gap-4 p-4 bg-gradient-to-b from-purple-500 to-white">
      <h1 className="text-3xl font-bold">
        Kétjátékos Életjáték
      </h1>

      <div className="flex gap-4 items-center">
        <div className="flex flex-col items-center">
          <label>Sorok</label>

          <input
            type="number"
            value={rows}
            min={5}
            max={50}
            onChange={(e) =>
              setRows(Number(e.target.value))
            }
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col items-center">
          <label>Oszlopok</label>

          <input
            type="number"
            value={cols}
            min={5}
            max={50}
            onChange={(e) =>
              setCols(Number(e.target.value))
            }
            className="border p-2 rounded"
          />
        </div>

        <button
          onClick={createNewGame}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg mt-5"
        >
          Új pálya
        </button>
      </div>

      <h2 className="text-xl">
        Aktuális játékos: {currentPlayer}
      </h2>

      <div
        className="border rounded-2xl p-2 shadow-xl bg-gradient-to-br from-purple-300 to-white"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 25px)`,
        }}
      >
        {game.getRows().map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => placeCell(r, c)}
              style={{
                width: 25,
                height: 25,
                border: "1px solid black",
                borderRadius: 6,
                background:
                  cell === 1
                    ? "linear-gradient(to bottom right, #ff4d4d, #990000)"
                    : cell === 2
                    ? "linear-gradient(to bottom right, #4da6ff, #003d99)"
                    : "linear-gradient(to bottom right, #f3e8ff, white)",
                cursor: "pointer",
              }}
            />
          ))
        )}
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => setRunning(true)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Start
        </button>

        <button
          onClick={() => setRunning(false)}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Stop
        </button>
      </div>

      <h2 className="text-2xl font-bold">
        {winner}
      </h2>
    </div>
  );
}