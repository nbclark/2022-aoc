const fs = require("fs");

let blueprints = fs
  .readFileSync("./input.txt", { encoding: "utf-8" })
  .split("\n")
  .map((x, index) => {
    const results = x.matchAll(
      /Each (.+?) robot costs (\d+?) (.+?)( and (\d+?) (.+?))*\./gi
    );
    const costs = {};
    for (const result of results) {
      const [
        type,
        cost1Amount,
        cost1Type,
        hasMoreCosts,
        cost2Amount,
        cost2Type,
      ] = result.slice(1);
      costs[type] = {
        [cost1Type]: parseFloat(cost1Amount),
        [cost2Type]: parseFloat(cost2Amount),
      };
    }
    return { index: index + 1, costs };
  });

const time = 32;

const _materials = {
  ore: 0,
  clay: 0,
  obsidian: 0,
  geode: 0,
};
const _robots = {
  ore: 1,
  clay: 0,
  obsidian: 0,
  geode: 0,
};

function bfsForBlueprint(blueprint) {
  const queue = [];
  const visited = new Set();
  queue.push({
    materials: { ..._materials },
    robots: { ..._robots },
    timeLeft: time,
  });
  const mostOreNeeded = Math.max(
    blueprint.costs.ore.ore,
    blueprint.costs.clay.ore,
    blueprint.costs.obsidian.ore,
    blueprint.costs.geode.ore
  );
  const mostClayNeeded = Math.max(blueprint.costs.obsidian.clay);
  const mostObsidianNeeded = Math.max(blueprint.costs.geode.obsidian);
  let maxGeode = 0;
  while (queue.length) {
    const iter = queue.pop();
    const { materials, robots, timeLeft } = iter;
    if (timeLeft === 0) {
      if (materials.geode > maxGeode) {
        maxGeode = Math.max(maxGeode, materials.geode);
      }
      continue;
    }
    const materialsFlightPath = { ...materials };

    // For caching, get the lesser of how much we have in materials now
    // OR how much of a material we need produced by the end relative to
    // what we have now
    materialsFlightPath.ore = Math.min(
      materialsFlightPath.ore,
      timeLeft * mostOreNeeded - robots.ore * (timeLeft - 1)
    );

    materialsFlightPath.clay = Math.min(
      materialsFlightPath.clay,
      timeLeft * mostClayNeeded - robots.clay * (timeLeft - 1)
    );

    materialsFlightPath.obsidian = Math.min(
      materialsFlightPath.obsidian,
      timeLeft * mostObsidianNeeded - robots.obsidian * (timeLeft - 1)
    );

    const key = `${JSON.stringify(materialsFlightPath)},${JSON.stringify(
      robots
    )},${timeLeft}`;

    if (visited.has(key)) continue;
    visited.add(key, 1);
    // Need to do some pruning

    // Add the default case
    queue.push({
      materials: {
        ore: materials.ore + robots.ore,
        clay: materials.clay + robots.clay,
        obsidian: materials.obsidian + robots.obsidian,
        geode: materials.geode + robots.geode,
      },
      robots: { ...robots },
      timeLeft: timeLeft - 1,
    });

    if (
      materials.obsidian >= blueprint.costs.geode.obsidian &&
      materials.ore >= blueprint.costs.geode.ore
    ) {
      queue.push({
        materials: {
          ore: materials.ore + robots.ore - blueprint.costs.geode.ore,
          clay: materials.clay + robots.clay,
          obsidian:
            materials.obsidian +
            robots.obsidian -
            blueprint.costs.geode.obsidian,
          geode: materials.geode + robots.geode,
        },
        robots: { ...robots, geode: robots.geode + 1 },
        timeLeft: timeLeft - 1,
      });
    }
    if (
      materials.clay >= blueprint.costs.obsidian.clay &&
      materials.ore >= blueprint.costs.obsidian.ore
    ) {
      queue.push({
        materials: {
          ore: materials.ore + robots.ore - blueprint.costs.obsidian.ore,
          clay: materials.clay + robots.clay - blueprint.costs.obsidian.clay,
          obsidian: materials.obsidian + robots.obsidian,
          geode: materials.geode + robots.geode,
        },
        robots: { ...robots, obsidian: robots.obsidian + 1 },
        timeLeft: timeLeft - 1,
      });
    }
    if (materials.ore >= blueprint.costs.clay.ore) {
      queue.push({
        materials: {
          ore: materials.ore + robots.ore - blueprint.costs.clay.ore,
          clay: materials.clay + robots.clay,
          obsidian: materials.obsidian + robots.obsidian,
          geode: materials.geode + robots.geode,
        },
        robots: { ...robots, clay: robots.clay + 1 },
        timeLeft: timeLeft - 1,
      });
    }
    if (materials.ore >= blueprint.costs.ore.ore) {
      queue.push({
        materials: {
          ore: materials.ore + robots.ore - blueprint.costs.ore.ore,
          clay: materials.clay + robots.clay,
          obsidian: materials.obsidian + robots.obsidian,
          geode: materials.geode + robots.geode,
        },
        robots: { ...robots, ore: robots.ore + 1 },
        timeLeft: timeLeft - 1,
      });
    }
  }
  return maxGeode;
}

let maxBluePrint = null;
let maxBluePrintAmount = 0;
let sum = 0;
for (const blueprint of blueprints.slice(0, 3)) {
  const maxGeode = bfsForBlueprint(blueprint);
  if (maxGeode > maxBluePrintAmount) {
    maxBluePrintAmount = maxGeode;
    maxBluePrint = blueprint;
  }
  console.log(maxGeode);
  sum += blueprint.index * maxGeode;
}
console.log(maxBluePrintAmount, maxBluePrint.index * maxBluePrintAmount, sum);
// console.log(JSON.stringify(blueprints, null, 2));
