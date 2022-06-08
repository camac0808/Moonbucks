
const $ = (selector) => document.querySelector(selector);

const URL = 'http://localhost:3000/api';
fetch(URL, option);


function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
    cart: [],
  };
  this.mode = "espresso";

  let setItem = (menu) => {
    localStorage.setItem("menu", JSON.stringify(this.menu));
  };

  // 새로고침시 로컬스토리지에서 정보를 가져와서 랜더링 해준다
  let getItem = (menu) => {
    parsedMenu = JSON.parse(localStorage.getItem("menu"));
    if (parsedMenu !== null) {
      this.menu = parsedMenu;
      render();
    }
  };

  // count 세기
  const updateMenuCount = () => {
    let count = this.menu[this.mode].length;
    $(".menu-count").innerText = `총 ${count}개`;
  };

  const render = () => {
    // 현재 선택한 mode(tab)의 값을 랜더링한다
    const template = menu[this.mode]
      .map((item, index) => {
        return `<li id="${index}" class="menu-list-item d-flex items-center py-2">
  <span class="${item.soldOut ? "sold-out" : ""} w-100 pl-2 menu-name">${
          item.name
        }</span>
  <button type="button" class="${
    item.shopping ? "hidden" : ""
  } bg-gray-50 text-gray-500 text-sm mr-1 menu-soldout-button">
    품절
  </button>
  <button type="button" class="${
    item.shopping ? "hidden" : ""
  } bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button">
    수정
  </button>
  <button type="button" class="bg-gray-50 text-gray-500 text-sm menu-remove-button">
    삭제
  </button>
</li>`;
      })
      .join("");

    // 리스트 추가할때마다 inserAdjacentHTML
    // $("#menu-list").insertAdjacentHTML(
    //   "beforeend",
    //   template(inputValue)
    // );

    // 리스트 추가
    $("#menu-list").innerHTML = template;
    // 리스트 갯수 세기
    updateMenuCount();
  };

  // 메뉴 추가 함수
  const addMenu = () => {
    // 공백 입력시 함수가 끝나게 한다
    let blank_pattern = /^\s+|\s+$/g;
    if ($("#menu-input").value.replace(blank_pattern, "") === "") {
      alert("Please enter the menu");
      $("#menu-input").value = "";
      return;
    }
    // 입력 값이 없을 시 함수가 끝나게 한다
    if ($("#menu-input").value === "") {
      alert("Please enter the menu");
      return;
    }
    // 입력값이 정상일 경우
    const inputValue = $("#menu-input").value;
    this.menu[this.mode].push({
      name: inputValue,
      soldOut: false,
      shopping: false,
    });
    setItem(this.menu);
    render();
    // 메뉴 추가 후 input창 빈값으로 초기화
    $("#menu-input").value = "";
    console.log(this.menu);
  };

  // 메뉴 품절
  const soldoutMenu = (e) => {
    const menuId = e.target.closest("li").id;
    // 객체 안에 지정안해도 작동한다. undefined의 부정은 true이므로
    this.menu[this.mode][menuId].soldOut =
      !this.menu[this.mode][menuId].soldOut;
    setItem(this.menu);
    render();
  };

  // 메뉴 수정
  const modifyMenu = (e) => {
    const menuName = e.target.closest("li").querySelector("span");
    const menuId = e.target.closest("li").id;
    const modifiedMenu = prompt("메뉴명을 수정해주세요", menuName.innerText);
    if (modifiedMenu == null || modifiedMenu == "") {
      return;
    }
    // menu에 저장안하면 새로고침시 리셋된다
    this.menu[this.mode][menuId].name = modifiedMenu;
    setItem(this.menu);
    render();
  };

  // 메뉴 삭제
  const removeMenu = (e) => {
    if (confirm("일정을 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").id;
      this.menu[this.mode].splice(menuId, 1);
      setItem(this.menu);
      e.target.closest("li").remove();
      render();
    }
  };

  // 메뉴 모두 삭제
  $(".delete-all-button").addEventListener("click", () => {
    this.menu[this.mode].splice(0, this.menu[this.mode].length);
    setItem(this.menu);
    render();
  });

  // form태그에 submit할때 새로고침현상 제거
  $("#menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  // input 확인 버튼 클릭시 추가
  $("#menu-submit-button").addEventListener("click", addMenu);

  // input 확인 엔터키 누르면 추가
  $("#menu-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addMenu();
    }
  });

  // 메뉴 수정, 삭제 버튼이벤트 {위임} = 상위 element에 이벤트 걸고 target classList로 찾은 후 closest element 찾는다
  $("#menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      modifyMenu(e);
      return;
    } else if (e.target.classList.contains("menu-remove-button")) {
      removeMenu(e);
      return;
    } else if (e.target.classList.contains("menu-soldout-button")) {
      soldoutMenu(e);
      return;
    }
  });
  // nav 메뉴 이벤트 첫번째 방법 : 위임
  // $("nav").addEventListener("click", (e) => {
  //   if (e.target.classList.contains("cafe-category-name")) {
  //     selectCategory(e);
  //   }
  // })
  // nav 메뉴 이벤트 두번째 방법 : forEach 각각 이벤트

  // input form 감추기
  const hideInputForm = () => {
    $(".input-form").classList.add("hidden");
    $(".add-shop-button").classList.add("hidden");
  };
  const showInputForm = () => {
    $(".input-form").classList.remove("hidden");
    $(".add-shop-button").classList.remove("hidden");
  }
  // 카테고리별 분류 및 랜더링 작업
  const categorys = document.querySelectorAll("nav button");
  categorys.forEach((category) => {
    category.addEventListener("click", (e) => {
      if (e.target.dataset.categoryName === "cart") {
        $("#menu-title h2").innerText = `🛒 장바구니 관리`;
        hideInputForm();
      } else if (e.target.dataset.categoryName !== "cart") {
        $("#menu-title h2").innerText = `${e.target.innerText} 메뉴 관리`;
        showInputForm();
      }
      const category = e.target.dataset.categoryName;
      this.mode = category;
      console.log(this.mode);
      render();
    });
  });

  // 장바구니 담기
  $(".add-shop-button").addEventListener("click", (e) => {
    // 품절된 메뉴는 제외
    if (this.menu[this.mode] !== "cart") {
      let alertMenu = [];
      let filterMenu = this.menu[this.mode].filter((item) => {
        return item.soldOut === true;
      });
      let shoppingMenu = this.menu[this.mode].filter((item) => {
        return item.soldOut === false;
      });
      shoppingMenu.forEach((item) => {
        item.shopping = true;
        this.menu.cart.push(item);
        alertMenu.push(item.name);
      });
      alert(`${alertMenu} 들을 장바구니에 담으시겠습니까?`);
      this.menu[this.mode] = filterMenu;
      setItem(this.menu);
      render();
    }
  });

  getItem(this.menu);
}

App();
