var cookie = document.cookie;

var user;

var orderNumber;

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
        console.log(user);
        document.getElementById("contactnameinput").value = user["name"];
        document.getElementById("contactemailinput").value = user["email"];
        if (login_response["data"] != null) {
          getbookingData("/api/booking");
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
  getbookingData("/api/booking");
  console.log("未登入");
  const loginitem = document.querySelector("#loginitem");
  loginitem.onclick = function () {
    signinblock();
  };
}

var fields = {
  number: {
    // css selector
    element: "#card-number",
    placeholder: "**** **** **** ****",
  },
  expirationDate: {
    // DOM object
    element: document.getElementById("card-expiration-date"),
    placeholder: "MM / YY",
  },
  ccv: {
    element: "#card-ccv",
    placeholder: "後三碼",
  },
};

TPDirect.card.setup({
  fields: fields,
  styles: {
    // Style all elements
    input: {
      color: "gray",
    },
    // Styling ccv field
    "input.ccv": {
      // 'font-size': '16px'
    },
    // Styling expiration-date field
    "input.expiration-date": {
      // 'font-size': '16px'
    },
    // Styling card-number field
    "input.card-number": {
      // 'font-size': '16px'
    },
    // style focus state
    ":focus": {
      // 'color': 'black'
    },
    // style valid state
    ".valid": {
      color: "green",
    },
    // style invalid state
    ".invalid": {
      color: "red",
    },
    // Media queries
    // Note that these apply to the iframe, not the root window.
    "@media screen and (max-width: 400px)": {
      input: {
        color: "orange",
      },
    },
  },
  // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
  isMaskCreditCardNumber: true,
  maskCreditCardNumberRange: {
    beginIndex: 6,
    endIndex: 11,
  },
});

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

function getbookingData(url) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      // console.log(JSON.parse(this.response));
      booking_response = JSON.parse(this.response);
      // console.log(booking_response["data"]);
      if (booking_response["data"] == undefined) {
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

      _booking_image = booking_response["data"]["attraction"]["image"];
      const contentphoto = document.querySelector(".left-content");
      contentphoto.style.cssText =
        "background-image: url(" + _booking_image + ")";

      _title_name = booking_response["data"]["attraction"]["name"];
      console.log(_title_name);
      const contenttitle = document.querySelector(".contenttitle");
      contenttitle.innerHTML = "台北一日遊：" + _title_name;

      _booking_date = booking_response["data"]["date"];
      console.log(_booking_date);
      const contentdatetext = document.querySelector(".contentdatetext");
      contentdatetext.innerHTML = _booking_date;

      _booking_time = booking_response["data"]["time"];
      if (_booking_time == "morning") {
        _booking_time_text = "早上9點";
      } else if (_booking_time == "afernoon") {
        _booking_time_text = "下午4點";
      }
      const contenttimetext = document.querySelector(".contenttimetext");
      contenttimetext.innerHTML = _booking_time_text;

      _booking_price = booking_response["data"]["price"];
      console.log(_booking_price);
      const contentcosttext = document.querySelector(".contentcosttext");
      contentcosttext.innerHTML = "新台幣 " + _booking_price + " 元";

      const totaltext = document.querySelector(".totaltext");
      totaltext.innerHTML = "總價：新台幣 " + _booking_price + " 元";

      _booking_address = booking_response["data"]["attraction"]["address"];
      console.log(_booking_address);
      const contentaddresstext = document.querySelector(".contentaddresstext");
      contentaddresstext.innerHTML = _booking_address;
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

function deletebooking() {
  //判斷是否為登入狀態
  if ((cookie != "") & (cookie != "token=")) {
    token = cookie.split("=")[1];

    const data = {
      user: user,
    };
    fetch(`/api/booking`, {
      method: "DELETE",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    }).then(function (response) {
      response.json().then(function (data) {
        if (data["ok"] == true) {
          console.log(data["ok"]);
          console.log("已刪除一筆訂單");
          document.location.href = `/booking`;
        } else {
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

function finishedpaymentanddeletebooking(orderNumber) {
  //判斷是否為登入狀態
  if ((cookie != "") & (cookie != "token=")) {
    token = cookie.split("=")[1];

    const data = {
      user: user,
    };
    fetch(`/api/booking`, {
      method: "DELETE",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    }).then(function (response) {
      response.json().then(function (data) {
        if (data["ok"] == true) {
          console.log(data["ok"]);
          console.log("已刪除一筆訂單");
          document.location.href = `/thankyou?number=${orderNumber}`;
        } else {
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

function confirmandpayment() {
  let name,
    element_name = document.getElementById("contactnameinput");
  if (element_name != null) {
    name = element_name.value;
  } else {
    name = null;
  }

  let email,
    element_email = document.getElementById("contactemailinput");
  if (element_email != null) {
    email = element_email.value;
  } else {
    email = null;
  }

  let phone,
    element_phone = document.getElementById("contactphoneinput");
  if (element_phone != null) {
    phone = element_phone.value;
  } else {
    phone = null;
  }

  console.log(name, email, phone);
  console.log("確認訂單與付款");

  // Get prime
  TPDirect.card.getPrime((result) => {
    if (result.status !== 0) {
      alert("get prime error " + result.msg);
      return;
    }

    var primeCode = result.card.prime;
    console.log(booking_response["data"]["attraction"]["id"]);
    console.log(primeCode);
    const data = {
      prime: primeCode,
      order: {
        price: _booking_price,
        trip: booking_response["data"],
      },
      contact: {
        name: name,
        email: email,
        phone: phone,
      },
    };
    fetch(`/api/orders`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN":
          "partner_Fq50uDShbqf8YWInMnLzCHBBLVKxD4wSehFJIhYWXgHgoG7SQuy2RBFs",
      },
    }).then(function (response) {
      response.json().then(function (data) {
        // console.log(data);
        if (data["error"] == true) {
          console.log(data["message"]);
          if (data["message"] == "先前已付款") {
            console.log(data["ordersid"]);
            const orderNumber = data["ordersid"];
            document.location.href = `/thankyou?number=${orderNumber}`;
          }
        } else if (data["data"]["payment"]["status"] == 0) {
          console.log(data["data"]["payment"]["message"]);
          console.log(data["data"]["number"]);
          const orderNumber = data["data"]["number"];
          console.log("已付款");
          finishedpaymentanddeletebooking(orderNumber);
        }
      });
    });

    console.log(result);

    // send prime to your server, to pay with Pay by Prime API .
    // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
  });
}
