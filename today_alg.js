/*"last_worn_outfit": new Date("2023-09-22").getTime()*/


const min_temp_today = 12
const max_temp_today = 24
const currentSeason = "spring" 

const matches = [{
    "top": 'match1', 
    "bottom": 'Wide Blue Jeans', 
    "outer": 'Camel coat',
    "colors": ['blue', 'cream', 'green', "camel"],
    "colorScore" : 3,
    "min_temp" : 13,
    "max_temp" : 24,
    "style" : "plain",
    "style2" : "plain",
    "spring" : true,
    "summer" : false,
    "autumn" : true,
    "winter" : true,
    "type" : "match",
    "last_worn_outfit" : "2025-09-22T00:00:00.000Z"
    },
    {
    "top": 'match2', 
    "bottom": 'Wide Blue Jeans', 
    "colors": ['blue', 'cream', 'green'],
    "colorScore" : 2,
    "min_temp" : 13,
    "max_temp" : 24,
    "style" : "plain",
    "style2" : "plain",
    "spring" : true,
    "summer" : false,
    "autumn" : true,
    "winter" : true,
    "type" : "match",
    "last_worn_outfit" : "2025-09-21T00:00:00.000Z"
    },
    {
    "top": 'match3', 
    "bottom": 'Black pants', 
    "outer": 'Camel coat',
    "colors": ['black', 'cream', "camel"],
    "colorScore" : 2,
    "min_temp" : 12,
    "max_temp" : 19,
    "style" : "plain",
    "style2" : "plain",
    "spring" : true,
    "summer" : false,
    "autumn" : true,
    "winter" : false,
    "type" : "match",
    "last_worn_outfit" : "2025-08-19T00:00:00.000Z"
    },
    {
    "top": 'match4', 
    "bottom": 'Black pants',  
    "colors": ['black', 'cream'],
    "colorScore" : 1,
    "min_temp" : 15,
    "max_temp" : 22,
    "style" : "plain",
    "style2" : "plain",
    "spring" : true,
    "summer" : false,
    "autumn" : true,
    "winter" : false,
    "type" : "match",
    "last_worn_outfit" : "2025-08-16T00:00:00.000Z"
    }
]

const todayArray = []

/* Push through the matches according to temp & season */
function filterMatches(matches) {
    matches.forEach(match => {
        const withinTempRange = match.min_temp >= min_temp_today && match.max_temp <= max_temp_today;
        const matchesSeason = match[currentSeason] === true;

        if (withinTempRange && matchesSeason) {
            todayArray.push(match);
        }
    });
    organiseMatches(todayArray)
}

function organiseMatches(todayArray) {
    const today = new Date();
    const twentyDaysAgo = new Date(today);
        twentyDaysAgo.setDate(today.getDate() - 20);

    const oldMatches = [];
    const recentMatches = [];

    todayArray.forEach(match => {
        const lastWornDate = new Date(match.last_worn_outfit);
            if (lastWornDate <= twentyDaysAgo) {
                oldMatches.push(match);
            } else {
                recentMatches.push(match);
            }
        });


    oldMatches.sort((a, b) => b.colorScore - a.colorScore);

    recentMatches.sort((a, b) => new Date(a.last_worn_outfit) - new Date(b.last_worn_outfit));

    
    let orderedMatches = [...oldMatches, ...recentMatches];

    todayArray.length = 0;
    todayArray.push(...orderedMatches);

    return todayArray;
}



filterMatches(matches)