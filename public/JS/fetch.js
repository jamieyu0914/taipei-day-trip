var isLoading = false;

var nextPage;

var cookie = document.cookie;
//判斷是否為登入狀態
if ((cookie != "") & (cookie != "token=")) {
  token = cookie.split("=")[1];
} else {
  token = "";
}

if (token != "") {
  console.log("HELLO HERE");

  function parseJwt(token) {
    //decode JWT
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    // console.log(JSON.parse(jsonPayload));
    return JSON.parse(jsonPayload);
  }

  parseJwt(token);

  fetch(`/api/user/auth`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  }).then(function (response) {
    response.json().then(function (data) {
      console.log(data);
      message = data["message"];
      if (data["login"] == true) {
        console.log("已登入");
        const loginitemtext = document.querySelector(".loginitemtext");
        loginitemtext.innerHTML = "登出系統";
        const loginitem = document.querySelector("#loginitem");
        loginitem.onclick = function () {
          logout();
        };
      }
    });
  });
} else {
  const loginitem = document.querySelector("#loginitem");
  loginitem.onclick = function () {
    signinblock();
  };
}

function getdata() {
  //讀取資料
  isLoading = true;
  console.log(isLoading);
  const keyword = document.getElementById("keyword").value; //查詢關鍵字 的輸入值
  fetch(`/api/attraction?keyword=${keyword}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //整理
      let array = [];
      nextPage = data["nextPage"];
      console.log(nextPage);
      for (i = 0; i < 12; i++) {
        // console.log("---------");
        // console.log(nextPage);
        let posts = data["data"][i];
        // console.log(posts);
        let title_id = posts["id"];
        let title_name = posts["name"];
        let title_mrt = posts["mrt"];
        let title_category = posts["category"];

        let file = posts["images"][0];
        let link = file;

        //製作卡片 //跑12次
        let list = "list-block";
        let newcard = document.getElementsByClassName(list);
        let _card_div = document.createElement("div");
        _card_div.classList.add("card");

        let _image_container_div = document.createElement("div");
        _image_container_div.classList.add("image_container");

        let _photo_div = document.createElement("div");
        _photo_div.id = title_id;
        _photo_div.classList.add("photo");
        _photo_div.style.cssText = "background-image: url(" + file + ")";
        let _photo_mask = document.createElement("div");
        _photo_mask.classList.add("photo_mask");
        let _mask_title = document.createElement("div");
        _mask_title.id = title_id;
        _mask_title.classList.add("mask_title");
        let _newcard_title_text = document.createTextNode(title_name);
        _mask_title.appendChild(_newcard_title_text);

        let _card_inform = document.createElement("div");
        _card_inform.classList.add("card_inform");
        let _mrt_inform = document.createElement("div");
        _mrt_inform.classList.add("mrt_inform");
        let _mrt_inform_text = document.createTextNode(title_mrt);
        _mrt_inform.appendChild(_mrt_inform_text);
        let _category_inform = document.createElement("div");
        _category_inform.classList.add("category_inform");
        let _category_inform_text = document.createTextNode(title_category);

        //放到位置上
        _category_inform.appendChild(_category_inform_text);
        _image_container_div.appendChild(_photo_div);
        _image_container_div.appendChild(_photo_mask);
        _image_container_div.appendChild(_mask_title);

        _card_inform.appendChild(_mrt_inform);
        _card_inform.appendChild(_category_inform);
        _card_div.appendChild(_image_container_div);
        _card_div.appendChild(_card_inform);

        newcard[0].appendChild(_card_div);
      }
      console.log(data["data"]);
    });
  isLoading = false;
}

function getcategory() {
  //讀取資料
  isLoading = true;
  fetch(`/api/categories`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //整理
      let array = [];
      let newitem = document.getElementsByClassName("search");
      let _categoryview_div = document.createElement("div");
      _categoryview_div.classList.add("categoryview");
      for (i = 0; i < 9; i++) {
        let category = data["data"][i];
        //製作分類按鈕 //跑9次

        let _item_button = document.createElement("button");
        _item_button.classList.add("categoryitem");

        let _item_button_item = document.createElement("text");
        _item_button_item.classList.add("categoryitem_text");
        index = "categoryitem_text" + i;
        _item_button_item.setAttribute("id", index);
        let _item_button_text = document.createTextNode(category);

        _item_button_item.appendChild(_item_button_text);
        _item_button.appendChild(_item_button_item);

        _categoryview_div.appendChild(_item_button);
      }
      newitem[0].appendChild(_categoryview_div);

      // console.log(data["data"][i]);
    });
  isLoading = false;
}

getdata();
getcategory();

function categoryview() {
  const thetext = document.querySelector(".inputtext");
  thetext.style.display = "none";

  const blocker = document.querySelector(".blocker");
  blocker.style.display = "flex";

  const view = document.querySelector(".categoryview");
  view.style.display = "flex";

  //偵測分類按鈕點擊

  for (i = 0; i < 9; i++) {
    const viewtext = document.querySelector("#categoryitem_text" + i);

    viewtext.addEventListener("click", function (e) {
      // console.log(e.target.textContent);
      let inputblock = document.querySelector("#keyword").value;
      inputblock.innerHTML = "";
      // console.log(inputblock);
      inputblock = e.target.textContent;
      // console.log(inputblock);

      let _input = document.querySelector("#keyword");
      _input.setAttribute("value", inputblock);

      const viewblock = document.querySelector(".categoryview");
      viewblock.style.display = "none";

      const view = document.querySelector("#keyword");
      view.style.cssText = "padding-left:10px";
    });
  }
}

function hideview() {
  const view = document.querySelector(".categoryview");
  view.style.display = "none";
  const _view = document.querySelector(".signinblock");
  _view.style.display = "none";
  const blocker = document.querySelector(".blocker");
  blocker.style.display = "none";
}

function getmoredata() {
  //再次讀取資料
  if ((nextPage !== null) & (isLoading == false)) {
    isLoading = true;
    const keyword = document.getElementById("keyword").value; //查詢關鍵字 的輸入值
    fetch(`/api/attraction?page=${nextPage}&keyword=${keyword}`)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        //整理
        let array = [];
        nextPage = data["nextPage"];
        console.log(nextPage);

        for (i = 0; i < 12; i++) {
          let posts = data["data"][i];
          if (posts == undefined) {
            isLoading == "done";
            console.log("done here!!!!!");
            return;
          }
          // console.log(posts);
          let title_id = posts["id"];
          let title_name = posts["name"];
          let title_mrt = posts["mrt"];
          let title_category = posts["category"];

          let file = posts["images"][0];
          let link = file;

          //製作卡片 //跑12次
          let list = "list-block";
          let newcard = document.getElementsByClassName(list);
          let _card_div = document.createElement("div");
          _card_div.classList.add("card");

          let _image_container_div = document.createElement("div");
          _image_container_div.classList.add("image_container");

          let _photo_div = document.createElement("div");
          _photo_div.id = title_id;
          _photo_div.classList.add("photo");
          _photo_div.style.cssText = "background-image: url(" + file + ")";
          let _photo_mask = document.createElement("div");
          _photo_mask.classList.add("photo_mask");
          let _mask_title = document.createElement("div");
          _mask_title.id = title_id;
          _mask_title.classList.add("mask_title");
          let _newcard_title_text = document.createTextNode(title_name);
          _mask_title.appendChild(_newcard_title_text);

          let _card_inform = document.createElement("div");
          _card_inform.classList.add("card_inform");
          let _mrt_inform = document.createElement("div");
          _mrt_inform.classList.add("mrt_inform");
          let _mrt_inform_text = document.createTextNode(title_mrt);
          _mrt_inform.appendChild(_mrt_inform_text);
          let _category_inform = document.createElement("div");
          _category_inform.classList.add("category_inform");
          let _category_inform_text = document.createTextNode(title_category);

          //放到位置上
          _category_inform.appendChild(_category_inform_text);
          _image_container_div.appendChild(_photo_div);
          _image_container_div.appendChild(_photo_mask);
          _image_container_div.appendChild(_mask_title);

          _card_inform.appendChild(_mrt_inform);
          _card_inform.appendChild(_category_inform);
          _card_div.appendChild(_image_container_div);
          _card_div.appendChild(_card_inform);

          newcard[0].appendChild(_card_div);
        }
        // console.log(data["data"]);
      })
      .then(() => {
        if (nextPage == null) {
          isLoading == "done";
          console.log("done here!!!!!");
          return;
        } else {
          setTimeout(() => {
            isLoading = false;
          }, 1000); // 1 second
          console.log("Time" + isLoading);
        }
      });
  }
}

if (nextPage == null) {
  isLoading == "done";
  console.log("done here!!!!!");
}

function getsearchdata() {
  //清空舊資料
  let rest = document.querySelector(".list-block");
  rest.innerHTML = "";
  // console.log("hiii", rest);
  //讀取資料
  isLoading = true;
  const keyword = document.getElementById("keyword").value; //查詢關鍵字 的輸入值
  fetch(`/api/attraction?keyword=${keyword}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //整理
      let array = [];
      nextPage = data["nextPage"];
      console.log(nextPage);
      for (i = 0; i < 12; i++) {
        // console.log("---------");
        // console.log(nextPage);
        let posts = data["data"][i];
        if (posts == undefined) {
          isLoading == "done";
          console.log("done here!!!!!");
          return;
        }
        // console.log(posts);
        let title_id = posts["id"];
        let title_name = posts["name"];
        let title_mrt = posts["mrt"];
        let title_category = posts["category"];

        let file = posts["images"][0];
        let link = file;

        //製作卡片 //跑12次
        let list = "list-block";
        let newcard = document.getElementsByClassName(list);
        let _card_div = document.createElement("div");
        _card_div.classList.add("card");

        let _image_container_div = document.createElement("div");
        _image_container_div.classList.add("image_container");

        let _photo_div = document.createElement("div");
        _photo_div.id = title_id;
        _photo_div.classList.add("photo");
        _photo_div.style.cssText = "background-image: url(" + file + ")";

        let _photo_mask = document.createElement("div");
        _photo_mask.classList.add("photo_mask");
        let _mask_title = document.createElement("div");
        _mask_title.id = title_id;
        _mask_title.classList.add("mask_title");
        let _newcard_title_text = document.createTextNode(title_name);
        _mask_title.appendChild(_newcard_title_text);

        let _card_inform = document.createElement("div");
        _card_inform.classList.add("card_inform");
        let _mrt_inform = document.createElement("div");
        _mrt_inform.classList.add("mrt_inform");
        let _mrt_inform_text = document.createTextNode(title_mrt);
        _mrt_inform.appendChild(_mrt_inform_text);
        let _category_inform = document.createElement("div");
        _category_inform.classList.add("category_inform");
        let _category_inform_text = document.createTextNode(title_category);

        //放到位置上
        _category_inform.appendChild(_category_inform_text);
        _image_container_div.appendChild(_photo_div);
        _image_container_div.appendChild(_photo_mask);
        _image_container_div.appendChild(_mask_title);

        _card_inform.appendChild(_mrt_inform);
        _card_inform.appendChild(_category_inform);
        _card_div.appendChild(_image_container_div);
        _card_div.appendChild(_card_inform);

        newcard[0].appendChild(_card_div);
      }
      console.log(data["data"]);
    });
  isLoading = false;
}

function gohome() {
  document.location.href = "/";
}

function signinblock() {
  const signupblock = document.querySelector(".signupblock");
  signupblock.style.display = "none";

  const signinblock = document.querySelector(".signinblock");
  signinblock.style.display = "block";

  const blocker = document.querySelector(".blocker");
  blocker.style.cssText =
    "background-color: #000000; display: flex; opacity: 0.25; z-index: 998;";
}

function signinemailtext() {
  const signinemailtext = document.querySelector(".signinemailtext");
  signinemailtext.style.display = "none";
}

function signinpasswordtext() {
  const signinpasswordtext = document.querySelector(".signinpasswordtext");
  signinpasswordtext.style.display = "none";
}

function signinblock_close() {
  const signinblock = document.querySelector(".signinblock");
  signinblock.style.display = "none";

  const blocker = document.querySelector(".blocker");
  blocker.style.display = "none";
}

function signupblock() {
  const signinblock = document.querySelector(".signinblock");
  signinblock.style.display = "none";

  const signupblock = document.querySelector(".signupblock");
  signupblock.style.display = "block";

  const blocker = document.querySelector(".blocker");
  blocker.style.cssText =
    "background-color: #000000; display: flex; opacity: 0.25; z-index: 998;";
}

function signupnametext() {
  const signupnametext = document.querySelector(".signupnametext");
  signupnametext.style.display = "none";
}

function signupemailtext() {
  const signupemailtext = document.querySelector(".signupemailtext");
  signupemailtext.style.display = "none";
}

function signuppasswordtext() {
  const signuppasswordtext = document.querySelector(".signuppasswordtext");
  signuppasswordtext.style.display = "none";
}

function signupblock_close() {
  const signupblock = document.querySelector(".signupblock");
  signupblock.style.display = "none";

  const blocker = document.querySelector(".blocker");
  blocker.style.display = "none";
}

var message;

function signup() {
  const signupname = document.getElementById("signupname").value;
  const signupemail = document.getElementById("signupemail").value;
  const signuppassword = document.getElementById("signuppassword").value;
  const data = {
    name: signupname,
    email: signupemail,
    password: signuppassword,
  };
  fetch(`/api/user`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  }).then(function (response) {
    response.json().then(function (data) {
      console.log(data);
      message = data["message"];
      if (data["ok"] == true) {
        console.log(data["ok"]);
        signupstate_ok(data);
      } else {
        console.log(data["error"]);
        signupstate_error(data);
      }
    });
  });

  function signupstate_ok(data) {
    let signupblock = document.querySelector(".signupblock");
    signupblock.style.cssText = "height:370px; display:block;";
    let newresult = document.querySelector(".newresult");
    newresult.innerHTML = "";
    let content = document.createTextNode("註冊成功，請登入系統");
    newresult.style.cssText = "color:green";
    let clicktosignin = document.querySelector(".clicktosignin");
    clicktosignin.style.cssText = "top:256px";
    newresult.appendChild(content);
    document.location.href = "/";
  } // 註冊會員 結果欄位 成功

  function signupstate_error(data) {
    let signupblock = document.querySelector(".signupblock");
    signupblock.style.cssText = "height:370px; display:block;";
    let newresult = document.querySelector(".newresult");
    newresult.innerHTML = "";
    let content = document.createTextNode(message);
    newresult.style.cssText = "color:red";
    let clicktosignin = document.querySelector(".clicktosignin");
    clicktosignin.style.cssText = "top:256px";
    newresult.appendChild(content);
  } // 註冊會員 結果欄位 失敗
}

function signinput() {
  const signinemail = document.getElementById("signinemail").value;
  const signinpassword = document.getElementById("signinpassword").value;
  const data = {
    email: signinemail,
    password: signinpassword,
  };
  fetch(`/api/user/auth`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  }).then(function (response) {
    response.json().then(function (data) {
      console.log(data);
      message = data["message"];
      if (data["ok"] == true) {
        console.log(data["ok"]);
        signinstate_ok(data);
        // let cookie = document.cookie;
        // console.log(cookie);
      } else if (data["error"] == true) {
        console.log(data["error"]);
        signinstate_error(data);
      }
    });
  });

  function signinstate_ok(data) {
    let signinblock = document.querySelector(".signinblock");
    signinblock.style.cssText = "height:310px; display:block;";
    let theresult = document.querySelector(".theresult");
    theresult.innerHTML = "";
    let content = document.createTextNode("登入成功");
    theresult.style.cssText = "color:green";
    let clicktosignup = document.querySelector(".clicktosignup");
    clicktosignup.style.cssText = "top:196px";
    theresult.appendChild(content);
    document.location.href = "/";
  } // 登入會員 結果欄位 成功

  function signinstate_error(data) {
    let signinblock = document.querySelector(".signinblock");
    signinblock.style.cssText = "height:310px; display:block;";
    let theresult = document.querySelector(".theresult");
    theresult.innerHTML = "";
    let content = document.createTextNode(message);
    theresult.style.cssText = "color:red";
    let clicktosignup = document.querySelector(".clicktosignup");
    clicktosignup.style.cssText = "top:196px";
    theresult.appendChild(content);
  } // 登入會員 結果欄位 失敗
}

function logout() {
  let cookiedata = parseJwt(token);

  const data = {
    id: cookiedata["id"],
    name: cookiedata["name"],
    email: cookiedata["email"],
  };
  fetch(`/api/user/auth`, {
    method: "DELETE",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  }).then(function (response) {
    response.json().then(function (data) {
      console.log(data);
      message = data["message"];
      if (data["ok"] == true) {
        console.log(data["ok"]);
        document.location.href = "/";
        signoutstate_ok(data);
        // let cookie = document.cookie;
        // console.log(cookie);
      } else if (data["error"] == true) {
        console.log(data["error"]);
        signoutstate_error(data);
      }
    });
  });

  function signoutstate_ok(data) {
    console.log("已登出");
    const loginitemtext = document.querySelector(".loginitemtext");
    loginitemtext.innerHTML = "登入/註冊";
    const loginitem = document.querySelector("#loginitem");
    loginitem.onclick = function () {
      signinblock();
    };
  } // 登出會員 成功

  function signoutstate_error(data) {
    console.log("未登出");
    const loginitemtext = document.querySelector(".loginitemtext");
    loginitemtext.innerHTML = "登出系統";
    const loginitem = document.querySelector("#loginitem");
    loginitem.onclick = function () {
      logout();
    };
  } // 登出會員 失敗
}

function gobooking() {
  //判斷是否為登入狀態
  if ((cookie == "") | (cookie == "token=")) {
    token = "";
    signinblock();
  } else {
    token = cookie.split("=")[1];
    document.location.href = `/booking`;
  }
}

var card = document.getElementsByClassName("card");
window.addEventListener(
  "click",
  function once(e) {
    if (e.target.className == "photo") {
      console.log("點擊 景點編號" + e.target.id);
      let attractionId = e.target.id;
      document.location.href = `/attraction/${attractionId}`;
    } else if (e.target.className == "mask_title") {
      console.log("點擊 景點編號" + e.target.id);
      let attractionId = e.target.id;
      document.location.href = `/attraction/${attractionId}`;
    }
  },
  false
);

const div = document.querySelector(".footer");
let here = 0;
// 使用 getBoundingClientRect
window.addEventListener("scroll", function once(e) {
  const { top } = div.getBoundingClientRect();
  if ((top <= window.innerHeight) & (isLoading == false)) {
    here = 1;
    console.log("元素底端已進入畫面");
    console.log("Time" + isLoading);
    getmoredata();
    console.log("Hello" + isLoading);
  } else {
    return;
  }
});
