import { rounds } from "~/settings";

function createAbortController(signal: AbortSignal): AbortController {
  const controller = new AbortController();

  if (signal.aborted) {
    controller.abort();
  } else {
    signal.addEventListener("abort", () => controller.abort());
  }

  return controller;
}

export function create({
  code,
  level,
  signal,
  threads = navigator.hardwareConcurrency ?? 1,
}: {
  code: Code;
  level: number;
  signal: AbortSignal;
  threads?: number;
}): ReadableStream<GameWithScore> {
  const roundsPerThread = Math.ceil(rounds / threads);
  const ab = createAbortController(signal);
  let round = 0;

  return new ReadableStream({
    start(controller) {
      const onMessage = ({ data }: { data: GameWithScore }) => {
        round += 1;
        controller.enqueue(data);
        if (round >= rounds) {
          ab.abort();
          controller.close();
        }
      };

      const onError = ({ message }: ErrorEvent) => {
        ab.abort();
        controller.error(new Error(message));
      };

      for (let i = 0; i < threads; i += 1) {
        const worker = new Worker(
          new URL("~/lib/stream/worker.ts", import.meta.url),
          { type: "module" },
        );

        ab.signal.addEventListener("abort", () => worker.terminate());
        worker.addEventListener("message", onMessage);
        worker.addEventListener("error", onError);

        worker.postMessage({ code, level, rounds: roundsPerThread });
      }
    },
    cancel() {
      ab.abort();
    },
  });
}
