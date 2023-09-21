import { useEffect } from "react";
import Arena from "~/lib/Arena";
import type { Game } from "~/lib/game";

export default function useGameScoring({
  code,
  compute = false,
  onResult,
  onError,
}: {
  code: string;
  compute: boolean;
  onResult: ({ level, game }: { level: number; game: Game }) => void;
  onError: (e: Error) => void;
}) {
  useEffect(() => {
    if (!compute) {
      return;
    }

    const level = 1;
    const arena = new Arena({ code, level });
    arena.addEventListener("result", ({ detail }) => {
      onResult({ level, game: detail });
    });
    arena.addEventListener("error", (e) => onError(e));

    return () => arena.destroy();
  }, [code, compute, onResult, onError]);
}
