import { Canvas } from "@react-three/fiber"
import { solToLamports } from "gamba"
import { useGamba } from "gamba/react"
import { GameUi, formatLamports } from "gamba/react-ui"
import React from "react"
import { Coin } from "./Coin"
import { Effect } from "./Effect"
import "./App.css"

import SOUND_COIN from "./coin.mp3"
import SOUND_LOSE from "./lose.mp3"
import SOUND_WIN from "./win.mp3"

const SIDES = {
  Heads: [2, 0],
  Tails: [0, 2],
};

const WAGER_OPTIONS = [0.05, 0.1, 0.5, 1, 3].map(solToLamports)

export default function Flip() {
  const gamba = useGamba();
  const [flipping, setFlipping] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState(0)
  const [wager, setWager] = React.useState(WAGER_OPTIONS[0])
  const [selectedButton, setSelectedButton] = React.useState<string | null>(null)

  const sounds = GameUi.useSounds({
    coin: SOUND_COIN,
    win: SOUND_WIN,
    lose: SOUND_LOSE,
  });

  const play = async (bet: number[], button: string) => {
    try {
      setWin(false)
      setFlipping(true)
      setSelectedButton(button)

      sounds.coin.play({ playbackRate: 0.5 })

      const res = await gamba.play({ bet, wager })

      sounds.coin.play()

      const result = await res.result()

      const win = result.payout > 0

      setResultIndex(result.resultIndex)

      setWin(win)

      if (win) {
        sounds.win.play()
      } else {
        sounds.lose.play()
      }
    } finally {
      setFlipping(false)
      setSelectedButton(null)
    }
  };

  return (
    <>
      <GameUi.Controls disabled={flipping}>
        <GameUi.Select.Root
          value={wager}
          label="Wager"
          onChange={(wager) => setWager(wager)}
          format={() => formatLamports(wager)}
        >
          {WAGER_OPTIONS.map((wager) => (
            <GameUi.Select.Option key={wager} value={wager}>
              {formatLamports(wager)}
            </GameUi.Select.Option>
          ))}
        </GameUi.Select.Root>
      </GameUi.Controls>
      <div className="canvas-container">
        <Canvas
          linear
          flat
          orthographic
          gl={{ alpha: true }}
          camera={{
            zoom: 80,
            position: [0, 0, 100],
          }}
        >
          <React.Suspense fallback={null}>
            <Coin result={resultIndex} flipping={flipping} />
          </React.Suspense>
          {flipping && <Effect color="white" />}
          {win && <Effect color="#42ff78" />}

          {/* Reduce the intensity of ambient light for softer global lighting */}
          <ambientLight intensity={0.5} color="#CCCCCC" />

          {/* Make directional light softer by reducing intensity */}
          <directionalLight
            position={[10, 20, 30]}
            target-position={[0, 0, 0]}
            intensity={1}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-radius={10} // Make the shadow softer
          />

          {/* Use Hemisphere light with lower intensity for softer, diffused lighting */}
          <hemisphereLight
            intensity={0.2}
            position={[0, 1, 0]}
            color="#ffffff"
            groundColor="#000000"
          />
        </Canvas>
        <div className="button-container">
        <button
          className={`big-button bright ${selectedButton === 'Heads' ? 'selected' : ''}`}
          onClick={() => play(SIDES.Heads, 'Heads')}
        >
          Bright
        </button>
        <button
          className={`big-button dark ${selectedButton === 'Tails' ? 'selected' : ''}`}
          onClick={() => play(SIDES.Tails, 'Tails')}
        >
          Dark
        </button>
      </div>
      </div>
    </>
  );
}
