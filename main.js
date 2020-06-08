let clickLog = [];
let searchLog = 0;
let background = document.getElementById('resultsSection');
let searchItems = [];
let menuonoff = 0;
var defaults = [];
var criteria = {};
let menuitem = document.getElementsByClassName('option');
let searchButton = document.getElementById('search');
let menuitems = document.getElementsByClassName('option').length;
let viewboxes = document.getElementsByClassName('view-box');
let selectorbox = document.getElementsByClassName('selectorbox');
let resultsButtons = document.getElementById('resultsButtons');
let headlines = document.getElementsByClassName('headline');
let details = document.getElementsByClassName('details');
let descriptions = document.getElementsByClassName('description');
let city = document.getElementsByClassName('location');
let sortedResults = [];
let sortOnOff = 0;
let allBrands = [];
let brands = [];
let allTypes = [];
let types = [];
let allEngines = [];
let engines = [];
let allFuel = [];
let fuel = [];
let allLocations = [];
let locations = [];
let regions = ["South East", "South West", "West Midlands", "East Midlands", "East of England", "London", "Yorkshire & Humber", "North East", "North West"]
let allMileage = [];
let mileagemenu = ["Up to 10K", "Up to 20K", "Up to 30K", "Up to 40K", "Up to 50K", "More than 50K"];
let thecars = [],
    mainObj = {};




let showObj = () => {
    for (let prop in mainObj) {
        console.log(prop)
        console.log(mainObj[prop]);
    };
}

let h = new Headers();
h.append('secret-key', '$2b$10$IEb9LQX7gomOCxwH8cmO9eVcP3T.k5diU8lTvvsBuyrnuhUcxfq9O')

let req = new Request('https://api.jsonbin.io/b/5ede1ae0655d87580c4617fa', {
    method: 'GET',
    headers: h,
}
)

fetch(req)
    .then( (resp) => {
        return resp.json();
    })
    .then( (data) => {
        thecars = data.allcars
        mainObj = data;
        showObj();
        makeparameters();
        
    }
);

function makeparameters() {
    makeparameter(allBrands, brands, 0);
    makeparameter(allTypes, types, 1);
    makeparameter(allEngines, engines, 2);
    makeparameter(allFuel, fuel, 3);
    makeparameter(allLocations, locations, 4);
}

function makeparameter(allsubject, subject, n) {
    if (n == 0) {
        for (let i = 0; i < thecars.length; i++) {
            allsubject.push(thecars[i].Brand)
        }
    }
    else if (n == 1) {
        for (let i = 0; i < thecars.length; i++) {
            allsubject.push(thecars[i].Type)
        }
    }
    else if (n == 2) {
        for (let i = 0; i < thecars.length; i++) {
            allsubject.push(thecars[i].EngineSize)
        }
    }
    else if (n == 3) {
        for (let i = 0; i < thecars.length; i++) {
            allsubject.push(thecars[i].Fuel)
        }
    }
    else if (n == 4) {
        for (let i = 0; i < thecars.length; i++) {
            allsubject.push(thecars[i].Location)
        }
    }
    for (let i = 0; i < allsubject.length; i++) {
        if (subject.indexOf(allsubject[i]) === -1) {
            subject.push(allsubject[i]);
        }
    }
}

function addremovemenu(subject, pos) { 
    if (menuonoff == 0 && menuitems == 0) {
        for (let i = 0; i < subject.length; i++) {
            selectorbox[pos].insertAdjacentHTML("beforeend", `<div class="option">
            <input
            type="radio"
            class="radio"
            id="${subject[i]}"
            name="brand"
            />
            <label for="${subject[i]}">${subject[i]}</label>
            </div>`)
            menuitem[i].addEventListener("click", () => {
                viewboxes[pos].innerHTML = `<i class="fa fa-angle-down" style="font-size:24px"></i>`
                viewboxes[pos].insertAdjacentHTML("beforeend", menuitem[i].innerHTML.toString());
                var elements = document.getElementsByClassName("option");
                while (elements[0]) {
                elements[0].parentNode.removeChild(elements[0]);
                }
                menuonoff -= 1;
                if (typeof criteria[pos] !== 'undefined' && clickLog.indexOf(pos) !== -1) {
                   delete criteria[pos]; 
                }
                if (viewboxes[pos].innerText !== defaults[pos]) {
                    criteria[pos] = viewboxes[pos].innerText;
                }
                searchButton.innerText = "Search";
                searchItems = [];
                thecars.filter(search);
                console.log(searchItems);
                if (searchItems.length !== 0) {
                searchButton.insertAdjacentHTML("beforeend",` (${searchItems.length} results)`);
                }
            })
        }
        menuonoff += 1
    }
    else if (menuonoff == 1 || menuitems > 0) {
        var elements = document.getElementsByClassName("option");
        while (elements[0]) {
        elements[0].parentNode.removeChild(elements[0]);
        }
        menuonoff -= 1;
    }
}

function clickLogCheck(pos) {
    for (let i = 0; i <= clickLog.length;) {
        if (clickLog[i] == pos) {return true}
        else {i++}
    }
}

function menuUpDown (subject, pos) {
    if (clickLogCheck(pos) === true) {
        addremovemenu(subject, pos);
        searchButton.innerText = "Search";
    }
    else {
        clickLog.push(pos);
        if (pos !== 4) {
            subject.sort();
            subject.unshift(viewboxes[pos].innerText.toString());
            addremovemenu(subject, pos);
        }
        else {
            subject.unshift(viewboxes[pos].innerText.toString());
            addremovemenu(subject, pos);
        }
    }
}

function addviewboxClick(subject, pos) {
    viewboxes[pos].addEventListener("click", () => {
        menuUpDown(subject, pos);
    })
}
addviewboxClick(brands, 0);
addviewboxClick(engines, 1);
addviewboxClick(fuel, 2);
addviewboxClick(types, 3);
addviewboxClick(mileagemenu, 4);
addviewboxClick(regions, 5);

function storeDefaults() {
    for (let i = 0; i < viewboxes.length; i++) {
        defaults.push(viewboxes[i].innerText);
    }
}
storeDefaults();

function search(value) {
    let score = 0;
    if (Object.keys(criteria).length > 0) {
        for (let i = 0; i < Object.keys(criteria).length; i++) {
            if (Object.keys(criteria)[i] == 4 && checkMileage(value).search(Object.values(criteria)[i]) > -1) {
                score += 1
            }
            else if (Object.values(criteria)[i] == Object.values(value)[Object.keys(criteria)[i]]) {
                score += 1;
            }
            if (score == Object.keys(criteria).length) {
                searchItems.push(value);
            }
        }
    }
}

function checkMileage(value) {
    let subject = parseInt(Object.values(value)[4]);
    if (subject < 10000) {
        return "Up to 10KUp to 20KUp to 30KUp to 40KUp to 50K";
    }
    else if (subject < 20000) {
        return "Up to 20KUp to 30KUp to 40KUp to 50K";
    }
    else if (subject < 30000) {
        return "Up to 30KUp to 40KUp to 50K";
    }
    else if (subject < 40000) {
        return "Up to 40KUp to 50K";
    }
    else if (subject < 50000) {
        return "Up to 50K";
    }
    else if (subject > 50000) {
        return "More than 50K";
    }
}

function makemileage(figure) {
if (figure.length > 3) {
let comma = ",";
let pos = figure.length - 3;
let output = figure.slice(0, pos) + comma + figure.slice(pos, figure.length);
return output;
}
else {return figure}
}

searchButton.addEventListener("click", () => {
    background.style.height = parseInt(0) + "px";
    if (searchItems.length == 0) {
        alert("Please adjust your search criteria.")
    }
    let resultTiles = document.getElementsByClassName("resultx");
    while (resultTiles[0]) {
        resultTiles[0].parentNode.removeChild(resultTiles[0]);
    }
    if (searchLog > 0) {
        (document.getElementById('sort')).innerHTML = `Sort by...<i class="fa fa-angle-down" style="font-size:24px"></i>`
    }
    else {
    resultsButtons.insertAdjacentHTML("beforeend",`<div id="sort">Sort by...<i class="fa fa-angle-down" style="font-size:24px"></i></div>`)
    sortMenu();
    }
    background.style.paddingTop = "10px";
    for (let i = 0; i < searchItems.length; i++) {
        background.insertAdjacentHTML("beforeend",
        `<div class="resultx">
            <div class="row">
                <div class="resultTile">
                    <div class="img"></div>
                    <div class="headline">${searchItems[i].Brand}</div>
                    <div class="details">${searchItems[i].Type} | ${makemileage(searchItems[i].Mileage)} miles | ${searchItems[i].EngineSize} | ${searchItems[i].Fuel}</div>
                    <div class="description">${(searchItems[i].Desc).substring(0,150)}...</div>
                    <div class="price">£XXX</div>
                    <div class="vline"></div>
                    <div class="locationData">
                    <div class="location">${searchItems[i].Location}</div>
                    <div class="hline"></div>
                    <div class="distance">X miles from you</div>
                    </div>
                </div>
            </div>
            <div class="price"></div>
        </div>`)
        let heightplus = background.offsetHeight;
        background.style.height = parseInt(heightplus + 240) + "px"
    }
    searchLog += 1;
})
function sortMenu() {
let sort = document.getElementById('sort');
let sortBy = ["Mileage (Highest)", "Mileage (Lowest)"];
sort.addEventListener("click", () => {
    if (sortOnOff == 0) {
        sortOnOff += 1;
        for (let i = 0; i < sortBy.length; i++) {
            sort.insertAdjacentHTML("beforeend", `<div class="option">
            <input
            type="radio"
            class="radio"
            id="${sortBy[i]}"
            name="brand"
            />
            <label for="${sortBy[i]}">${sortBy[i]}</label>
            </div>`)
            menuitem[i].addEventListener("click", () => {
                sort.innerHTML = `<i class="fa fa-angle-down" style="font-size:24px"></i>`
                sort.insertAdjacentHTML("beforeend", sortBy[i]);
                resultsHighLow();
                for (let i = 0; i <searchItems.length; i++) {
                    headlines[i].innerText = searchItems[i].Brand;
                    details[i].innerText = `${searchItems[i].Type} | ${makemileage(searchItems[i].Mileage)} miles | ${searchItems[i].EngineSize} | ${searchItems[i].Fuel}`
                    descriptions[i].innerText = `${(searchItems[i].Desc).substring(0,150)}...`;
                    city[i].innerText = searchItems[i].Location;
                }
            })
        }
    }
    else if (sortOnOff == 1) {
        sortOnOff -= 1;
        var elements = document.getElementsByClassName("option");
        while (elements[0]) {
        elements[0].parentNode.removeChild(elements[0]);
        }
    }
})
}
function resultsHighLow() {
    if (sort.innerText == "Mileage (Lowest)") {
    searchItems.sort( (a, b)=>{
    if (parseInt(a.Mileage) > parseInt(b.Mileage)) return 1;
    else if (parseInt(b.Mileage) > parseInt(a.Mileage)) return -1;
    else return 0})
    }
    else if (sort.innerText == "Mileage (Highest)") {
    searchItems.sort( (a, b)=>{
    if (parseInt(a.Mileage) < parseInt(b.Mileage)) return 1;
    else if (parseInt(b.Mileage) < parseInt(a.Mileage)) return -1;
    else return 0})
    }
    return searchItems;
};