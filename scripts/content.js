const getTitleWithProblemNumberElement = async () => {
  const selector = "#qd-content div div div > .flex div div div div div div a";
  const el = await waitForElement(selector);

  return el;
};

const waitForElement = async (selector) => {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(intervalId);
        resolve(element);
      }
    }, 100);
  });
};

const injectButton = (parentDOMNode, onClick) => {
  const button = document.createElement("button");
  button.innerText = "⏺";
  parentDOMNode.appendChild(button);
  button.setAttribute("style", "margin-left: 10px");
  button.addEventListener("click", onClick);
};

const getProblemNumber = (element) => {
  const numberRegex = /^[0-9]*/;

  return element.textContent.match(numberRegex)[0] || "x";
};

const getProblemFromUrl = () => {
  const url = window.location.toString();

  // https://leetcode.com/problems/median-of-two-sorted-arrays/
  // -->
  // /median-of-two-sorted-arrays/
  const extractProblemRegexWithSlashes = /(\/[a-zA-Z-]*\/)$/;

  const problemWithSlashes = url.match(extractProblemRegexWithSlashes)[0];

  // /median-of-two-sorted-arrays/
  // -->
  // median-of-two-sorted-arrays
  const problemRegex = /[a-zA-Z-]+/;
  const problem = problemWithSlashes.match(problemRegex)[0];

  return problem;
};

const getProblemDifficulty = () => {
  const text = document.querySelector("#qd-content div div div div .flex div div div div .mt-3 div").textContent;
  return text.toLowerCase();
};

const copyToClipBoard = (text) => {
  navigator.clipboard.writeText(text);
};

(async () => {
  // this code runs on page load

  // get element
  const titleWithProblemElement = await getTitleWithProblemNumberElement();

  // get problem number
  if (titleWithProblemElement) {
    // inject button
    injectButton(titleWithProblemElement, () => {
      const problemNumber = getProblemNumber(titleWithProblemElement);
      const problem = getProblemFromUrl();
      const difficuly = getProblemDifficulty();

      const baseName = `${problemNumber}-${problem}`;
      const path = `./${difficuly}/${baseName}`;

      const createFolder = `mkdir ${path}`;
      const createFile = `touch ${path}/${baseName}.ts`;
      const openVSCode = `code ${path}`;

      const command = `${createFolder}; ${createFile}; ${openVSCode}`;
      console.log("command: ", command);

      copyToClipBoard(command);
    });
  }
})();
