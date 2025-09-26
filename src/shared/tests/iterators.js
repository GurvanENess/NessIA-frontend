Number.prototype[Symbol.iterator] = function () {
  let current = this;
  return {
    next: () => {
      if (current) {
        const numToString = current.toString().split("");
        const result = { done: false, value: numToString.shift() };
        current = Number(numToString.join(""));
        return result;
      } else {
        return { done: true };
      }
    },
  };
};

for (let i of 1234567) {
  process.stdout.write(`${i} `);
}

// 1 2 3 4 5
