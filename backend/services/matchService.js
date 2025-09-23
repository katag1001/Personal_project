const colorMatches = require('../utils/colorMatches');

let allTops, allBottoms, allOuter, allOnepieces;

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

function pushResult(matches, newItem, matchItem, allColors, averageScore) {
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
            styles: [newItem.style, matchItem.style],
        });
        matches.push(result);
        matchPath(result, allTops, allBottoms, allOuter, allOnepieces, matches);
    } else if (newItem.type === "outerwear") {
        const result = createResult({
            top: matchItem.name,
            outer: newItem.name,
            styles: [matchItem.style, newItem.style],
        });
        matchPath(result, allTops, allBottoms, allOuter, allOnepieces, matches);
    } else if (newItem.type === "match" && newItem.top && newItem.bottom && !newItem.outer) {
        const result = createResult({
            top: newItem.top,
            bottom: newItem.bottom,
            outer: matchItem.name,
            styles: [...(newItem.styles || [newItem.style]), matchItem.style],
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

function matchColor(matches, newItem, matchItem) {
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

            pushResult(matches, newItem, item, allColors, averageScore);
        }
    }
}

function matchStyle(matches, newItem, matchItems) {
    for (const item of matchItems) {
        const combinedStyles = [newItem.style, item.style];
        const patternedCount = combinedStyles.filter(s => s === "patterned").length;

        if (patternedCount <= 1) {
            matchColor(matches, newItem, [item]);
        }
    }
}

function matchSeason(matches, newItem, matchItem) {
    const seasonalMatches = matchItem.filter(item =>
        (item.spring && newItem.spring) ||
        (item.summer && newItem.summer) ||
        (item.autumn && newItem.autumn) ||
        (item.winter && newItem.winter)
    );
    matchStyle(matches, newItem, seasonalMatches);
}

function matchPath(newItem, tops, bottoms, outer, onepieces, matches = []) {
    allTops = tops;
    allBottoms = bottoms;
    allOuter = outer;
    allOnepieces = onepieces;

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
        matchSeason(matches, newItem, allOuter);
    } else if (newItem.type === "top") {
        matchSeason(matches, newItem, allBottoms);
    } else if (newItem.type === "bottom") {
        matchSeason(matches, newItem, allTops);
    } else if (newItem.type === "outerwear") {
        matchSeason(matches, newItem, allTops);
    } else if (newItem.type === "match" && newItem.top && newItem.bottom && !newItem.outer) {
        matchSeason(matches, newItem, allOuter);
    } else if (newItem.type === "match" && newItem.outer && !newItem.bottom) {
        matchSeason(matches, newItem, allBottoms);
    }

    return matches;
}

module.exports = {
    matchPath,
};