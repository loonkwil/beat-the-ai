export default class Arena extends EventTarget {
  constructor({
    fnBody,
    rounds,
    level,
    threads = navigator.hardwareConcurrency,
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

    const onMessage = ({ data }) => {
      i += 1;
      if (i >= rounds) {
        this.destroy();
      }

      const event = new CustomEvent("result", { detail: data });
      this.dispatchEvent(event);
    };

    const onError = (e) => {
      this.dispatchEvent("error", e);
    };

    this.workers.forEach((worker) => {
      worker.addEventListener("message", onMessage);
      worker.addEventListener("error", onError);
      worker.postMessage({ fnBody, level });
    });
  }

  destroy() {
    this.workers.forEach((worker) => worker.terminate());
  }
}
