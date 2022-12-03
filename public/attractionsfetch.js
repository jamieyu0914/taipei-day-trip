var isLoading = false;

var file;

var thelenth = 0;

var fileindex = 0;

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
      let link = file[0];

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
  //圖片向左切換
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
}

function imageright() {
  //圖片向右切換
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
}
