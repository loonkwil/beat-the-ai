import { rounds } from "~/settings";

export default class Arena extends EventTarget {
  workers: Array<Worker>;

  constructor({
    code,
    level,
    threads = navigator.hardwareConcurrency ?? 1,
  }: {
    code: string;
    level: number;
    threads?: number;
  }) {
    super();

    this.workers = Array.from(
      { length: threads },
      () =>
        new Worker(new URL("~/lib/worker.ts", import.meta.url), {
          type: "module",
        }),
    );

    let i = 0;

    const onMessage = ({ data }: { data: GameWithScore }) => {
      i += 1;
      if (i >= rounds) {
        this.destroy();
      }

      const event = new CustomEvent("result", { detail: data });
      this.dispatchEvent(event);
    };

    const onError = ({ message }: ErrorEvent) => {
      this.destroy();

      const event = new ErrorEvent("error", { message });
      this.dispatchEvent(event);
    };

    this.workers.forEach((worker) => {
      worker.addEventListener("message", onMessage);
      worker.addEventListener("error", onError);
      worker.postMessage({ code, level });
    });
  }

  destroy() {
    this.workers.forEach((worker) => worker.terminate());
  }
}
