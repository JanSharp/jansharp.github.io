
const allKeySeqUrl = "https://gist.githubusercontent.com/JanSharp/08dc41293712fedf529c23d918f7ba68/raw/all_factorio_key_sequences.json";

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
    document.getElementById("errorOutput").innerHTML = "Unable to get all_factorio_key_sequences.json.";
  };
  request.open("GET", url);
  request.send();
};

let allKeySeq;
let initialized = false;
const entries = [];

let load = () => {
  if (allKeySeq.version != 1)
  {
    document.getElementById("errorOutput").innerHTML = `Unable load all_factorio_key_sequences.json`
      + `because its version is ${allKeySeq.version} however the current version of this page can `
      + `only load version 1.`;
    return;
  }
  initialized = true;
  document.getElementById("loading").innerText = "";

  const asOfDate = document.getElementById("asOfDate");
  const date = new Date(allKeySeq.date);
  const pad = v => `0${v}`.slice(-2);
  // Apparently getMonth is 0 based, but getDate is 1 based. Fair enough I suppose.
  const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} `
    + `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  asOfDate.innerText = "As of " + dateStr;
  asOfDate.setAttribute("title", allKeySeq.date);

  const tableBody = document.getElementById("tableBody");
  let i = 0;
  for (const seq of allKeySeq.data)
  {
    for (const proto of seq[2])
    {
      const entry = {
        initialIndex: i,
        keySequence: seq[0],
        uniqueCount: seq[1],
        prototype: allKeySeq.strings[proto[0]],
        isController: proto[1] == 1 ? true : false,
        mod: allKeySeq.strings[proto[2]],
        major: proto[3],
        minor: proto[4],
        patch: proto[5],
        consuming: proto[6] == 1 ? "none"
          : proto[6] == 2 ? "game-only"
          : "",
      };
      entries[i] = entry;
      i++;

      entry.rowElem = makeElem(tableBody, "tr", tr => {
        tr.className = "packageEntry";
        makeElem(tr, "td", td => {
          td.innerText = entry.uniqueCount.toString();
        });
        makeElem(tr, "td", td => {
          td.innerText = entry.isController ? "true" : "false";
        });
        makeElem(tr, "td", td => {
          td.innerText = entry.keySequence;
        });
        makeElem(tr, "td", td => {
          td.innerText = entry.prototype;
        });
        makeElem(tr, "td", td => {
          makeElem(td, "a", a => {
            a.setAttribute("href", "https://mods.factorio.com/mod/" + entry.mod);
            a.innerText = entry.mod + "_"
              + entry.major.toString() + "." + entry.minor.toString() + "." + entry.patch.toString();
          });
        });
        makeElem(tr, "td", td => {
          td.innerText = entry.consuming;
        });
      });
    }
  }

  toggleUniqueCountSort();
};

let initSorting;

var startLoading = () => {
  initSorting();

  getJson(allKeySeqUrl, obj => {
    allKeySeq = obj;
    load();
  });
};

let uniqueCountHeader;
let isControllerHeader;
let keySequenceHeader;
let prototypeHeader;
let modHeader;
let consumingHeader;

let uniqueCountHeaderText;
let isControllerHeaderText;
let keySequenceHeaderText;
let prototypeHeaderText;
let modHeaderText;
let consumingHeaderText;

initSorting = () => {
  uniqueCountHeader = document.getElementById("uniqueCountHeader");
  isControllerHeader = document.getElementById("isControllerHeader");
  keySequenceHeader = document.getElementById("keySequenceHeader");
  prototypeHeader = document.getElementById("prototypeHeader");
  modHeader = document.getElementById("modHeader");
  consumingHeader = document.getElementById("consumingHeader");

  uniqueCountHeaderText = uniqueCountHeader.innerText;
  isControllerHeaderText = isControllerHeader.innerText;
  keySequenceHeaderText = keySequenceHeader.innerText;
  prototypeHeaderText = prototypeHeader.innerText;
  modHeaderText = modHeader.innerText;
  consumingHeaderText = consumingHeader.innerText;
};

let lastSortColumn;
let sortDir;

const up = "▲";
const down = "▼";
const line = "━";

const updateTitles = () => {
  uniqueCountHeader.innerText = uniqueCountHeaderText + " "
    + (lastSortColumn == "uniqueCount" ? (sortDir == 1 ? up : down) : line);
  isControllerHeader.innerText = isControllerHeaderText + " "
    + (lastSortColumn == "isController" ? (sortDir == 1 ? up : down) : line);
  keySequenceHeader.innerText = keySequenceHeaderText + " "
    + (lastSortColumn == "keySequence" ? (sortDir == 1 ? up : down) : line);
  prototypeHeader.innerText = prototypeHeaderText + " "
    + (lastSortColumn == "prototype" ? (sortDir == 1 ? up : down) : line);
  modHeader.innerText = modHeaderText + " "
    + (lastSortColumn == "mod" ? (sortDir == 1 ? up : down) : line);
  consumingHeader.innerText = consumingHeaderText + " "
    + (lastSortColumn == "consuming" ? (sortDir == 1 ? up : down) : line);
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

    // Use initialIndex as the fallback.
    const lInitialIndex = left.initialIndex;
    const rInitialIndex = right.initialIndex;
    if (lInitialIndex < rInitialIndex)
      return -1 * sortDir * initialSortDir;
    if (lInitialIndex > rInitialIndex)
      return 1 * sortDir * initialSortDir;

    return 0;
  });

  const tableBody = document.getElementById("tableBody");
  for (const i in entries)
    tableBody.insertAdjacentElement("beforeend", entries[i].rowElem);

  updateTitles();
};

var toggleUniqueCountSort = () => performSort("uniqueCount", -1);
var toggleIsControllerSort = () => performSort("isController", -1);
var toggleKeySequenceSort = () => performSort("keySequence", 1);
var togglePrototypeSort = () => performSort("prototype", 1);
var toggleModSort = () => performSort("mod", 1);
var toggleConsumingSort = () => performSort("consuming", 1);
