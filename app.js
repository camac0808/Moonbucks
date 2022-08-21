const $ = (selector) => document.querySelector(selector);
const URL = "http://localhost:3000/api";

const MenuApi = {
  async setMenu(category, name) {
    const response = await fetch(`${URL}/category/${category}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      alert("에러가 발생했습니다");
      console.error(response, "에러가 발생했습니다");
    }
  },

  async getAllMenuByCategory(category) {
    const response = await fetch(`${URL}/category/${category}/menu`);
    return response.json();
  },
  
  async updateMenu(category, name, menuId) {
    const response = await fetch(`${URL}/category/${category}/menu/${menuId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });
    if (!response.ok) {
      console.error(response, "에러가 발생했습니다");
    }
  },
  async toggleSoldOutMenu(category, menuId) {
    const response = await fetch(
      `${URL}/category/${category}/menu/${menuId}/soldout`,
      {
        method: "PUT",
      }
    );
    if (!response.ok) {
      console.error(response, "에러가 발생했습니다");
    }
  },
  async deleteMenu(category, menuId) {
    const response = await fetch(`${URL}/category/${category}/menu/${menuId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      console.error(response, "에러가 발생했습니다");
    }
  },
};

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
  // 로컬용
  let setItem = (menu) => {
    localStorage.setItem("menu", JSON.stringify(this.menu.cart));
  };
  // 새로고침시 로컬스토리지에서 정보를 가져와서 랜더링 해준다
  let getItem = (menu) => {
    parsedMenu = JSON.parse(localStorage.getItem("menu"));
    if (parsedMenu !== null) {
      this.menu.cart = parsedMenu;
      render();
    }
  };
  // 웹서버용
  let getMenu = async () => {
    const data = await MenuApi.getAllMenuByCategory(this.mode);
    this.menu[this.mode] = data;
    render();
  };

  // count 세기
  const updateMenuCount = () => {
    let count = this.menu[this.mode].length;
    $(".menu-count").innerText = `총 ${count}개`;
  };

  const render = () => {
    // 현재 선택한 mode(tab)의 값을 랜더링한다
    const template = menu[this.mode]
      .map((item) => {
        return `<li id="${
          item.id
        }" class="menu-list-item d-flex items-center py-2">
  <span class="${item.isSoldOut ? "sold-out" : ""} w-100 pl-2 menu-name">${
          item.name
        }</span>
  <button type="button" class="${
    this.mode === "cart" ? "hidden" : ""
  } bg-gray-50 text-gray-500 text-sm mr-1 menu-soldout-button">
    품절
  </button>
  <button type="button" class="${
    this.mode === "cart" ? "hidden" : ""
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

  // 메뉴 추가
  const addMenu = async () => {
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
    // 입력 값이 중복되었을 때 alert 해준다
    // find 함수를 써서 할 수도 있다.
    const overlappedItem = this.menu[this.mode].find(
      (item) => item.name === $("#menu-input").value
    );
    if (overlappedItem) {
      alert("Please enter the new menu that is not overlapped");
      $("#menu-input").value = "";
      return;
    }
    // this.menu[this.mode].forEach((item) => {
    //   if (item.name === $("#menu-input").value) {
    //     alert("Please enter the new menu that is not overlapped");
    //     return;
    //   }
    // })

    const inputValue = $("#menu-input").value;
    await MenuApi.setMenu(this.mode, inputValue);
    getMenu();
    $("#menu-input").value = "";
  };

  // 메뉴 품절
  const soldoutMenu = async (e) => {
    const menuId = e.target.closest("li").id;
    // 객체 안에 지정안해도 작동한다. undefined의 부정은 true이므로
    // this.menu[this.mode][menuId].soldOut =
    //   !this.menu[this.mode][menuId].soldOut;
    await MenuApi.toggleSoldOutMenu(this.mode, menuId);
    getMenu();
  };

  // 메뉴 수정
  const modifyMenu = async (e) => {
    const menuName = e.target.closest("li").querySelector("span");
    const menuId = e.target.closest("li").id;
    const modifiedMenu = prompt("메뉴명을 수정해주세요", menuName.innerText);
    if (modifiedMenu == null || modifiedMenu == "") {
      return;
    }
    // 새로 수정한 내역을 서버에 업데이트 해준다
    await MenuApi.updateMenu(this.mode, modifiedMenu, menuId);
    // menu에 저장안하면 새로고침시 리셋된다
    getMenu();
  };

  // 메뉴 삭제
  const removeMenu = async (e) => {
    if (confirm("일정을 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").id;
      // this.menu[this.mode].splice(menuId, 1);
      // setItem(this.menu);
      // e.target.closest("li").remove();
      // render();
      await MenuApi.deleteMenu(this.mode, menuId);
      getMenu();
    }
  };

  // 메뉴 모두 삭제
  $(".delete-all-button").addEventListener("click", async () => {
    // this.menu[this.mode].splice(0, this.menu[this.mode].length);
    for (let i = 0; i < this.menu[this.mode].length; i++) {
      let menuId = this.menu[this.mode][i].id;
      await MenuApi.deleteMenu(this.mode, menuId);
    }
    getMenu();
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
  };

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
      console.log(category);
      if (category === "cart") {
        this.mode = category;
        getItem();
      } else if (category !== "cart") {
        this.mode = category;
        getMenu();
      }
    });
  });

  // 장바구니 담기 : this.menu.cart 배열에 먼저 담고 그 이후에 setItem하면 cart 전체가 localStorage에 들어감
  $(".add-shop-button").addEventListener("click", async (e) => {
    let alertMenu = [];
    let cartMenu = this.menu[this.mode].filter((item) => {
      return item.isSoldOut === false;
    });
    cartMenu.forEach((item) => {
      this.menu.cart.push(item);
      alertMenu.push(item.name);
    });
    console.log(cartMenu, this.menu.cart);
    alert(`${alertMenu} 들을 장바구니에 담으시겠습니까?`);
    setItem();
  });
  getItem();
  getMenu();
}

App();
