const matches = [];

/* Choose which path to take depending on the piece being inserted */
function matchPath(newItem, tops, bottoms, outer) {
  normalizeStyles(newItem); // ✅ Ensure styles are normalized

  let matchItem;

  if (newItem.type === "onepiece") {
    const result = {
      top: null,
      bottom: null,
      outer: null,
      onepiece: newItem.name,
      colors: newItem.colors,
      colorScore: 3,
      min_temp: newItem.min_temp,
      max_temp: newItem.max_temp,
      type: "match",
      styles: [...(newItem.styles || [])],
      spring: newItem.spring,
      summer: newItem.summer,
      autumn: newItem.autumn,
      winter: newItem.winter
    };

    matches.push(result);

    return matchSeason(newItem, outer);
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

  return matchSeason(newItem, matchItem);
}

function matchSeason(newItem, matchItem) {
  const seasonalMatches = matchItem.filter(item =>
    (item.spring && newItem.spring) ||
    (item.summer && newItem.summer) ||
    (item.autumn && newItem.autumn) ||
    (item.winter && newItem.winter)
  );

  return matchStyle(newItem, seasonalMatches);
}

function matchStyle(newItem, matchItems) {
  return matchItems.filter(item => {
    const combinedStyles = [...(newItem.styles || []), ...(item.styles || [])];
    const patternedCount = combinedStyles.filter(s => s === "patterned").length;
    return patternedCount <= 1;
  });
}

function matchColor(newItem, matchItem) {
  function getColorScore(color1, color2) {
    if (colorMatches[color1]) {
      for (const score in colorMatches[color1]) {
        if (colorMatches[color1][score].includes(color2)) {
          return parseInt(score);
        }
      }
    }
    return 0;
  }

  for (let item of matchItem) {
    let scoreSum = 0;
    let matchCount = 0;

    const newItemMatchesAll = newItem.colors.every(color1 =>
      item.colors.some(color2 => getColorScore(color1, color2) > 0)
    );

    const itemMatchesAll = item.colors.every(color2 =>
      newItem.colors.some(color1 => getColorScore(color1, color2) > 0)
    );

    if (newItemMatchesAll && itemMatchesAll) {
      for (let color1 of newItem.colors) {
        for (let color2 of item.colors) {
          const score = getColorScore(color1, color2);
          if (score > 0) {
            scoreSum += score;
            matchCount += 1;
          }
        }
      }

      const averageScore = scoreSum / matchCount;
      const allColors = [...new Set([...newItem.colors, ...item.colors])];

      pushResult(newItem, item, allColors, averageScore);
    }
  }

  return matches;
}

/* Push result to matches array */
function pushResult(newItem, matchItem, allColors, averageScore) {
  const min_temp = (newItem.min_temp + matchItem.min_temp) / 2;
  const max_temp = (newItem.max_temp + matchItem.max_temp) / 2;

  function createResult(overrides) {
    const result = {
      top: null,
      bottom: null,
      outer: null,
      onepiece: null,
      colors: allColors,
      colorScore: parseFloat(averageScore.toFixed(2)),
      min_temp: parseFloat(min_temp.toFixed(1)),
      max_temp: parseFloat(max_temp.toFixed(1)),
      type: "match",
      spring: newItem.spring && matchItem.spring,
      summer: newItem.summer && matchItem.summer,
      autumn: newItem.autumn && matchItem.autumn,
      winter: newItem.winter && matchItem.winter,
      ...overrides,
    };

    // ✅ Clean up any lingering `style`
    if ("style" in result) {
      delete result.style;
    }

    return result;
  }

  if (newItem.type === "top" || newItem.type === "bottom") {
    const result = createResult({
      top: newItem.type === "top" ? newItem.name : matchItem.name,
      bottom: newItem.type === "bottom" ? newItem.name : matchItem.name,
      styles: [...(newItem.styles || []), ...(matchItem.styles || [])],
    });
    matches.push(result);
    matchPath(result, tops, bottoms, outer);

  } else if (newItem.type === "outerwear") {
    const result = createResult({
      top: matchItem.name,
      outer: newItem.name,
      styles: [...(matchItem.styles || []), ...(newItem.styles || [])],
    });
    matchPath(result, tops, bottoms, outer);

  } else if (newItem.type === "match" && newItem.top && newItem.bottom && !newItem.outer) {
    const result = createResult({
      top: newItem.top,
      bottom: newItem.bottom,
      outer: matchItem.name,
      styles: [...(newItem.styles || []), ...(matchItem.styles || [])],
    });
    matches.push(result);

  } else if (newItem.type === "match" && newItem.outer && !newItem.bottom) {
    const result = createResult({
      top: newItem.top,
      bottom: matchItem.name,
      outer: newItem.outer,
      styles: [...(newItem.styles || []), ...(matchItem.styles || [])],
    });
    matches.push(result);

  } else if (newItem.type === "onepiece" && matchItem.type === "outerwear") {
    const combinedColors = [...new Set([...(newItem.colors || []), ...(matchItem.colors || [])])];
    const result = {
      ...createResult({
        outer: matchItem.name,
        onepiece: newItem.name,
        colors: combinedColors,
        styles: [...(newItem.styles || []), ...(matchItem.styles || [])],
      }),
      min_temp: parseFloat(((newItem.min_temp + matchItem.min_temp) / 2).toFixed(1)),
      max_temp: parseFloat(((newItem.max_temp + matchItem.max_temp) / 2).toFixed(1)),
    };
    matches.push(result);
  }
}


const tops = [
  {
    "name": "Green paisley shirt",
    "imageUrl": "",
    "min_temp": 18,
    "max_temp": 28,
    "colors": ["cream","green"],
    "styles": ["patterned"],
    "type": "top",
    "spring" : true,
    "summer" : true,
    "autumn" : false,
    "winter" : false
  },
  {
    "name": "Floaty cream blouse",
    "imageUrl": "",
    "min_temp": 11,
    "max_temp": 19,
    "colors": ["cream"],
    "styles": ["plain"],
    "type": "top",
    "spring" : true,
    "summer" : false,
    "autumn" : true,
    "winter" : true
  },
  {
    "name": "Embroidered blouse",
    "imageUrl": "",
    "min_temp": 18,
    "max_temp": 29,
    "colors": ["blue","white"],
    "styles": ["patterned"],
    "type": "top",
    "spring" : true,
    "summer" : true,
    "autumn" : false,
    "winter" : false
  },
    {
    "name": "Black tank",
    "imageUrl": "",
    "min_temp": 14,
    "max_temp": 32,
    "colors": ["black"],
    "styles": ["plain"],
    "type": "top",
    "spring" : true,
    "summer" : true,
    "autumn" : true,
    "winter" : false
  }
];

const bottoms = [
  {
    "name": "Wide Blue Jeans",
    "imageUrl": "",
    "min_temp": 5,
    "max_temp": 20,
    "colors" : ["blue"],
    "styles": ["plain"],
    "type": "bottom",
    "spring" : true,
    "summer" : false,
    "autumn" : true,
    "winter" : true
  },
  {
    "name": "Fun shorts",
    "imageUrl": "",
    "min_temp": 20,
    "max_temp": 40,
    "colors" : ["black","white"],
    "styles": ["patterned"],
    "type": "bottom",
    "spring" : true,
    "summer" : true,
    "autumn" : false,
    "winter" : false
  },
  {
    "name": "White shorts",
    "imageUrl": "",
    "min_temp": 20,
    "max_temp": 40,
    "colors": ["white"],
    "styles": ["patterned"],
    "type": "bottom",
    "spring" : true,
    "summer" : true,
    "autumn" : false,
    "winter" : false
  }
];

const outer = [
  {
    "name": "Camel coat",
    "imageUrl": "",
    "min_temp": 14,
    "max_temp": 22,
    "colors": ["camel"],
    "styles": ["plain"],
    "type": "outerwear",
    "spring" : true,
    "summer" : true,
    "autumn" : true,
    "winter" : true
  }
]

const onePiece = [
  {
    "name": "Summer Sundress",
    "imageUrl": "",
    "min_temp": 24,
    "max_temp": 38,
    "colors" : ["white","blue"],
    "styles": ["patterned"],
    "type": "onepiece",
    "spring" : true,
    "summer" : true,
    "autumn" : false,
    "winter" : false
  },
  {
    "name": "Long Sleeve Midi Dress",
    "imageUrl": "",
    "min_temp": 10,
    "max_temp": 22,
    "colors" : ["blue"],
    "styles": ["plain"],
    "type": "onepiece",
    "spring" : false,
    "summer" : false,
    "autumn" : true,
    "winter" : true
  }
];

const colorMatches = {
  white: {
    3: ["black","green","blue"],
    2: ["cream","camel"],
    1: []
  },
  black: {
    3: ["white","cream","camel"],
    2: ["green"],
    1: ["blue"]
  },
  green: {
    3: ["white"],
    2: ["black","blue"],
    1: ["cream","camel"]
  },
  blue: {
    3: ["white"],
    2: ["green","cream"],
    1: ["black","camel"]
  },
  cream: {
    3: ["black","camel"],
    2: ["blue","white"],
    1: ["green"]
  }
};

let newItem =   {
    "name": "newtop",
    "imageUrl": "",
    "min_temp": 5,
    "max_temp": 20,
    "colors" : ["blue"],
    "styles": ["plain"],
    "type": "top",
    "spring" : true,
    "summer" : true,
    "autumn" : true,
    "winter" : true
  }

matchPath(newItem, tops, bottoms, outer) 

