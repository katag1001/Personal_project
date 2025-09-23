const matches = [];

/* Choose which path to take depending on the piece being inserted */
function matchPath(newItem, tops, bottoms, outer) {
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
      styles: [newItem.style],
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

/* Matching functionalities */
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
  for (const item of matchItems) {
    const combinedStyles = [newItem.style, item.style];
    const patternedCount = combinedStyles.filter(s => s === "patterned").length;

    if (patternedCount <= 1) {
      // Instead of returning here, call matchColor for this pair
      matchColor(newItem, [item]);
    }
  }

  // Since matchColor pushes to matches, no need to return anything here
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

      // Now we just call pushResult
      pushResult(newItem, item, allColors, averageScore);
    }
  }

  return matches;
}

function pushResult(newItem, matchItem, allColors, averageScore) {
  const min_temp = (newItem.min_temp + matchItem.min_temp) / 2;
  const max_temp = (newItem.max_temp + matchItem.max_temp) / 2;

  function createResult(overrides) {
    return {
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
  }

  if (newItem.type === "top" || newItem.type === "bottom") {
    const result = createResult({
      top: newItem.type === "top" ? newItem.name : matchItem.name,
      bottom: newItem.type === "bottom" ? newItem.name : matchItem.name,
      styles: [newItem.style, matchItem.style],  // array of styles
    });
    matches.push(result);
    matchPath(result, tops, bottoms, outer);
  } else if (newItem.type === "outerwear") {
    const result = createResult({
      top: matchItem.name,
      outer: newItem.name,
      styles: [matchItem.style, newItem.style],
    });
    matchPath(result, tops, bottoms, outer);
  } else if (newItem.type === "match" && newItem.top && newItem.bottom && !newItem.outer) {
    const result = createResult({
      top: newItem.top,
      bottom: newItem.bottom,
      outer: matchItem.name,
      styles: [...(newItem.styles || [newItem.style]), matchItem.style],  // combine styles arrays
    });
    matches.push(result);
  } else if (newItem.type === "match" && newItem.outer && !newItem.bottom) {
    const result = createResult({
      top: newItem.top,
      bottom: matchItem.name,
      outer: newItem.outer,
      styles: [...(newItem.styles || [newItem.style]), matchItem.style],
    });
    matches.push(result);
  } else if (newItem.type === "onepiece" && matchItem.type === "outerwear") {
    const combinedColors = [...new Set([...(newItem.colors || []), ...(matchItem.colors || [])])];
    const result = {
      ...createResult({
        outer: matchItem.name,
        onepiece: newItem.name,
        colors: combinedColors,
        styles: [newItem.style, matchItem.style],
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
    "style": "patterned",
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
    "style": "plain",
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
    "style": "patterned",
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
    "style": "plain",
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
    "style": "plain",
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
    "style": "patterned",
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
    "style": "patterned",
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
    "style": "plain",
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
    "style": "patterned",
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
    "style": "plain",
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
    "style": "plain",
    "type": "top",
    "spring" : true,
    "summer" : false,
    "autumn" : true,
    "winter" : true
  }

matchPath(newItem, tops, bottoms, outer) 







