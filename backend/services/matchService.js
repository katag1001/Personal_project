const colorMatches = require('../utils/colorMatches');



function matchPath(newItem, tops, bottoms, outer) {
    let finalMatches = [];
    
    // Rule 1: One-piece matches
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
        finalMatches.push(result);
        finalMatches = finalMatches.concat(matchSeason(newItem, outer));
    }
    
    // Rule 2: Top and Bottom logic
    if (newItem.type === "top") {
        const twoPieceMatches = matchSeason(newItem, bottoms);
        finalMatches = finalMatches.concat(twoPieceMatches);
        // Find outer for each two-piece match
        twoPieceMatches.forEach(twoPiece => {
            finalMatches = finalMatches.concat(matchSeason(twoPiece, outer));
        });
    } else if (newItem.type === "bottom") {
        const twoPieceMatches = matchSeason(newItem, tops);
        finalMatches = finalMatches.concat(twoPieceMatches);
        // Find outer for each two-piece match
        twoPieceMatches.forEach(twoPiece => {
            finalMatches = finalMatches.concat(matchSeason(twoPiece, outer));
        });
    }

    // Rule 3: Outerwear logic
    if (newItem.type === "outerwear") {
        // Find tops and bottoms that match the outerwear's seasons/styles
        const topsThatMatch = matchSeason(newItem, tops);
        const bottomsThatMatch = matchSeason(newItem, bottoms);
        // Combine them into three-piece matches
        topsThatMatch.forEach(tempTopMatch => {
            const finalMatchesForTop = matchSeason(tempTopMatch, bottoms);
            finalMatches = finalMatches.concat(finalMatchesForTop);
        });
        bottomsThatMatch.forEach(tempBottomMatch => {
            const finalMatchesForBottom = matchSeason(tempBottomMatch, tops);
            finalMatches = finalMatches.concat(finalMatchesForBottom);
        });
    }

    // Filter out temporary matches before returning
    return finalMatches.filter(m => m.type === "match");
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
    let matches = [];
    for (const item of matchItems) {
        const combinedStyles = [newItem.style, item.style];
        const patternedCount = combinedStyles.filter(s => s === "patterned").length;

        if (patternedCount <= 1) {
            matches = matches.concat(matchColor(newItem, [item]));
        }
    }
    return matches;
}

function matchColor(newItem, matchItems) {
    let matches = [];
    for (let item of matchItems) {
        let scoreSum = 0;
        let matchCount = 0;
        const newItemMatchesAll = newItem.colors.every(color1 => item.colors.some(color2 => getColorScore(color1, color2) > 0));
        const itemMatchesAll = item.colors.every(color2 => newItem.colors.some(color1 => getColorScore(color1, color2) > 0));

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
            
            let overrides = {};
            if (newItem.type === "top" && item.type === "bottom") {
                overrides = {
                    top: newItem.name,
                    bottom: item.name,
                    styles: [newItem.style, item.style],
                };
            } else if (newItem.type === "bottom" && item.type === "top") {
                overrides = {
                    top: item.name,
                    bottom: newItem.name,
                    styles: [newItem.style, item.style],
                };
            } else if (newItem.type === "outerwear" && item.type === "top") {
                // This is a temporary match, not to be pushed immediately
                overrides = {
                    top: item.name,
                    outer: newItem.name,
                    styles: [item.style, newItem.style],
                    type: "temp-match" // Use a temporary type
                };
            } else if (newItem.type === "temp-match" && item.type === "bottom") {
                overrides = {
                    top: newItem.top,
                    bottom: item.name,
                    outer: newItem.outer,
                    styles: [...(newItem.styles || []), item.style],
                    type: "match" // Convert to final match type
                };
            } else if (newItem.type === "match" && newItem.top && newItem.bottom && !newItem.outer && item.type === "outerwear") {
                overrides = {
                    top: newItem.top,
                    bottom: newItem.bottom,
                    outer: item.name,
                    styles: [...(newItem.styles || []), item.style],
                };
            } else if (newItem.type === "match" && newItem.outer && !newItem.bottom && item.type === "bottom") {
                overrides = {
                    top: newItem.top,
                    bottom: item.name,
                    outer: newItem.outer,
                    styles: [...(newItem.styles || []), item.style],
                };
            } else if (newItem.type === "onepiece" && item.type === "outerwear") {
                overrides = {
                    outer: item.name,
                    onepiece: newItem.name,
                    colors: [...new Set([...(newItem.colors || []), ...(item.colors || [])])],
                    styles: [newItem.style, item.style],
                };
            }
            
            const newMatch = createResult(newItem, item, allColors, averageScore, overrides);
            matches.push(newMatch);
        }
    }
    return matches;
}

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

function createResult(newItem, matchItem, allColors, averageScore, overrides) {
    const min_temp = (newItem.min_temp + matchItem.min_temp) / 2;
    const max_temp = (newItem.max_temp + matchItem.max_temp) / 2;
    
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


module.exports = {
    matchPath,
};