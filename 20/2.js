const fs = require("fs");

let numbers = fs
  .readFileSync("./input.txt", { encoding: "utf-8" })
  .split("\n")
  .map((x, index) => {
    return { value: parseFloat(x) * 811589153, moved: false, index };
  });

const numbersClone = [...numbers];

for (let i = 0; i < 10; ++i) {
  for (const number of numbersClone) {
    // if (number.value === 0) {
    //   continue;
    // }
    const index = numbers.indexOf(number);
    if (number.value === 0) {
      // console.log(0, numbers.map((x) => x.value).join(","));
    }
    numbers.splice(index, 1);
    numbers.splice((index + number.value) % numbers.length, 0, number);
    if (number.value === 0) {
      // console.log(0, numbers.map((x) => x.value).join(","));
    }
    // console.log("\n\n");
  }
  // console.log(numbers.map((x) => x.value).join(","));
  // console.log("\n\n");
}

// // Then, the grove coordinates can be found by looking at the 1000th, 2000th, and 3000th numbers after the value 0, wrapping around the list as necessary. In the above example, the 1000th number after 0 is 4, the 2000th is -3, and the 3000th is 2; adding these together produces 3.
// // Mix your encrypted file exactly once. What is the sum of the three numbers that form the grove coordinates?

function calculateResult() {
  const indexOf0 = numbers.findIndex((n) => n.value === 0);
  console.log(numbers[(indexOf0 + 1000) % numbers.length]);
  console.log(numbers[(indexOf0 + 2000) % numbers.length]);
  console.log(numbers[(indexOf0 + 3000) % numbers.length]);
  console.log(
    numbers[(indexOf0 + 1000) % numbers.length].value +
      numbers[(indexOf0 + 2000) % numbers.length].value +
      numbers[(indexOf0 + 3000) % numbers.length].value
  );
}

calculateResult();
