// Gmail Sorter: labels inbox threads by category using Gmail search queries

// Some test keywords/phrases/sites
const RULES = [
  { label: "Sorted/School", query: "from:(hunter.cuny.edu OR cuny.edu)" },
  {
    label: "Sorted/Jobs",
    query:
      'from:(linkedin.com OR indeed.com) OR subject:(interview OR "your application")',
  },
  {
    label: "Sorted/Receipts",
    query:
      'subject:(receipt OR invoice OR "order confirmation" OR "your order")',
  },
  { label: "Sorted/Newsletters", query: "unsubscribe" },
];

const DONE_LABEL = "SortedDone";
const LOOKBACK = "newer_than:7d"; // last 7 days, can change
const ARCHIVE_AFTER_LABEL = false; // archive after sorted, turn on if everything is good

function getOrCreateLabel_(name) {
  return GmailApp.getUserLabelByName(name) || GmailApp.createLabel(name);
}

function sortInbox() {
  const done = getOrCreateLabel_(DONE_LABEL);

  RULES.forEach((rule) => {
    const label = getOrCreateLabel_(rule.label);
    const q = `in:inbox ${LOOKBACK} -label:${DONE_LABEL} (${rule.query})`;
    const threads = GmailApp.search(q, 0, 100);
    if (threads.length === 0) return;

    label.addToThreads(threads);
    done.addToThreads(threads);
    if (ARCHIVE_AFTER_LABEL) GmailApp.moveThreadsToArchive(threads);
  });
}

// use to make it run automatically every 5 minutes
// 5 mins cuz googles servers run the script every 5 mins
// ONLY DO IT ONCE AT THE VERY END WHEN EVERYTHING IS GOOD
function installTrigger() {
  ScriptApp.getProjectTriggers().forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("sortInbox").timeBased().everyMinutes(5).create();
}
