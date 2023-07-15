
// This is defined in the xhtml file
var listingUrl;
const latestUrl = listingUrl.substring(0, listingUrl.length - 5) + ".latest.json";

const makeElem = (parent, elemName, callback) => {
  const elem = document.createElement(elemName);
  callback(elem);
  parent.appendChild(elem);
  return elem;
};

const getJson = (url, callback) => {
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

let listing;
let latestVersions;
let initialized = false;
const entries = [];

const loadListing = () => {
  if (initialized || listing == undefined || latestVersions == undefined)
    return;
  initialized = true;

  document.getElementById("internalName").innerText = listing.id;

  const tableBody = document.getElementById("tableBody");
  let i = 0;
  for (const packageName in listing.packages)
  {
    const latestInfo = latestVersions[packageName];
    const packageJson = listing.packages[packageName].versions[latestInfo.version];

    const date = new Date(latestInfo.updateDate);
    const pad = v => `0${v}`.slice(-2);
    // Apparently getMonth is 0 based, but getDate is 1 based. Fair enough I suppose.
    const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} `
      + `${pad(date.getHours())}:${pad(date.getMinutes())}`;

    const entry = {
      initialIndex: i,
      name: packageJson.displayName,
      updatedOn: dateStr,
    };
    entries[i] = entry;
    i++;

    entry.rowElem = makeElem(tableBody, "tr", tr => {
      tr.className = "packageEntry";
      makeElem(tr, "td", td => {
        makeElem(td, "a", a => {
          a.setAttribute("href", latestInfo.repoUrl);
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

var startLoadListing = () => {
  getJson(listingUrl, obj => {
    listing = obj;
    loadListing();
  });
  getJson(latestUrl, obj => {
    latestVersions = obj;
    loadListing();
  });
};

let lastSortWasName = false;
let lastSortWasUpdatedOn = false;
let sortDir = 1;

const up = "▲";
const down = "▼";
const line = "━";

const updateTitles = () => {
  document.getElementById("nameHeader").innerText
    = "Name " + (lastSortWasName ? (sortDir == 1 ? up : down) : line);
  document.getElementById("updatedOnHeader").innerText
    = "Updated On " + (lastSortWasUpdatedOn ? (sortDir == 1 ? up : down) : line);
};

const performSort = (getValue) => {
  entries.sort((left, right) => {
    const l = getValue(left);
    const r = getValue(right);
    if(l < r)
      return 1 * sortDir;
    if(l > r)
      return -1 * sortDir;
    return 0;
  });

  const tableBody = document.getElementById("tableBody");
  for (const i in entries)
    tableBody.insertAdjacentElement("afterbegin", entries[i].rowElem);
};

var toggleNameSort = () => {
  if (!initialized)
    return;

  sortDir = lastSortWasName ? -sortDir : 1;
  performSort(entry => entry.name);
  lastSortWasUpdatedOn = false;
  lastSortWasName = true;
  updateTitles();
};

var toggleUpdatedOnSort = () => {
  if (!initialized)
    return;

  sortDir = lastSortWasUpdatedOn ? -sortDir : 1;
  performSort(entry => entry.updatedOn);
  lastSortWasName = false;
  lastSortWasUpdatedOn = true;
  updateTitles();
};
