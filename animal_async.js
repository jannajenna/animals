"use strict";

window.addEventListener("DOMContentLoaded", start);
//global variables
let allAnimals = [];

const settings = {
    filterBy: "all",
    sortBy: "name",
    sortDir: "asc"
};


// The prototype for all animals: 
const Animal = {
    name: "",
    desc: "-unknown animal-",
    type: "",
    age: 0,
};

function start() {
    console.log("ready");

    loadJSON();

    //TODO: add event-listeners to filter and sort buttons
    registerButtons();
}

function registerButtons() {
    document.querySelectorAll("[data-action='filter']").forEach(button => button.addEventListener("click", selectFilter));

    document.querySelectorAll("[data-action='sort']").forEach(button => button.addEventListener("click", selectSort));
}

/* load JSON */
async function loadJSON() {
    const response = await fetch("animals.json");
    const jsonData = await response.json();

    // when loaded, prepare data objects
    prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
    allAnimals = jsonData.map(prepareObject);

    //console.log(allAnimals)

    // fixed so we filter and sort on the first load
    /* buildList(); */
    displayList(allAnimals);
}

/* clean data */
function prepareObject(jsonObject) {
    const animal = Object.create(Animal);

    const texts = jsonObject.fullname.split(" ");
    animal.name = texts[0];
    animal.desc = texts[2];
    animal.type = texts[3];
    animal.age = jsonObject.age;

    return animal;
}

/* filtering */
function selectFilter(event) {
    const filter = event.target.dataset.filter;
    console.log(`User selected ${filter}`);
    setFilter(filter);
}

function setFilter(filter) {
    settings.filterBy = filter;
    buidList();
}

function filterList(filteredList) {
    //let filteredList = allAnimals;
    if (settings.filterBy === "cat") {
        //filter list only cats
        filteredList = allAnimals.filter(isCat);
    } else if (settings.filterBy === "dog") {
        //filter list only dogs
        filteredList = allAnimals.filter(isDog);
    }

    //displayList(filteredList);
    return filteredList;
}

function isCat(animal) {
    return animal.type === "cat"
}

function isDog(animal) {
    return animal.type === "dog"
}


/* sorting */
function selectSort(event) {
    const sortBy = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDirection;

    //toggle the diretion
    if (sortDir === "asc") {
        event.target.dataset.sortDirection = "desc";
    } else {
        event.target.dataset.sortDirection = "asc";
    }
    console.log(`User selected ${sortBy} - ${sortDir}`);
    setSort(sortBy, sortDir);
};

function setSort(sortBy, sortDir) {
    settings.sortBy = sortBy;
    settings.sortDir = sortDir;

    buidList();
}

function sortList(sortedList) {
    //let sortedList = allAnimals;
    /*  if (sortBy === "name") {
         sortedList = sortedList.sort(sortByName);
     } else if (sortBy === "type") {
         sortedList = sortedList.sort(sortByType);
     } */

    let direction = 1

    if (settings.sortDir === "desc") {
        direction = 1
    } else {
        settings.direction = -1
    }

    sortedList = sortedList.sort(sortByProperty);

    function sortByProperty(animalA, animalB) {
        //console.log(`sortBy is ${sortBy}`);
        if (animalA[settings.sortBy] < animalB[settings.sortBy]) {
            return -1 * direction
        } else {
            return 1 * direction
        }
    }

    return sortedList;
};

/* function sortByType(animalA, animalB) {
    if (animalA.type < animalB.type) {
        return -1
    } else {
        return 1
    }
} */

/* the list */

function buidList() {
    const currentList = filterList(allAnimals);
    const sortedList = sortList(currentList);

    displayList(sortedList);
}

function displayList(animals) {
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";

    // build a new list
    animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
    // create clone
    const clone = document.querySelector("template#animal").content.cloneNode(true);

    // set clone data
    clone.querySelector("[data-field=name]").textContent = animal.name;
    clone.querySelector("[data-field=desc]").textContent = animal.desc;
    clone.querySelector("[data-field=type]").textContent = animal.type;
    clone.querySelector("[data-field=age]").textContent = animal.age;

    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
}