const fs = require("fs");
const contents = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const rows = contents.split("\n");

let monkeys = [];
for (let i = 0; i < rows.length; i += 7) {
  const [monkey, starting, operation, test, ifTrue, ifFalse] = rows.slice(
    i,
    i + 6
  );
  const [operator, operatorValue] = operation
    .match(/new = old (.+?) (.+)/)
    .slice(1);
  monkeys.push({
    index: monkeys.length,
    startingItems: starting
      .match(/\: (.+?)$/)[1]
      .split(", ")
      .map(parseFloat),
    operator,
    operatorValue:
      operatorValue === "old" ? operatorValue : parseFloat(operatorValue),
    test: parseFloat(test.match(/divisible by (\d+)/)[1]),
    ifTrue: parseFloat(ifTrue.match(/throw to monkey (\d+)/)[1]),
    ifFalse: parseFloat(ifFalse.match(/throw to monkey (\d+)/)[1]),
    newStartingItems: [],
    inspectCount: 0,
  });
}
console.log(JSON.stringify({ monkeys }, 2, 2));

for (let i = 0; i < 20; ++i) {
  for (let m = 0; m < monkeys.length; ++m) {
    const monkey = monkeys[m];
    monkey.newStartingItems = [];
    for (const item of monkey.startingItems) {
      let worry = item;
      const operatorValue =
        monkey.operatorValue === "old" ? worry : monkey.operatorValue;
      switch (monkey.operator) {
        case "*":
          {
            worry *= operatorValue;
          }
          break;
        case "/":
          {
            worry /= operatorValue;
          }
          break;
        case "+":
          {
            worry += operatorValue;
          }
          break;
        case "-":
          {
            worry -= operatorValue;
          }
          break;
      }
      worry = Math.floor(worry / 3);
      const testIsTrue = worry % monkey.test === 0;
      console.log({
        m,
        item,
        worry,
        operator: monkey.operator,
        operatorValue,
        testIsTrue,
        result: testIsTrue ? monkey.ifTrue : monkey.ifFalse,
      });
      monkeys[testIsTrue ? monkey.ifTrue : monkey.ifFalse].startingItems.push(
        worry
      );
      monkey.inspectCount++;
      monkey.startingItems = [];
    }
  }
  // for (const monkey of monkeys) {
  //   monkey.startingItems = monkey.newStartingItems;
  //   monkey.newStartingItems = [];
  // }
}

// console.log(JSON.stringify({ monkeys }, 2, 2));
const [m1, m2] = monkeys.sort((m1, m2) => m2.inspectCount - m1.inspectCount);
console.log(m1, m2, m1.inspectCount * m2.inspectCount);

// Monkey 0:
//   Starting items: 56, 56, 92, 65, 71, 61, 79
//   Operation: new = old * 7
//   Test: divisible by 3
//     If true: throw to monkey 3
//     If false: throw to monkey 7
