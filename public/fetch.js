var isLoading = false;

var nextPage;

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
        _photo_div.classList.add("photo");
        _photo_div.style.cssText = "background-image: url(" + file + ")";

        let _photo_mask = document.createElement("div");
        _photo_mask.classList.add("photo_mask");
        let _mask_title = document.createElement("div");
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

      view.style.display = "none";
    });
  }
}

function hideview() {
  const view = document.querySelector(".categoryview");
  view.style.display = "none";
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
          // console.log(posts);
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
          _photo_div.classList.add("photo");
          _photo_div.style.cssText = "background-image: url(" + file + ")";

          let _photo_mask = document.createElement("div");
          _photo_mask.classList.add("photo_mask");
          let _mask_title = document.createElement("div");
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
        // console.log(posts);
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
        _photo_div.classList.add("photo");
        _photo_div.style.cssText = "background-image: url(" + file + ")";

        let _photo_mask = document.createElement("div");
        _photo_mask.classList.add("photo_mask");
        let _mask_title = document.createElement("div");
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
  } else {
    return;
  }
});
