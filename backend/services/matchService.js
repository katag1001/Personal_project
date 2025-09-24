const axios = require("axios");
const matches = [];

const colorPalettes = [
  ["navy", "soft white", "warm gray", "sage green", "dusty rose"],
  ["navy", "warm gray", "sage green", "mustard", "terracotta"],
  ["warm gray", "sage green", "mustard", "terracotta", "cream"],
  ["sage green", "mustard", "terracotta", "cream", "dusty rose"]
];

function matchPath(newItem, tops, bottoms, outer, onepiece) {
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
    return matchSeason(newItem, outer, tops, bottoms, outer, onepiece);
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

  return matchSeason(newItem, matchItem, tops, bottoms, outer, onepiece);
}

function matchSeason(newItem, matchItem, tops, bottoms, outer, onepiece) {
  const seasonalMatches = matchItem.filter(item =>
    (item.spring && newItem.spring) ||
    (item.summer && newItem.summer) ||
    (item.autumn && newItem.autumn) ||
    (item.winter && newItem.winter)
  );

  return matchStyle(newItem, seasonalMatches, tops, bottoms, outer, onepiece);
}

function matchStyle(newItem, matchItems, tops, bottoms, outer, onepiece) {
  const normalize = s => Array.isArray(s) ? s : [s];

  for (const item of matchItems) {
    const combinedStyles = [
      ...normalize(newItem.styles || newItem.style),
      ...normalize(item.styles || item.style)
    ];

    const patternedCount = combinedStyles.filter(s => s === "patterned").length;

    if (patternedCount <= 1) {
      colorMatch(newItem, item, tops, bottoms, outer, onepiece);
    }
  }
}

function colorMatch(newItem, matchItem, tops, bottoms, outer, onepiece) {
  const combinedColors = [...new Set([...newItem.colors, ...matchItem.colors])];

  if (matching(combinedColors)) {
    pushResult(newItem, matchItem, combinedColors, tops, bottoms, outer, onepiece);
  }

  function matching(combinedColors) {
    return colorPalettes.some(palette =>
      combinedColors.every(color => palette.includes(color))
    );
  }
}

function pushResult(newItem, matchItem, combinedColors, tops, bottoms, outer, onepiece) {
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
    matchPath(result, tops, bottoms, outer, onepiece);

  } else if (newItem.type === "outerwear") {
    const result = createResult({
      top: matchItem.name,
      outer: newItem.name,
      styles: [matchItem.style, newItem.style],
    });
    matches.push(result);
    matchPath(result, tops, bottoms, outer, onepiece);

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

// ✅ Public function for controller
async function processMatches(newItem, tops, bottoms, outer, onepiece) {
  console.log("Processing matches for new item:", newItem.name);

  matches.length = 0; // Clear old results

  matchPath(newItem, tops, bottoms, outer, onepiece);

  if (matches.length === 0) {
    console.log("No matches to upload.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:4444/api/matches/bulk", matches);
    console.log("Bulk matches created:", response.data);
  } catch (error) {
    console.error("Error uploading matches:", error.message);
  }
}

// ✅ Export
module.exports = {
  processMatches
};
