import { useEffect } from "react";
import Arena from "~/lib/Arena";
import { slice } from "~/lib/utils/func";
import type { Game } from "~/lib/game";

export default function useGameScoring({
  code,
  compute = false,
  rounds,
  levels,
  onResult,
  onError,
}: {
  code: {
    value: string;
    fnBodyPosition: [number, number];
  };
  compute: boolean;
  rounds: number;
  levels: number;
  onResult: ({ level, game }: { level: number; game: Game }) => void;
  onError: (e: Error) => void;
}) {
  useEffect(() => {
    if (!compute) {
      return;
    }

    const [, fnBody] = slice(code.value, code.fnBodyPosition);

    const level = 1;
    const arena = new Arena({ fnBody, rounds, level });
    arena.addEventListener("result", ({ detail }) => {
      onResult({ level, game: detail });
    });
    arena.addEventListener("error", (e) => onError(e));

    return () => arena.destroy();
  }, [code, compute, rounds, levels, onResult, onError]);
}
