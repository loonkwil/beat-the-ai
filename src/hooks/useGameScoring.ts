import { useEffect } from "react";
import Arena from "~/lib/Arena";

export default function useGameScoring({
  code,
  compute = false,
  onResult,
  onError,
}: {
  code: string;
  compute: boolean;
  onResult: ({ level, game }: { level: number; game: GameWithScore }) => void;
  onError: (e: Error) => void;
}) {
  useEffect(() => {
    if (!compute) {
      return;
    }

    const level = 1;
    const arena = new Arena({ code, level });
    arena.addEventListener("result", ({ detail }: { detail: GameWithScore }) =>
      onResult({ level, game: detail }),
    );
    arena.addEventListener("error", ({ message }: ErrorEvent) =>
      onError(new Error(message)),
    );

    return () => arena.destroy();
  }, [code, compute, onResult, onError]);
}
