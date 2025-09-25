const Match = require('../models/Match');
const axios = require("axios");

const colorPalettes = [
  ["navy", "soft white", "warm gray", "sage green", "dusty rose"],
  ["navy", "warm gray", "sage green", "mustard", "terracotta"],
  ["warm gray", "sage green", "mustard", "terracotta", "cream"],
  ["sage green", "mustard", "terracotta", "cream", "dusty rose"]
];

function matchPath(newItem, tops, bottoms, outer, onepiece, matches, context) {
  console.log("Matching path for new item:", newItem.name);
  let matchItem;

  if (newItem.type === "onepiece") {
    const result = {
      top: null,
      bottom: null,
      outer: null,
      onepiece: newItem.name,
      colors: newItem.colors,
      colorScore: null,
      min_temp: newItem.min_temp,
      max_temp: newItem.max_temp,
      type: "match",
      styles: [newItem.style],
      spring: newItem.spring,
      summer: newItem.summer,
      autumn: newItem.autumn,
      winter: newItem.winter
    };

    matches.push(result);
    return matchSeason(newItem, outer, matches, context);
  }

  if (newItem.type === "top") {
    matchItem = bottoms;
  } else if (newItem.type === "bottom") {
    matchItem = tops;
  } else if (newItem.type === "outerwear") {
    matchItem = tops;
  } else if (newItem.type === "match" && newItem.top && newItem.bottom && !newItem.outer) {
    matchItem = outer;
  } else if (newItem.type === "match" && newItem.outer && !newItem.bottom) {
    matchItem = bottoms;
  } else {
    return;
  }

  return matchSeason(newItem, matchItem, matches, context);
}

function matchSeason(newItem, matchItem, matches, context) {
  console.log("Matching season for new item:", newItem.name);
  const seasonalMatches = matchItem.filter(item =>
    (item.spring && newItem.spring) ||
    (item.summer && newItem.summer) ||
    (item.autumn && newItem.autumn) ||
    (item.winter && newItem.winter)
  );

  return matchStyle(newItem, seasonalMatches, matches, context);
}

function matchStyle(newItem, matchItems, matches, context) {
  console.log("Matching style for new item:", newItem.name);

  const normalize = s => Array.isArray(s) ? s : [s];

  for (const item of matchItems) {
    const combinedStyles = [
      ...normalize(newItem.styles || newItem.style),
      ...normalize(item.styles || item.style)
    ];

    const patternedCount = combinedStyles.filter(s => s === "patterned").length;

    if (patternedCount <= 1) {
      colorMatch(newItem, item, matches, context);
    }
  }
}

function colorMatch(newItem, matchItem, matches, context) {
  console.log("Matching color for new item:", newItem.name, "with", matchItem.name);
  const combinedColors = [...new Set([...newItem.colors, ...matchItem.colors])];

  if (matching(combinedColors)) {
    pushResult(newItem, matchItem, matches, combinedColors, context);
  }

  function matching(combinedColors) {
    return colorPalettes.some(palette =>
      combinedColors.every(color => palette.includes(color))
    );
  }
}

function pushResult(newItem, matchItem, matches, combinedColors, context) {
  console.log("Pushing result for new item:", newItem.name, "with", matchItem.name);
  const min_temp = (newItem.min_temp + matchItem.min_temp) / 2;
  const max_temp = (newItem.max_temp + matchItem.max_temp) / 2;

  function createResult(overrides) {
    return {
      top: null,
      bottom: null,
      outer: null,
      onepiece: null,
      colors: combinedColors,
      colorScore: null,
      min_temp: parseFloat(min_temp.toFixed(1)),
      max_temp: parseFloat(max_temp.toFixed(1)),
      type: "match",
      spring: newItem.spring && matchItem.spring,
      summer: newItem.summer && matchItem.summer,
      autumn: newItem.autumn && matchItem.autumn,
      winter: newItem.winter && matchItem.winter,
      ...overrides,
    };
  }

  const baseStyles = newItem.styles || [newItem.style];

  if (newItem.type === "top" || newItem.type === "bottom") {
    const result = createResult({
      top: newItem.type === "top" ? newItem.name : matchItem.name,
      bottom: newItem.type === "bottom" ? newItem.name : matchItem.name,
      styles: [newItem.style, matchItem.style],
    });
    matches.push(result);
    matchPath(result, context.tops, context.bottoms, context.outer, null, matches, context);

  } else if (newItem.type === "outerwear") {
    const result = createResult({
      top: matchItem.name,
      outer: newItem.name,
      styles: [matchItem.style, newItem.style],
    });
    matches.push(result);
    matchPath(result, context.tops, context.bottoms, context.outer, null, matches, context);

  } else if (newItem.type === "match" && newItem.top && newItem.bottom && !newItem.outer) {
    const result = createResult({
      top: newItem.top,
      bottom: newItem.bottom,
      outer: matchItem.name,
      styles: [...baseStyles, matchItem.style],
    });
    matches.push(result);

  } else if (newItem.type === "match" && newItem.outer && !newItem.bottom) {
    const result = createResult({
      top: newItem.top,
      bottom: matchItem.name,
      outer: newItem.outer,
      styles: [...baseStyles, matchItem.style],
    });
    matches.push(result);

  } else if (newItem.type === "onepiece" && matchItem.type === "outerwear") {
    const result = createResult({
      onepiece: newItem.name,
      outer: matchItem.name,
      styles: [newItem.style, matchItem.style],
    });
    matches.push(result);
  }
}

async function processMatches(newItem, tops, bottoms, outer, onepiece) {
  console.log("Processing matches for new item:", newItem.name);
  const matches = [];
  const context = { tops, bottoms, outer }; // 👈 Context object

  matchPath(newItem, tops, bottoms, outer, onepiece, matches, context);

  if (matches.length === 0) {
    console.log("No matches to upload.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:4444/api/match/bulk", matches);
    console.log("Bulk matches created:", response.data);
  } catch (error) {
    console.error("Error uploading matches:", error.message);
  }
}

module.exports = {
  processMatches
};
