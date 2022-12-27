var isLoading = false;

var file;

var thelenth = 0;

var fileindex = 0;

var cookie = document.cookie;

var user;

var selectedday;

var attractionId;

var selectedday_time;

var selectedday_cost;

var selectedday_date;

var link;

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

  getData("/api/user/auth");
  function getData(url) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        // console.log(JSON.parse(this.response));
        login_response = JSON.parse(this.response);
        console.log(login_response["data"]);
        if (login_response["data"] != null) {
          console.log("已登入");
          const loginitemtext = document.querySelector(".loginitemtext");
          loginitemtext.innerHTML = "登出系統";
          const loginitem = document.querySelector("#loginitem");
          loginitem.onclick = function () {
            logout();
          };
        }
      }
    };
    xhr.send(null);
  }
} else {
  console.log("未登入");
  const loginitem = document.querySelector("#loginitem");
  loginitem.onclick = function () {
    signinblock();
  };
}

function getdata() {
  //讀取資料
  isLoading = true;
  console.log(isLoading);
  var path = location.pathname;
  var index = path.split("/attraction/");
  attractionId = index[1];
  console.log(attractionId);
  fetch(`/api/attraction/${attractionId}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //整理
      let array = [];
      let posts = data["data"];
      let title_name = posts["name"];
      let title_category = posts["category"];
      let title_mrt = posts["mrt"];
      let title_description = posts["description"];
      let title_address = posts["address"];
      let title_transport = posts["transport"];
      file = posts["images"];
      console.log(file.length);
      thelenth = file.length - 1;
      link = file[0];

      //獲得資料
      let _contenttitle = document.querySelector(".contenttitle");
      let _contenttitle_text = document.createTextNode(title_name);
      _contenttitle.appendChild(_contenttitle_text);
      console.log(title_name);

      let _categoryandmrt = document.querySelector(".categoryandmrt");
      let _categoryandmrt_text = document.createTextNode(
        title_category + " at " + title_mrt
      );
      _categoryandmrt.appendChild(_categoryandmrt_text);
      console.log(title_category);

      let _descriptiontext = document.querySelector(".descriptiontext");
      let _descriptiontext_text = document.createTextNode(title_description);
      _descriptiontext.appendChild(_descriptiontext_text);
      console.log(title_description);

      let _addresstext = document.querySelector(".addresstext");
      let _addresstext_text = document.createTextNode(title_address);
      _addresstext.appendChild(_addresstext_text);
      console.log(title_address);

      let _transporttext = document.querySelector(".transporttext");
      let _transporttext_text = document.createTextNode(title_transport);
      _transporttext.appendChild(_transporttext_text);
      console.log(title_transport);

      let _contentphoto = document.querySelector(".left-content");
      _contentphoto.style.cssText = "background-image: url(" + link + ")";
      console.log(link);

      if (thelenth > 0) {
        //產生輪播圖片 point
        let _imgpointlist = document.querySelector(".imgpointlist");
        for (i = 0; i < file.length; i++) {
          let _imgpoint_button = document.createElement("button");
          _imgpoint_button.id = "my" + i;
          _imgpoint_button.classList.add("imgpointbutton");
          _imgpoint_button.setAttribute("onclick", "clickedpoint()");
          _imgpointlist.appendChild(_imgpoint_button);
        }
      }

      let _the_imagepoint = document.querySelector("#my" + fileindex);
      _the_imagepoint.style.cssText =
        "background: #000000; border: 1px solid #ffffff;";

      console.log(data["data"]);
    });
  isLoading = false;
}

getdata();

function gohome() {
  document.location.href = "/";
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

function hideview() {
  const view = document.querySelector(".signinblock");
  view.style.display = "none";
  const blocker = document.querySelector(".blocker");
  blocker.style.display = "none";
}

function signinblock() {
  const signupblock = document.querySelector(".signupblock");
  signupblock.style.display = "none";

  const signinblock = document.querySelector(".signinblock");
  signinblock.style.display = "block";

  const blocker = document.querySelector(".blocker");
  blocker.style.cssText =
    "background-color: #000000; display: flex; opacity: 0.25; z-index: 999;";
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
    document.location.href = `/attraction/${attractionId}`;
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
    document.location.href = `/attraction/${attractionId}`;
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
        document.location.href = `/attraction/${attractionId}`;
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

var clicked = 0;

function clickedpoint() {
  //照片輪播點擊 point切換
  window.addEventListener("click", function (e) {
    // console.log(e.target.className);
    // console.log(e.target.id);
    _point_id = e.target.id.split("my");
    _point_fileindex = _point_id[1];
    // console.log(fileindex);
    if (e.target.className == "imgpointbutton") {
      let _the_imagepoint = document.querySelector("#my" + fileindex);
      _the_imagepoint.style.cssText = "background: #ffffff;";

      let _thisimagephoto = document.querySelector(".left-content");
      fileindex = _point_id[1];
      //   console.log(fileindex);
      if (fileindex > thelenth) {
        fileindex = thelenth;
      }
      _thisimagephoto.style.cssText.innerHTML = "";
      _thisimagephoto.style.cssText =
        "background-image: url(" + file[fileindex] + ")";

      let _now_imagepoint = document.querySelector("#my" + fileindex);
      _now_imagepoint.style.cssText =
        "background: #000000; border: 1px solid #ffffff;";
      //   console.log("Hi");

      link = file[fileindex];
    }
  });
}

function firstday() {
  const _firstday = document.querySelector(".firsthalfdaybuttonselected");
  let _costtext = document.querySelector(".costtext");
  _costtext.innerHTML = "";
  let _costtext_text = document.createTextNode("新台幣 2000 元");
  _costtext.appendChild(_costtext_text);
  _firstday.style.display = "flex";

  const selectedday_date = document.getElementById("date").value;
  console.log(selectedday_date);

  selectedday_time = "";
  selectedday_time = "morning";
  console.log(selectedday_time);

  selectedday_cost = "";
  selectedday_cost = "2000";
  console.log(selectedday_cost);

  const _secondday = document.querySelector(".secondhalfdaybuttonselected");
  _secondday.style.display = "none";
}

function firstday_cancel() {
  const _firstday = document.querySelector(".firsthalfdaybuttonselected");
  let _costtext = document.querySelector(".costtext");
  _costtext.innerHTML = "";
  _firstday.style.display = "none";
}

function secondday() {
  const _secondday = document.querySelector(".secondhalfdaybuttonselected");
  let _costtext = document.querySelector(".costtext");
  _costtext.innerHTML = "";
  let _costtext_text = document.createTextNode("新台幣 2500 元");
  _costtext.appendChild(_costtext_text);
  _secondday.style.display = "flex";

  const selectedday_date = document.getElementById("date").value;
  console.log(selectedday_date);

  selectedday_time = "";
  selectedday_time = "afernoon";
  console.log(selectedday_time);

  selectedday_cost = "";
  selectedday_cost = "2500";
  console.log(selectedday_cost);

  const _firstday = document.querySelector(".firsthalfdaybuttonselected");
  _firstday.style.display = "none";
}

function secondday_cancel() {
  const _secondday = document.querySelector(".secondhalfdaybuttonselected");
  let _costtext = document.querySelector(".costtext");
  _costtext.innerHTML = "";
  _secondday.style.display = "none";
}

function imageleft() {
  //圖片箭頭按鈕向左切換
  let _the_imagepoint = document.querySelector("#my" + fileindex);
  _the_imagepoint.style.cssText = "background: #ffffff;";

  let _thisimagephoto = document.querySelector(".left-content");
  fileindex = fileindex - 1;
  if (fileindex < 0) {
    fileindex = 0;
  }
  _thisimagephoto.style.cssText.innerHTML = "";
  _thisimagephoto.style.cssText =
    "background-image: url(" + file[fileindex] + ")";

  let _now_imagepoint = document.querySelector("#my" + fileindex);
  _now_imagepoint.style.cssText.innerHTML = "";
  _now_imagepoint.style.cssText =
    "background: #000000; border: 1px solid #ffffff;";

  link = file[fileindex];
}

function imageright() {
  //圖片箭頭按鈕向右切換
  let _the_imagepoint = document.querySelector("#my" + fileindex);
  _the_imagepoint.style.cssText = "background: #ffffff;";

  let _thisimagephoto = document.querySelector(".left-content");
  fileindex = fileindex + 1;
  if (fileindex > thelenth) {
    fileindex = thelenth;
  }
  _thisimagephoto.style.cssText.innerHTML = "";
  _thisimagephoto.style.cssText =
    "background-image: url(" + file[fileindex] + ")";

  let _now_imagepoint = document.querySelector("#my" + fileindex);
  _now_imagepoint.style.cssText =
    "background: #000000; border: 1px solid #ffffff;";

  link = file[fileindex];
}

function startbooking() {
  //判斷是否為登入狀態
  if ((cookie != "") & (cookie != "token=")) {
    token = cookie.split("=")[1];

    const date = document.getElementById("date").value;

    const data = {
      attractionId: attractionId,
      date: date,
      time: selectedday_time,
      price: selectedday_cost,
    };
    fetch(`/api/booking`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    }).then(function (response) {
      response.json().then(function (data) {
        if (data["ok"] == true) {
          console.log(data["ok"]);
          document.location.href = `/booking`;
        } else {
          alert(data["message"]);
          console.log(data);
        }
      });
    });

    // document.location.href = `/booking`;
  } else {
    token = "";
    signinblock();
  }
}
