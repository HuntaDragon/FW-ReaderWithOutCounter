let markerProm = new Promise((resolve) => {
  let interval = setInterval(() => {
    const find = document.querySelector(".orange");
    if (find !== null) {
      clearInterval(interval);
      let updatedLoads = localStorage.getItem("updated");
      updatedLoads = JSON.parse(updatedLoads);
      if (updatedLoads == null) {
        let updatedLoads = [1];
        localStorage.setItem("updated", JSON.stringify(updatedLoads));
      }
      function removeLoads() {
        let findBody = document.querySelector("tbody");
        let arr = [];
        let findFB = findBody.children;
        for (let elem of findFB) {
          let FB = Number(elem.children[1].textContent);
          arr.push(FB);
        }
        updatedLoads = updatedLoads.filter((i) => arr.includes(i));
        localStorage.setItem("updated", JSON.stringify(updatedLoads));
      }
      removeLoads();
      resolve();
    }
  }, 1000);
});

markerProm
  .then(() => {
    let comments = localStorage.getItem("comments");
    comments = JSON.parse(comments);
    if (comments == null) {
      let comments = [
        {
          fb: 1,
          comment: "no comment",
          commentTime: 0,
          status: status,
          timeZone: "",
          inTime: 0,
        },
      ];
      localStorage.setItem("comments", JSON.stringify(comments));
    }
    function removeComments() {
      let findYellows = document.querySelectorAll("tr.orange");
      let arr = [];
      for (let elem of findYellows) {
        let FB = Number(elem.children[1].textContent);
        arr.push(FB);
      }
      comments = comments.filter((elem) => arr.includes(Number(elem.fb)));
      localStorage.setItem("comments", JSON.stringify(comments));
    }
    removeComments();
  })
  .then(() => {
    let updatedLoads = localStorage.getItem("updated");
    updatedLoads = JSON.parse(updatedLoads);
    let comments = localStorage.getItem("comments");
    comments = JSON.parse(comments);

    window.addEventListener("storage", function (e) {
      updatedLoads = localStorage.getItem("updated");
      updatedLoads = JSON.parse(updatedLoads);
      comments = localStorage.getItem("comments");
      comments = JSON.parse(comments);
    });
    window.onclick = function (e) {
      if ((e = e.target.closest("tr.ng-star-inserted"))) {
        findStatus();
      }
    };
    function findStatus() {
      let statusInt = setInterval(() => {
        let statusBox = document.querySelector("span.mat-mdc-select-min-line");
        if (statusBox !== null) {
          let status = statusBox.textContent;

          if (status == "At Pickup" || status == "At Delivery") {
            clearInterval(statusInt);
            findEditButton();
            generateComment(status);
            findPostBtn();
          }
          if (
            status == "Need to check" ||
            status == "ETA Pickup" ||
            status == "In Transit/Loaded" ||
            status == "ETA Delivery"
          ) {
            clearInterval(statusInt);
            findEditButton();
          }
        }
      }, 500);
    }

    // coments ==========

    function generateComment(status) {
      let findComentint = setInterval(() => {
        let commentsBox = document.querySelectorAll("div.column-item");
        let savedFB = document.querySelector(".m-r-1");

        if (commentsBox[1] !== null && savedFB !== null) {
          clearInterval(findComentint);
          let willBeSaved = {
            fb: savedFB.textContent,
            comment: findComment(),
            commentTime: findCommentTime(),
            status: status,
            timeZone: findTimeZoneTest(),
            inTime: findInTimeTest(),
          };

          saveComment(willBeSaved);
        }
      }, 500);
    }
    function findTimeZoneTest() {
      let findStops = document.querySelectorAll("div.stop-item");
      let pickUpDateItem = findStops[0].querySelectorAll("p.date");
      let findTimeZoneBox = document.querySelectorAll("p.m-b-1");

      if (pickUpDateItem[2].textContent == "") {
        let timeZone = `${findTimeZoneBox[0].textContent.at(
          -3
        )}${findTimeZoneBox[0].textContent.at(
          -2
        )}${findTimeZoneBox[0].textContent.at(-1)}`;
        return timeZone;
      } else {
        let timeZone = `${findTimeZoneBox[1].textContent.at(
          -3
        )}${findTimeZoneBox[1].textContent.at(
          -2
        )}${findTimeZoneBox[1].textContent.at(-1)}`;
        return timeZone;
      }
    }

    function findInTimeTest() {
      let findStops = document.querySelectorAll("div.stop-item");
      let pickUpDateItem = findStops[0].querySelectorAll("p.date");
      let delDateItem =
        findStops[findStops.length - 1].querySelectorAll("p.date");

      if (pickUpDateItem[2].textContent == "") {
        let inTime = `${pickUpDateItem[1].textContent.at(
          -5
        )}${pickUpDateItem[1].textContent.at(
          -4
        )}${pickUpDateItem[1].textContent.at(
          -3
        )}${pickUpDateItem[1].textContent.at(
          -2
        )}${pickUpDateItem[1].textContent.at(-1)}`;

        return inTime;
      } else {
        let inTime = `${delDateItem[1].textContent.at(
          -5
        )}${delDateItem[1].textContent.at(-4)}${delDateItem[1].textContent.at(
          -3
        )}${delDateItem[1].textContent.at(-2)}${delDateItem[1].textContent.at(
          -1
        )}`;

        return inTime;
      }
    }
    function findCommentTime() {
      let commentsBox = document.querySelector("div.comment-container");
      if (commentsBox == null) {
        return "";
      }
      let findCommentTime = commentsBox.querySelector("span.date");
      let commentTime = `${findCommentTime.textContent.at(
        -8
      )}${findCommentTime.textContent.at(-7)}${findCommentTime.textContent.at(
        -6
      )}${findCommentTime.textContent.at(-5)}${findCommentTime.textContent.at(
        -4
      )}${findCommentTime.textContent.at(-3)}${findCommentTime.textContent.at(
        -2
      )}${findCommentTime.textContent.at(-1)}`;
      return commentTime;
    }
    function findComment() {
      let commentsBox = document.querySelector("div.comment-container");
      if (commentsBox == null) {
        return "no comment";
      } else {
        let commentBody = commentsBox.querySelector(".body1");
        return commentBody.textContent;
      }
    }

    function saveComment(data) {
      for (let i = 0; i < comments.length; i += 1) {
        if (comments[i].fb == data.fb && comments[i].comment !== data.comment) {
          comments[i].comment = data.comment;
          comments[i].commentTime = data.commentTime;
          localStorage.setItem("comments", JSON.stringify(comments));
          return comments;
        }

        if (comments[i].fb == data.fb && comments[i].comment == data.comment) {
          return;
        }
      }
      comments.push(data);
      localStorage.setItem("comments", JSON.stringify(comments));
      return comments;
    }
    function findPostBtn() {
      let dispComments = document.querySelector("div.dispatch-comments");
      let textArea = dispComments.querySelector(
        "textarea.cdk-textarea-autosize"
      );
      let labelArea = dispComments.querySelector(
        "div.mdc-notched-outline__notch"
      );

      textArea.addEventListener("click", function () {
        addComent();
      });
      labelArea.addEventListener("click", function () {
        setTimeout(() => {
          addComent();
        }, 100);
      });
    }
    function addComent() {
      let postBnt = document.querySelectorAll("button.lgt-button-text");
      let dispComments = document.querySelector("div.dispatch-comments");
      let textArea = dispComments.querySelector(
        "textarea.cdk-textarea-autosize"
      );
      let savedFB = document.querySelector(".m-r-1");
      postBnt[1].addEventListener("click", function () {
        for (let i = 0; i < comments.length; i += 1) {
          if (comments[i].fb == savedFB.textContent) {
            comments[i].comment = textArea.value;
            let date = new Date();
            comments[i].commentTime = `${date.getHours()}:${date.getMinutes()}`;
            localStorage.setItem("comments", JSON.stringify(comments));
          }
        }
      });
    }

    function pasteComment() {
      let pasteInt = setInterval(() => {
        let findYellows = document.querySelectorAll("tr.orange");
        for (let el of findYellows) {
          let FB = Number(el.children[1].textContent);
          for (let i = 0; i < comments.length; i += 1) {
            if (comments[i].fb == FB) {
              el.children[6].textContent = `${comments[i].status} ${comments[i].inTime} ${comments[i].timeZone}`;
              el.children[7].textContent = `${comments[i].commentTime}   ${comments[i].comment}`;
            }
          }
        }
      }, 1000);
    }
    pasteComment();
    //coments ======

    //updates =================================================
    function getUpdatedLoads() {
      let int = setInterval(() => {
        let findBody = document.querySelector("tbody");
        let findFB = findBody.children;
        for (let el of findFB) {
          let FB = Number(el.children[1].textContent);
          if (updatedLoads.includes(FB)) {
            el.children[1].classList.add("updated");
          }
        }
      }, 1000);
    }
    getUpdatedLoads();
    function saveLoad() {
      let savedFB = document.querySelector(".m-r-1");
      if (updatedLoads.includes(Number(savedFB.textContent))) {
        return;
      }
      updatedLoads.push(Number(savedFB.textContent));

      localStorage.setItem("updated", JSON.stringify(updatedLoads));

      return updatedLoads;
    }

    function findEditButton() {
      let findEditButtonInt = setInterval(() => {
        let findEditBtnBlock = document.querySelector("div.stops-wrapper");
        let editBnt = findEditBtnBlock.querySelector("button.lgt-button-white");
        if (editBnt !== null) {
          clearInterval(findEditButtonInt);
          editBnt.addEventListener("click", findSaveButton);
        }
      }, 500);
    }
    function findSaveButton() {
      let findSaveButtonInt = setInterval(() => {
        let saveBtn = document.querySelector("button.m-l-4");
        let inputs = document.querySelectorAll("input.mat-mdc-input-element");
        //======
        let statusBox = document.querySelector("span.mat-mdc-select-min-line");
        let status = statusBox.textContent;
        //======

        if (saveBtn !== null && inputs !== null) {
          clearInterval(findSaveButtonInt);
          let times = [];
          for (let i = 0; i < inputs.length; i += 1) {
            if (inputs[i].value != "") {
              times.push(inputs[i].value);
            }
          }

          saveBtn.addEventListener("click", function () {
            let timesChanged = [];
            for (let i = 0; i < inputs.length; i += 1) {
              if (inputs[i].value != "") {
                timesChanged.push(inputs[i].value);
              }
            }
            if (times.length < timesChanged.length) {
              saveLoad();
            }
          });
        }
      }, 500);
    }
    //updates =====
  });
