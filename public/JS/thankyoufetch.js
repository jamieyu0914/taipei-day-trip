var cookie = document.cookie;

var user;

//判斷是否為登入狀態
if ((cookie != "") & (cookie != "token=")) {
  token = cookie.split("=")[1];
} else {
  token = "";
  document.location.href = `/`;
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
  // console.log(parseJwt(token));

  var path = location.href;
  console.log(path);
  var index = path.split("thankyou?number=");
  number = index[1];
  console.log(number);

  const attentiontextordersnumber = document.getElementById(
    "attentiontextordersnumber"
  );
  attentiontextordersnumber.innerHTML = "訂單編號：" + number;

  getData("/api/user/auth");
  function getData(url) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        // console.log(JSON.parse(this.response));
        login_response = JSON.parse(this.response);
        // console.log(login_response["data"]);
        user = login_response["data"];
        if (login_response["data"] != null) {
          getordersData(`/api/orders/${number}`);
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
  getordersData(`/api/orders/${number}`);
  console.log("未登入");
  const loginitem = document.querySelector("#loginitem");
  loginitem.onclick = function () {
    signinblock();
  };
}

function gohome() {
  document.location.href = "/";
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
        document.location.reload();
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
  document.location.href = `/booking`;
}

function getordersData(url) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      // console.log(JSON.parse(this.response));
      orders_response = JSON.parse(this.response);
      console.log(orders_response["data"]);
      if (orders_response["data"] == undefined) {
        const username = document.querySelector(".username");
        username.innerHTML = user["name"];

        const slogan = document.querySelector(".slogan");
        slogan.style.display = "none";

        const listblock = document.querySelector(".listblock");
        listblock.style.display = "none";

        const headlinetext = document.querySelector(".headlinetext");
        let nonetext_div = document.createElement("text");
        nonetext_div.classList.add("nonetext");
        nonetext_div.innerHTML = "目前沒有任何待預定的行程";
        headlinetext.appendChild(nonetext_div);
        // console.log("新增文字囉");

        const footer = document.querySelector(".footer");
        footer.style.cssText =
          "justify-content: flex-start; height:865px; bottom: 180px;";
        const text = document.querySelector(".text");
        text.style.cssText = "position: absolute; top: 45px;";

        if (window.innerWidth < 600) {
          const headline = document.querySelector(".headline");
          headline.style.cssText =
            "padding-top: 0px; padding-bottom: 0px; height: 205px;";

          const headlinetext = document.querySelector(".headlinetext");
          headlinetext.style.cssText = "margin-bottom:0px; margin-top:0px;";

          const hrline = document.querySelector(".hrline");
          hrline.style.cssText = "display:none;";

          const footer = document.querySelector(".footer");
          footer.style.cssText = "bottom:0px; height: 425px;";
        }

        return;
      }
      const username = document.querySelector(".username");
      username.innerHTML = user["name"];

      _orders_image = orders_response["data"]["trip"]["attraction"]["image"];
      const contentphoto = document.querySelector(".left-content");
      contentphoto.style.cssText =
        "background-image: url(" + _orders_image + ")";

      _title_name = orders_response["data"]["trip"]["attraction"]["name"];
      console.log(_title_name);
      const contenttitle = document.querySelector(".contenttitle");
      contenttitle.innerHTML = "台北一日遊：" + _title_name;

      _orders_date = orders_response["data"]["trip"]["date"];
      console.log(_orders_date);
      const contentdatetext = document.querySelector(".contentdatetext");
      contentdatetext.innerHTML = _orders_date;

      _orders_time = orders_response["data"]["trip"]["time"];
      if (_orders_time == "morning") {
        _orders_time_text = "早上9點";
      } else if (_orders_time == "afernoon") {
        _orders_time_text = "下午4點";
      }
      const contenttimetext = document.querySelector(".contenttimetext");
      contenttimetext.innerHTML = _orders_time_text;

      _orders_price = orders_response["data"]["price"];
      console.log(_orders_price);
      const contentcosttext = document.querySelector(".contentcosttext");
      contentcosttext.innerHTML = "新台幣 " + _orders_price + " 元";

      // const totaltext = document.querySelector(".totaltext");
      // totaltext.innerHTML = "總價：新台幣 " + _booking_price + " 元";

      _orders_address =
        orders_response["data"]["trip"]["attraction"]["address"];
      console.log(_orders_address);
      const contentaddresstext = document.querySelector(".contentaddresstext");
      contentaddresstext.innerHTML = _orders_address;
    } else {
      console.log(JSON.parse(this.response));
    }
  };
  xhr.send(null);
}

function cardnumberinputtext() {
  const cardnumberinput = document.querySelector(".cardnumberinput");
  cardnumberinput.placeholder = "";
}

function cardtimeinputtext() {
  const cardtimeinput = document.querySelector(".cardtimeinput");
  cardtimeinput.placeholder = "";
}

function cardpasswordinputtext() {
  const cardpasswordinput = document.querySelector(".cardpasswordinput");
  cardpasswordinput.placeholder = "";
}
