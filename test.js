const matches = [];

function matchPath(newItem, tops, bottoms, outer, onepiece) {
  let matchItem;

  if (newItem.type === "onepiece") {
    const result = {
      top: null,
      bottom: null,
      outer: null,
      onepiece: newItem.name,
      colors: newItem.colors,
      colorScore: null, // removed scoring
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
      colorMatch(newItem, item);
    }
  }
}

function colorMatch(newItem, matchItem) {
  const combinedColors = [...new Set([...newItem.colors, ...matchItem.colors])];

  if (matching(combinedColors)) {
    pushResult(newItem, matchItem, combinedColors);
  }
  
  function matching(combinedColors) {
  return colorPalettes.some(palette =>
    combinedColors.every(color => palette.includes(color))
  );
}

}

function pushResult(newItem, matchItem, combinedColors) {
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
    matchPath(result, tops, bottoms, outer);

  } else if (newItem.type === "outerwear") {
    const result = createResult({
      top: matchItem.name,
      outer: newItem.name,
      styles: [matchItem.style, newItem.style],
    });
    matches.push(result);
    matchPath(result, tops, bottoms, outer);

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



const tops = [
  {
    "name": "Green paisley shirt",
    "imageUrl": "",
    "min_temp": 18,
    "max_temp": 28,
    "colors": ["cream", "sage green"],
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
    "colors": ["dusty rose", "soft white"],
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
    "colors": ["navy"],
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
    "colors" : ["navy"],
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
    "colors" : ["soft white", "warm gray"],
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
    "colors": ["soft white"],
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
    "colors": ["terracotta"],
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
    "colors" : ["soft white", "dusty rose"],
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
    "colors" : ["sage green"],
    "style": "plain",
    "type": "onepiece",
    "spring" : false,
    "summer" : false,
    "autumn" : true,
    "winter" : true
  }
];


const colorPalettes = [ 
  ["navy", "soft white", "warm gray", "sage green", "dusty rose"], 
  ["navy", "warm gray", "sage green", "mustard", "terracotta"], 
  ["warm gray", "sage green", "mustard", "terracotta", "cream"], 
  ["sage green", "mustard", "terracotta", "cream", "dusty rose"]
];


/// For testing

let newItem =   {
    "name": "newtop",
    "imageUrl": "",
    "min_temp": 5,
    "max_temp": 20,
    "colors" : ["navy"],
    "style": "plain",
    "type": "top",
    "spring" : true,
    "summer" : false,
    "autumn" : true,
    "winter" : true
  }

matchPath(newItem, tops, bottoms, outer) 

