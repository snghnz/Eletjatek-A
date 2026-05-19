"use client";

import { useRef, useState } from "react";
import EletjatekSzimulator from "@/app/EletjatekSzimulator";

export default function App() {
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(20);

  const [maxCells, setMaxCells] =
    useState<number>(4);

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

  const [p1Placed, setP1Placed] =
    useState<number>(0);

  const [p2Placed, setP2Placed] =
    useState<number>(0);

  const intervalRef =
    useRef<NodeJS.Timeout | null>(null);

  const refresh = () => {
    forceUpdate((v) => v + 1);
  };

  const stopGame = () => {
    setRunning(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startGame = () => {
    if (running) return;

    if (
      p1Placed < maxCells ||
      p2Placed < maxCells
    ) {
      alert(
        "Mindkét játékosnak le kell raknia az összes sejtet!"
      );
      return;
    }

    setWinner("");
    setRunning(true);

    intervalRef.current = setInterval(() => {
      const changed =
        game.nextGeneration();

      const counts = game.countPlayers();

      if (!changed) {
        stopGame();

        if (counts.p1 > counts.p2) {
          setWinner(
            "Stabil állapot! Piros nyert!"
          );
        } else if (
          counts.p2 > counts.p1
        ) {
          setWinner(
            "Stabil állapot! Kék nyert!"
          );
        } else {
          setWinner(
            "Stabil állapot! Döntetlen!"
          );
        }

        refresh();
        return;
      }

      if (
        counts.p1 === 0 ||
        counts.p2 === 0
      ) {
        stopGame();

        if (counts.p1 > counts.p2) {
          setWinner(
            "Piros játékos nyert!"
          );
        } else if (
          counts.p2 > counts.p1
        ) {
          setWinner(
            "Kék játékos nyert!"
          );
        } else {
          setWinner("Döntetlen!");
        }
      }

      refresh();
    }, 300);
  };

  const createNewGame = () => {
    stopGame();

    const newGame =
      new EletjatekSzimulator(rows, cols);

    setGame(newGame);

    setWinner("");

    setCurrentPlayer(1);

    setP1Placed(0);

    setP2Placed(0);

    refresh();
  };

  const placeCell = (
    r: number,
    c: number
  ) => {
    if (running) return;

    const current = game.getCell(r, c);

    if (current !== 0) return;

    if (
      currentPlayer === 1 &&
      p1Placed >= maxCells
    ) {
      setCurrentPlayer(2);
      return;
    }

    if (
      currentPlayer === 2 &&
      p2Placed >= maxCells
    ) {
      setCurrentPlayer(1);
      return;
    }

    game.setCell(
      r,
      c,
      currentPlayer
    );

    if (currentPlayer === 1) {
      setP1Placed((prev) => prev + 1);

      if (p2Placed < maxCells) {
        setCurrentPlayer(2);
      }
    } else {
      setP2Placed((prev) => prev + 1);

      if (p1Placed < maxCells) {
        setCurrentPlayer(1);
      }
    }

    refresh();
  };

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 p-4 bg-gradient-to-b from-purple-500  to-purple-300 ">
      <h1 className="text-5xl font-bold underline decoration-purple-900 decoration-wavy">
        Kétjátékos Életjáték
      </h1>

      <div className="flex gap-6 items-center flex-wrap">
        <div className="flex flex-col items-center font-bold">
          <label>Sorok</label>

          <input
            type="number"
            value={rows}
            min={10}
            max={50}
            onChange={(e) =>
              setRows(
                Number(e.target.value)
              )
            }
            className="border p-2 rounded border-purple-700"
          />
        </div>

        <div className="flex flex-col items-center font-bold">
          <label>Oszlopok</label>

          <input
            type="number"
            value={cols}
            min={10}
            max={50}
            onChange={(e) =>
              setCols(
                Number(e.target.value)
              )
            }
            className="border p-2 rounded border-purple-700"
          />
        </div>

        <div className="flex flex-col items-center font-bold">
          <label>Max sejtek</label>

          <input
            type="number"
            value={maxCells}
            min={3}
            max={15}
            onChange={(e) =>
              setMaxCells(
                Number(e.target.value)
              )
            }
            className="border p-2 rounded border-purple-700"
          />
        </div>

        <button
          onClick={createNewGame}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg mt-5 font-bold"
        >
          Új pálya
        </button>
      </div>

      <h2 className="text-xl font-bold underline decoration-purple-600 decoration-wavy">
        Aktuális játékos:
        {currentPlayer === 1
          ? " 🔴 Piros"
          : " 🔵 Kék"}
      </h2>

      <div className="flex gap-8 text-lg font-bold">
        <div>
          🔴 Piros:
          {p1Placed}/{maxCells}
        </div>

        <div>
          🔵 Kék:
          {p2Placed}/{maxCells}
        </div>
      </div>

      <div
        className="border rounded-2xl p-2 shadow-xl bg-gradient-to-br from-purple-700 to-purple-300"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 25px)`,
        }}
      >
        {game.getRows().map((row, r) =>
          row.map((cell, c) => (
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
          onClick={startGame}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold"
        >
          Start
        </button>

        <button
          onClick={stopGame}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold"
        >
          Stop
        </button>
      </div>

      <h2 className="text-2xl font-bold text-purple-950">
        {winner}
      </h2>
    </div>
  );
}