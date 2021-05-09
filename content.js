const BUG = "Bug"
const BUG_FIX = "bugfix"
const FEATURE = "feature"
const IMPROVEMENT = "Improvement"
const NEW_FEATURE = "New feature"
const TASK = "task"

const ISSUE_TITLE_CLASS = "sc-isBZXS bjGpra"
const ISSUE_TYPE_CLASS = "sc-laTMn itGEpA"

new MutationSummary({
    rootNode: document.body,
    callback: function (summaries) {
        let issueLink = null
        let issueNumber = null

        summaries.forEach(function (summary) {
            if (summary.added.length > 0) {

                summary.added.forEach(function (element) {
                    element.childNodes.forEach(function (node) {

                        // Using _blank to narrow down, lots of different elements have the same class
                        if (node.href && node.target && node.target === "_blank") {
                            issueLink = node
                            node.childNodes.forEach(function (n) {
                                issueNumber = n.innerText
                            })
                        }
                    })
                })
            }
        })


        if (issueLink !== null) {
            issueLink.addEventListener("contextmenu", function (event) {
                let issueType = null
                let issueTitle = null

                let issueTypes = document.getElementsByClassName(ISSUE_TYPE_CLASS)
                if (issueTypes.length > 0) {
                    // Assume the first in the list is the issue type
                    let possibleIssueType = issueTypes[0]
                        .attributes
                        .getNamedItem("alt")
                        .value

                    switch (possibleIssueType) {
                        case BUG:
                            issueType = BUG_FIX
                            break;
                        case NEW_FEATURE:
                            issueType = FEATURE
                            break;
                        case IMPROVEMENT:
                            issueType = IMPROVEMENT.toLowerCase()
                            break;
                        default:
                            issueType = TASK
                    }
                }

                let issueTitles = document.getElementsByClassName(ISSUE_TITLE_CLASS)
                if (issueTitles.length > 0) {
                    issueTitle = issueTitles[0]
                        .innerHTML.toLowerCase()
                        .split(" ")
                        .join("-")
                }

                if (issueTitle !== null && issueType !== null && issueNumber !== null) {
                    let formattedBranchName = issueType + "/" + issueNumber + "/" + issueTitle
                    let confirmation = confirm(
                        "Would you like to copy this as a branch name? \n\n" + formattedBranchName
                    )

                    if (confirmation) {
                        event.preventDefault()
                        copyToClipboard(formattedBranchName)
                    }
                }
            })
        }

        function copyToClipboard(text) {
            const input = document.createElement('input');
            input.style.position = 'fixed';
            input.style.opacity = '0';
            input.value = text;
            document.body.appendChild(input);
            input.select();
            document.execCommand('Copy');
            document.body.removeChild(input);
        }
    },
    queries: [
        // Issue hyper link
        {element: ".css-1f35s25"},
        // Issue type icon
        {element: "sc-laTMn"},
        // Issue link span (contains the issue number)
        {element: "css-1we84oz"}
    ]
});