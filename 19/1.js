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

const time = 24;

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

function calculateMaterialsConsumed(m, r, cost) {
  const mAfter = { ...m };
  mAfter[cost.cost1Type] -= cost.cost1Amount;
  if (cost.cost2Type) {
    mAfter[cost.cost2Type] -= cost.cost2Amount;
  }
  return mAfter;
}

function calculateMaterialsProduced(m, r) {
  const mAfter = { ...m };
  for (const robot of Object.keys(r)) {
    mAfter[robot] += r[robot];
  }
  return mAfter;
}

let maxGeode = 0;
function exploreOptions(
  blueprint,
  t = 0,
  m = materials,
  r = robots,
  maxTime = time,
  solveForFirst
) {
  if (t === maxTime) {
    if (!solveForFirst) {
      maxGeode = Math.max(maxGeode, m.geode);
    }
    return null;
  }
  if (solveForFirst && r[solveForFirst] > 0) {
    // console.log({ r, m, t });
    return { r, m, t };
  }
  const mAfter = { ...m };
  // Produce
  for (const robot of Object.keys(r)) {
    mAfter[robot] += r[robot];
  }
  // Spend to build robots
  const robotsWeCouldBuild = blueprint.costs.filter(
    (cost) =>
      m[cost.cost1Type] >= cost.cost1Amount &&
      (!cost.cost2Type || m[cost.cost2Type] >= cost.cost2Amount)
  );
  const skipNullCase =
    robotsWeCouldBuild.length === blueprint.costs.length ||
    robotsWeCouldBuild.find((r) => r.type === "geode");

  const results = [];

  for (const robotToBuild of [null, ...robotsWeCouldBuild]) {
    if (robotToBuild) {
      const result = exploreOptions(
        blueprint,
        t + 1,
        calculateMaterialsProduced(
          calculateMaterialsConsumed(m, r, robotToBuild),
          r
        ),
        {
          ...r,
          [robotToBuild.type]: r[robotToBuild.type] + 1,
        },
        maxTime,
        solveForFirst
      );
      if (result) {
        if (Array.isArray(result)) {
          results.push(...result);
        } else {
          results.push(result);
        }
      }
    } else if (!skipNullCase) {
      const result = exploreOptions(
        blueprint,
        t + 1,
        calculateMaterialsProduced(m, r),
        {
          ...r,
        },
        maxTime,
        solveForFirst
      );
      if (result) {
        if (Array.isArray(result)) {
          results.push(...result);
        } else {
          results.push(result);
        }
      }
    }
  }
  if (results.length) {
    return results;
  }
}

function solveForMostDeficient() {
  //
}
// Blueprint 1:
//   Each ore robot costs 4 ore.
//   Each clay robot costs 2 ore.
//   Each obsidian robot costs 3 ore and 14 clay.
//   Each geode robot costs 2 ore and 7 obsidian.

// geode = 2 ore + 7obsidian
// = 2ore + (21ore + 98clay)
// want a ratio of about 98 clay to 23 ore -> 3:1

// Need 7obsidian to 2 ore
// We're obsidian deficient initially
// To get obsidian, we need clay at a 14:3 rate

// for (const blueprint of blueprints.slice(1, 2)) {
//   console.log({ blueprint });
//   const results = exploreOptions(
//     blueprint,
//     0,
//     { ...materials },
//     { ...robots },
//     12,
//     "obsidian"
//   );
//   // console.log(results);
//   const best = results[0];
//   maxGeode = 0;
//   const results2 = exploreOptions(
//     blueprint,
//     best.t,
//     { ...best.m },
//     { ...best.r },
//     time
//   );
//   console.log(maxGeode);
//   break;
// }

// console.log(JSON.stringify(blueprints, null, 2));
// console.log(materials);

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

    // materials.ore = Math.min(materials.ore, mostOreNeeded);
    // materials.clay = Math.min(materials.clay, mostClayNeeded);
    // materials.obsidian = Math.min(materials.obsidian, mostObsidianNeeded);
    robots.ore = Math.min(robots.ore, mostOreNeeded);
    robots.clay = Math.min(robots.clay, mostClayNeeded);
    robots.obsidian = Math.min(robots.obsidian, mostObsidianNeeded);

    const key = `${JSON.stringify(materials)},${JSON.stringify(
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
    } else if (
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
    } else {
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
  }
  return maxGeode;
}

let maxBluePrint = null;
let maxBluePrintAmount = 0;
let sum = 0;
for (const blueprint of blueprints) {
  const maxGeode = bfsForBlueprint(blueprint);
  if (maxGeode > maxBluePrintAmount) {
    maxBluePrintAmount = maxGeode;
    maxBluePrint = blueprint;
  }
  console.log(maxGeode);
  sum += blueprint.index * maxGeode;
}
console.log(maxBluePrint.index * maxBluePrintAmount, sum);
// console.log(JSON.stringify(blueprints, null, 2));
