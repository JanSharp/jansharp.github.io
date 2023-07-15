
// This is defined in the xhtml file
var listingUrl;
const latestUrl = listingUrl.substring(0, listingUrl.length - 5) + ".latest.json";

// const devCache = {
//   [listingUrl]: JSON.parse('{  "name": "JanSharp Dummy Packages",  "id": "com.jansharp.dummy",  "url": "https://gist.githubusercontent.com/JanSharp/f8e5bf0bc971c99cdbaa59039a1efe4d/raw/dummylisting.json",  "author": "steinmeister36@gmail.com",  "packages": {    "com.jansharp.foo": {      "versions": {        "0.1.0": {          "name": "com.jansharp.foo",          "version": "0.1.0",          "description": "A truly wonderful dummy package too. Also there is a bit more to say about this one because there is so much content in here, it is incredible.",          "displayName": "Foo",          "unity": "2019.4",          "author": {            "name": "JanSharp",            "email": "steinmeister36@gmail.com",            "url": "https://jansharp.github.io"          },          "license": "MIT",          "vpmDependencies": {            "com.vrchat.udonsharp": "^1.1.x"          },          "url": "https://github.com/JanSharp/VCCDummyPackage/releases/download/v0.1.0/com.jansharp.dummy.zip",          "zipSHA256": "e99d1ef002af478310836a60f6c15a03467a6dd6292124cd1ba61c0f91d70359",          "changelogUrl": "https://github.com/JanSharp/VCCDummyPackage/blob/v0.1.0/CHANGELOG.md"        }      }    },    "com.jansharp.bar": {      "versions": {        "0.1.0": {          "name": "com.jansharp.bar",          "version": "0.1.0",          "description": "A truly wonderful dummy package too.",          "displayName": "Bar",          "unity": "2019.4",          "author": {            "name": "JanSharp",            "email": "steinmeister36@gmail.com",            "url": "https://jansharp.github.io"          },          "license": "MIT",          "vpmDependencies": {            "com.vrchat.udonsharp": "^1.1.x"          },          "url": "https://github.com/JanSharp/VCCDummyPackage/releases/download/v0.1.0/com.jansharp.dummy.zip",          "zipSHA256": "e99d1ef002af478310836a60f6c15a03467a6dd6292124cd1ba61c0f91d70359",          "changelogUrl": "https://github.com/JanSharp/VCCDummyPackage/blob/v0.1.0/CHANGELOG.md"        }      }    },    "com.jansharp.dummy": {      "versions": {        "0.1.0": {          "name": "com.jansharp.dummy",          "version": "0.1.0",          "description": "A truly wonderful dummy package.",          "displayName": "Dummy Package",          "unity": "2019.4",          "author": {            "name": "JanSharp",            "email": "steinmeister36@gmail.com",            "url": "https://jansharp.github.io"          },          "license": "MIT",          "vpmDependencies": {            "com.vrchat.udonsharp": "^1.1.x"          },          "url": "https://github.com/JanSharp/VCCDummyPackage/releases/download/v0.1.0/com.jansharp.dummy.zip",          "zipSHA256": "e99d1ef002af478310836a60f6c15a03467a6dd6292124cd1ba61c0f91d70359",          "changelogUrl": "https://github.com/JanSharp/VCCDummyPackage/blob/v0.1.0/CHANGELOG.md"        },        "0.1.1": {          "name": "com.jansharp.dummy",          "version": "0.1.1",          "description": "A truly wonderful dummy package.",          "displayName": "Dummy Package",          "unity": "2019.4",          "author": {            "name": "JanSharp",            "email": "steinmeister36@gmail.com",            "url": "https://jansharp.github.io"          },          "license": "MIT",          "vpmDependencies": {            "com.vrchat.udonsharp": "^1.1.x"          },          "url": "https://github.com/JanSharp/VCCDummyPackage/releases/download/v0.1.1/com.jansharp.dummy.zip",          "zipSHA256": "ed186daed6181f56f60b87ae781f19ff162b1165375cf60e630e25f14fc74973",          "changelogUrl": "https://github.com/JanSharp/VCCDummyPackage/blob/v0.1.1/CHANGELOG.md"        },        "0.1.2": {          "name": "com.jansharp.dummy",          "version": "0.1.2",          "description": "A truly wonderful dummy package.",          "displayName": "Dummy Package",          "unity": "2019.4",          "author": {            "name": "JanSharp",            "email": "steinmeister36@gmail.com",            "url": "https://jansharp.github.io"          },          "license": "MIT",          "vpmDependencies": {            "com.vrchat.udonsharp": "^1.1.x"          },          "url": "https://github.com/JanSharp/VCCDummyPackage/releases/download/v0.1.2/com.jansharp.dummy.zip",          "zipSHA256": "a77c84c2c0bcf6cab67a6dfcc521f479acf020ecaad383f420973fce4680a7e8",          "changelogUrl": "https://github.com/JanSharp/VCCDummyPackage/blob/v0.1.2/CHANGELOG.md"        },        "0.1.3": {          "name": "com.jansharp.dummy",          "version": "0.1.3",          "description": "A truly wonderful dummy package.",          "displayName": "Dummy Package",          "unity": "2019.4",          "author": {            "name": "JanSharp",            "email": "steinmeister36@gmail.com",            "url": "https://jansharp.github.io"          },          "license": "MIT",          "vpmDependencies": {            "com.vrchat.udonsharp": "^1.1.x"          },          "url": "https://github.com/JanSharp/VCCDummyPackage/releases/download/v0.1.3/com.jansharp.dummy.zip",          "zipSHA256": "764f383be353f368da1667c637b1fc7d6d1c7b0b559a1527d6d296991bd02efe",          "changelogUrl": "https://github.com/JanSharp/VCCDummyPackage/blob/v0.1.3/CHANGELOG.md"        },        "0.1.4": {          "name": "com.jansharp.dummy",          "version": "0.1.4",          "description": "A truly wonderful dummy package.",          "displayName": "Dummy Package",          "unity": "2019.4",          "author": {            "name": "JanSharp",            "email": "steinmeister36@gmail.com",            "url": "https://jansharp.github.io"          },          "license": "MIT",          "vpmDependencies": {            "com.vrchat.udonsharp": "^1.1.x"          },          "url": "https://github.com/JanSharp/VCCDummyPackage/releases/download/v0.1.4/com.jansharp.dummy.zip",          "zipSHA256": "74523fbb7e9c8f5e9217edc6f3b7c649f87886da3260ff28abcf43443d2ec143",          "changelogUrl": "https://github.com/JanSharp/VCCDummyPackage/blob/v0.1.4/CHANGELOG.md"        }      }    }  }}'),
//   [latestUrl]: JSON.parse('{  "com.jansharp.dummy": {    "version": "0.1.4",    "updateDate": "2023-07-09T08:41:10\u002B00:00",    "repoUrl": "https://github.com/JanSharp/VCCDummyPackage"  },  "com.jansharp.foo": {    "version": "0.1.0",    "updateDate": "2023-07-30T08:41:10\u002B00:00",    "repoUrl": "https://github.com/JanSharp/VCCDummyPackage"  },  "com.jansharp.bar": {    "version": "0.1.0",    "updateDate": "2023-07-21T08:41:10\u002B00:00",    "repoUrl": "https://github.com/JanSharp/VCCDummyPackage"  }}'),
// }

const makeElem = (parent, elemName, callback) => {
  const elem = document.createElement(elemName);
  callback(elem);
  parent.appendChild(elem);
  return elem;
};

const getJson = (url, callback) => {
  // const cached = devCache[url];
  // if (cached != undefined)
  // {
  //   callback(cached);
  //   return;
  // }
  // return;

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
