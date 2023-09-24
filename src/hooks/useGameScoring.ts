import { useEffect, useState } from "react";
import { create as createStream } from "~/lib/stream";
import { rounds, levels } from "~/settings";

const initialResults = Array.from({ length: levels }, () => ({
  status: "pending",
  score: 0,
  games: [],
})) as Results;

function updateLevelResults(prev: Results, level: number, next: any): Results {
  return prev.toSpliced(level, 1, {
    ...prev[level],
    ...next,
  });
}

export default function useGameScoring({ code }: { code: string }) {
  const [state, setState] = useState<Results | Error>(initialResults);

  useEffect(() => {
    if (!code) {
      return;
    }

    const controller = new AbortController();
    let results = initialResults;
    (async () => {
      for (let level = 0; level < levels; level += 1) {
        if (controller.signal.aborted) {
          return;
        }

        results = updateLevelResults(results, level, {
          status: "ongoing",
        });
        setState(results);

        const stream = createStream({ code, level, signal: controller.signal });
        try {
          for await (const game of stream) {
            const score = results[level].score + game.score;
            const games = [...results[level].games, game];
            results = updateLevelResults(results, level, { score, games });
            setState(results);
          }

          const status =
            results[level].score > rounds / 2 ? "succeeded" : "failed";
          results = updateLevelResults(results, level, { status });
          setState(results);

          if (status === "failed") {
            return;
          }
        } catch (e) {
          setState(e as Error);
          return;
        }
      }
    })();

    return () => controller.abort();
  }, [code]);

  return state;
}
