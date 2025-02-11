export const mutex = () => {
  let last: Promise<void> = Promise.resolve();
  return {
    lock: () => {
      let release: () => void;
      const newLock = new Promise<void>((resolve) => {
        release = resolve;
      });
      const previous = last;
      last = last.then(() => newLock);
      return previous.then(() => {
        return () => release();
      });
    },
  };
};
