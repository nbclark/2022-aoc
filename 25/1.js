const fs = require("fs");

const digitMap = {
  "=": -2,
  "-": -1,
  0: 0,
  1: 1,
  2: 2,
};

const digitMapReverse = {
  "-2": "=",
  "-1": "-",
  0: 0,
  1: 1,
  2: 2,
};

let rows = fs.readFileSync("./input.txt", { encoding: "utf-8" }).split("\n");

function snafuToNumber(digits) {
  let result = 0;
  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i];
    const digitValue = digitMap[digit];
    result += digitValue * Math.pow(5, digits.length - i - 1);
  }
  return result;
}
const numbers = rows.map((row) => {
  const digits = row;
  return snafuToNumber(digits);
});

const sum = numbers.reduce((s, n) => s + n, 0);

function numberToSnafu(n) {
  if (n === 0) return "";
  if (n % 5 === 0) return numberToSnafu(Math.floor(n / 5)) + "0";
  if (n % 5 === 1) return numberToSnafu(Math.floor(n / 5)) + "1";
  if (n % 5 === 2) return numberToSnafu(Math.floor(n / 5)) + "2";
  if (n % 5 === 3) return numberToSnafu((n + 2) / 5) + "=";
  if (n % 5 === 4) return numberToSnafu((n + 1) / 5) + "-";

  const numberInBase5 = Math.floor(Math.log(n) / Math.log(5));
  console.log(numberInBase5);

  let digits = [];
  let num = n;
  for (let i = numberInBase5; i >= 0; i--) {
    const x = Math.pow(5, i);
    const digit = Math.floor(num / x);
    console.log({ digit, num, x, foo: digit * x });
    num = num % x;
    digits.push(digit);
  }
  digits.reverse();
  // [ 1, 2, 4, 0, 3, 0 ] = 15
  // [3125*1,625*2,125*4,0,15,0]
  // [ 2, -2, 0, 1, -2, 0 ]
  // 3125*2-625*2-125+15
  // [3125*2, -2*625, -1*125, 0, -10, 0]
  //
  // [ 2, -1, 1, 1, -1, 0 ] = 25 - 5
  for (let i = 0; i < digits.length; ++i) {
    if (digits[i] > 2) {
      const delta = digits[i] - 3;
      // Delta is 1 or 2
      digits[i + 1] += 1;
      digits[i] -= 5 - delta;
    }
  }
  const mapped = digits.reverse().map((x) => digitMapReverse[x]);
  console.log(digits, mapped, snafuToNumber(mapped));
}

console.log(numberToSnafu(sum));

// "SNAFU works the same way, except it uses powers of five instead of ten. Starting from the right, you have a ones place, a fives place, a twenty-fives place, a one-hundred-and-twenty-fives place, and so on. It's that easy!"

// You ask why some of the digits look like - or = instead of "digits".

// "You know, I never did ask the engineers why they did that. Instead of using digits four through zero, the digits are 2, 1, 0, minus (written -), and double-minus (written =). Minus is worth -1, and double-minus is worth -2."

// "So, because ten (in normal numbers) is two fives and no ones, in SNAFU it is written 20. Since eight (in normal numbers) is two fives minus two ones, it is written 2=."

// "You can do it the other direction, too. Say you have the SNAFU number 2=-01. That's 2 in the 625s place, = (double-minus) in the 125s place, - (minus) in the 25s place, 0 in the 5s place, and 1 in the 1s place. (2 times 625) plus (-2 times 125) plus (-1 times 25) plus (0 times 5) plus (1 times 1). That's 1250 plus -250 plus -25 plus 0 plus 1. 976!"
