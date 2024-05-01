
// NOTE: I'm no js expert nor web dev expert, take everything you see here with a grain of salt.

// This is defined in the xhtml file
var listingUrl;

// ?nocache=1 isn't actually like an official thing, but apparently when adding anything there,
// like literally anything, it prevents server side caching. Which is good because I don't want to
// be in a situation where I push an update and then I'm not sure when exactly the cache will be
// invalidated, while I'm under pressure. Does not sound like fun.
const actualListingUrl = listingUrl + "?nocache=1";
const latestUrl = listingUrl.substring(0, listingUrl.length - 5) + ".latest.json?nocache=1";

// A fake and incomplete listing and latest info set for use during development.
const devCache = {
  [actualListingUrl]: {
    name: "JanSharp Dummy Packages",
    id: "com.jansharp.dummy",
    url: "some url",
    author: "JanSharp",
    packages: {
      ["com.jansharp.dummy"]: {
        versions: {
          ["0.1.0"]: {
            name: "com.jansharp.dummy",
            version: "0.1.0",
            description: "A wonderful package.",
            displayName: "Dummy Package",
            changelogUrl: "https://github.com/JanSharp/VCCDummyPackage/blob/v0.1.0/CHANGELOG.md",
          },
        },
      },
      ["com.jansharp.fake-world"]: {
        versions: {
          ["0.2.3"]: {
            name: "com.jansharp.fake-world",
            version: "0.2.3",
            description: "Imagine a world. Yea that's it. If you imagine it, it's fake. Got em.",
            displayName: "Fake World",
            changelogUrl: "https://github.com/JanSharp/VCCDummyPackage/blob/v0.2.3/CHANGELOG.md",
          },
        },
      },
      ["com.jansharp.real-world"]: {
        versions: {
          ["1.0.0"]: {
            name: "com.jansharp.real-world",
            version: "1.0.0",
            description: "Hi. Look around you. You are here. Right now. In the real world. "
              + "This package does nothing, as there is nothing left to do. You are already here.",
            displayName: "Real World",
            changelogUrl: "https://github.com/JanSharp/VCCDummyPackage/blob/v1.0.0/CHANGELOG.md",
          },
        },
      },
      ["com.jansharp.zzz"]: {
        versions: {
          ["0.1.0"]: {
            name: "com.jansharp.zzz",
            version: "0.1.0",
            description: "zzz... oh so sleepy... zzz...",
            displayName: "ZZZzzz",
            changelogUrl: "https://github.com/JanSharp/VCCDummyPackage/blob/v0.1.0/CHANGELOG.md",
          },
        },
      },
    },
  },
  // Sorted by version in C#. That way we don't need a js semver library for sorting by version.
  [latestUrl]: [
    {
      name: "com.jansharp.real-world",
      version: "1.0.0",
      updateDate: "1999-01-01T00:00:00+00:00",
    },
    {
      name: "com.jansharp.fake-world",
      version: "0.2.3",
      updateDate: "2023-07-16T11:02:34+00:00",
    },
    {
      name: "com.jansharp.dummy",
      version: "0.1.0",
      updateDate: "2023-05-23T03:24:19+00:00",
    },
    {
      name: "com.jansharp.zzz",
      version: "0.1.0",
      updateDate: "2022-11-23T10:54:06+00:00",
    },
  ],
};

const makeElem = (parent, elemName, callback) => {
  const elem = document.createElement(elemName);
  callback(elem);
  parent.appendChild(elem);
  return elem;
};

const getJson = (url, callback) => {
  if (devCache[url] != undefined)
  {
    callback(devCache[url]);
    return;
  }
  console.debug("No dev cache for the url " + url);
  return;

  const request = new XMLHttpRequest();
  request.onload = () => {
    callback(JSON.parse(request.responseText));
  };
  request.onerror = () => {
    document.getElementById("errorOutput").innerHTML = "Unable to get listing json.";
  };
  request.open("GET", url);
  request.send();
};

const repoUrlRegex = new RegExp("^https://github\.com/[^/]+/[^/]+");

let listing;
let latestVersions;
let initialized = false;
const entries = [];

const loadListing = () => {
  if (initialized || listing == undefined || latestVersions == undefined)
    return;
  initialized = true;
  document.getElementById("loading").innerText = "";

  document.getElementById("listingId").innerText = listing.id;

  const tableBody = document.getElementById("tableBody");
  let i = 0;
  for (const latestInfo of latestVersions)
  {
    const packageJson = listing.packages[latestInfo.name].versions[latestInfo.version];

    const date = new Date(latestInfo.updateDate);
    const pad = v => `0${v}`.slice(-2);
    // Apparently getMonth is 0 based, but getDate is 1 based. Fair enough I suppose.
    const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} `
      + `${pad(date.getHours())}:${pad(date.getMinutes())}`;

    const entry = {
      initialIndex: i,
      name: packageJson.displayName,
      description: packageJson.description,
      id: packageJson.name,
      updatedOn: dateStr,
    };
    entries[i] = entry;
    i++;

    entry.rowElem = makeElem(tableBody, "tr", tr => {
      tr.className = "packageEntry";
      makeElem(tr, "td", td => {
        makeElem(td, "a", a => {
          a.setAttribute("href", packageJson.changelogUrl.match(repoUrlRegex)[0]);
          a.innerText = packageJson.displayName;
        });
      });
      makeElem(tr, "td", td => {
        td.className = "description";
        if (packageJson.description != undefined)
          td.innerText = packageJson.description;
      });
      makeElem(tr, "td", td => {
        makeElem(td, "code", code => {
          code.innerText = packageJson.name;
        });
      });
      makeElem(tr, "td", td => {
        makeElem(td, "code", code => {
          code.innerText = packageJson.version;
        });
      });
      makeElem(tr, "td", td => {
        td.innerText = dateStr;
        td.setAttribute("title", latestInfo.updateDate + " (git tag creation time)");
      });
      makeElem(tr, "td", td => {
        makeElem(td, "a", a => {
          a.setAttribute("href", packageJson.changelogUrl);
          // If I wanted it to open in a new tab.
          // cSpell:ignore noopener, noreferrer
          // a.setAttribute("target", "_blank");
          // a.setAttribute("rel", "noopener noreferrer");
          a.innerText = "Changelog";
        });
      });
    });
  }

  toggleNameSort();
};

let initSorting;

var startLoadListing = () => {
  initSorting();

  getJson(actualListingUrl, obj => {
    listing = obj;
    loadListing();
  });
  getJson(latestUrl, obj => {
    latestVersions = obj;
    loadListing();
  });
};

let nameHeader;
let descriptionHeader;
let idHeader;
let versionHeader;
let updatedOnHeader;

let nameHeaderText;
let descriptionHeaderText;
let idHeaderText;
let versionHeaderText;
let updatedOnHeaderText;

initSorting = () => {
  nameHeader = document.getElementById("nameHeader");
  descriptionHeader = document.getElementById("descriptionHeader");
  idHeader = document.getElementById("idHeader");
  versionHeader = document.getElementById("versionHeader");
  updatedOnHeader = document.getElementById("updatedOnHeader");

  nameHeaderText = nameHeader.innerText;
  descriptionHeaderText = descriptionHeader.innerText;
  idHeaderText = idHeader.innerText;
  versionHeaderText = versionHeader.innerText;
  updatedOnHeaderText = updatedOnHeader.innerText;
};

let lastSortColumn;
let sortDir;

const up = "▲";
const down = "▼";
const line = "━";

const updateTitles = () => {
  nameHeader.innerText = nameHeaderText + " "
    + (lastSortColumn == "name" ? (sortDir == 1 ? up : down) : line);
  descriptionHeader.innerText = descriptionHeaderText + " "
    + (lastSortColumn == "description" ? (sortDir == 1 ? up : down) : line);
  idHeader.innerText = idHeaderText + " "
    + (lastSortColumn == "id" ? (sortDir == 1 ? up : down) : line);
  // NOTE: up and down are inverted because the highest version has the lowest initialIndex
  versionHeader.innerText = versionHeaderText + " "
    + (lastSortColumn == "initialIndex" ? (sortDir == 1 ? down : up) : line);
  updatedOnHeader.innerText = updatedOnHeaderText + " "
    + (lastSortColumn == "updatedOn" ? (sortDir == 1 ? up : down) : line);
};

const performSort = (columnName, initialSortDir) => {
  if (!initialized)
    return;

  sortDir = lastSortColumn == columnName ? -sortDir : initialSortDir;
  lastSortColumn = columnName;

  entries.sort((left, right) => {
    const l = left[columnName];
    const r = right[columnName];
    if (l < r)
      return -1 * sortDir;
    if (l > r)
      return 1 * sortDir;

    // Use name as the fallback.
    const lName = left.name;
    const rName = right.name;
    if (lName < rName)
      return -1 * sortDir;
    if (lName > rName)
      return 1 * sortDir;

    return 0;
  });

  const tableBody = document.getElementById("tableBody");
  for (const i in entries)
    tableBody.insertAdjacentElement("beforeend", entries[i].rowElem);

  updateTitles();
};

var toggleNameSort = () => performSort("name", 1);
var toggleDescriptionSort = () => performSort("description", 1);
var toggleIdSort = () => performSort("id", 1);
var toggleVersionSort = () => performSort("initialIndex", 1);
var toggleUpdatedOnSort = () => performSort("updatedOn", -1);
