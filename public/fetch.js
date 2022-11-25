var nextPage;

function getdata() {
  //讀取資料
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
        let title_name = posts["name"];
        let title_mrt = posts["mrt"];
        let title_category = posts["category"];

        let file = posts["images"][0];
        let link = file;

        //製作卡片 //跑12次
        let list = "list-block";
        var newcard = document.getElementsByClassName(list);
        var _card_div = document.createElement("div");
        _card_div.classList.add("card");

        var _image_container_div = document.createElement("div");
        _image_container_div.classList.add("image_container");

        var _photo_div = document.createElement("div");
        _photo_div.classList.add("photo");
        _photo_div.style.cssText = "background-image: url(" + file + ")";

        var _photo_mask = document.createElement("div");
        _photo_mask.classList.add("photo_mask");
        var _mask_title = document.createElement("div");
        _mask_title.classList.add("mask_title");
        var _newcard_title_text = document.createTextNode(title_name);
        _mask_title.appendChild(_newcard_title_text);

        var _card_inform = document.createElement("div");
        _card_inform.classList.add("card_inform");
        var _mrt_inform = document.createElement("div");
        _mrt_inform.classList.add("mrt_inform");
        var _mrt_inform_text = document.createTextNode(title_mrt);
        _mrt_inform.appendChild(_mrt_inform_text);
        var _category_inform = document.createElement("div");
        _category_inform.classList.add("category_inform");
        var _category_inform_text = document.createTextNode(title_category);

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
}
getdata();

function getmoredata() {
  //再次讀取資料
  if (nextPage !== null) {
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
          // console.log(posts);
          let title_name = posts["name"];
          let title_mrt = posts["mrt"];
          let title_category = posts["category"];

          let file = posts["images"][0];
          let link = file;

          //製作卡片 //跑12次
          let list = "list-block";
          var newcard = document.getElementsByClassName(list);
          var _card_div = document.createElement("div");
          _card_div.classList.add("card");

          var _image_container_div = document.createElement("div");
          _image_container_div.classList.add("image_container");

          var _photo_div = document.createElement("div");
          _photo_div.classList.add("photo");
          _photo_div.style.cssText = "background-image: url(" + file + ")";

          var _photo_mask = document.createElement("div");
          _photo_mask.classList.add("photo_mask");
          var _mask_title = document.createElement("div");
          _mask_title.classList.add("mask_title");
          var _newcard_title_text = document.createTextNode(title_name);
          _mask_title.appendChild(_newcard_title_text);

          var _card_inform = document.createElement("div");
          _card_inform.classList.add("card_inform");
          var _mrt_inform = document.createElement("div");
          _mrt_inform.classList.add("mrt_inform");
          var _mrt_inform_text = document.createTextNode(title_mrt);
          _mrt_inform.appendChild(_mrt_inform_text);
          var _category_inform = document.createElement("div");
          _category_inform.classList.add("category_inform");
          var _category_inform_text = document.createTextNode(title_category);

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
      });
  } else {
    return;
  }
}

function getsearchdata() {
  //清空舊資料
  let rest = document.querySelector(".list-block");
  rest.innerHTML = "";
  // console.log("hiii", rest);
  //讀取資料
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
        let title_name = posts["name"];
        let title_mrt = posts["mrt"];
        let title_category = posts["category"];

        let file = posts["images"][0];
        let link = file;

        //製作卡片 //跑12次
        let list = "list-block";
        var newcard = document.getElementsByClassName(list);
        var _card_div = document.createElement("div");
        _card_div.classList.add("card");

        var _image_container_div = document.createElement("div");
        _image_container_div.classList.add("image_container");

        var _photo_div = document.createElement("div");
        _photo_div.classList.add("photo");
        _photo_div.style.cssText = "background-image: url(" + file + ")";

        var _photo_mask = document.createElement("div");
        _photo_mask.classList.add("photo_mask");
        var _mask_title = document.createElement("div");
        _mask_title.classList.add("mask_title");
        var _newcard_title_text = document.createTextNode(title_name);
        _mask_title.appendChild(_newcard_title_text);

        var _card_inform = document.createElement("div");
        _card_inform.classList.add("card_inform");
        var _mrt_inform = document.createElement("div");
        _mrt_inform.classList.add("mrt_inform");
        var _mrt_inform_text = document.createTextNode(title_mrt);
        _mrt_inform.appendChild(_mrt_inform_text);
        var _category_inform = document.createElement("div");
        _category_inform.classList.add("category_inform");
        var _category_inform_text = document.createTextNode(title_category);

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
}

const div = document.querySelector(".footer");

let here = 0;

// 使用 getBoundingClientRect
window.addEventListener("scroll", function once(e) {
  const { top } = div.getBoundingClientRect();
  if (top <= window.innerHeight) {
    here = 1;
    console.log("元素底端已進入畫面");
    getmoredata();
  }
});
