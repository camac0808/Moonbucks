// [] localStorage에 데이터를 저장한다
// [] localStorage에 데이터를 읽어온다

// [] 5가지 메뉴 각각으로 관리

// [] 페이지 최초 접근 => localStorage 접근 => 에스프레소 메뉴 가져옴
// [] 에스프레소 메뉴를 그려준다

// [] 품절상태인 경우가 보여지게 품절 버튼을 추가하고 sold-out classList를 추가하여 상태를 변경한다
// [] 품절 버튼 추가
// [] 품절 버튼을 클릭하면 localStorage에 상태값이 저장된다
// [] 클릭이벤트에서 closest li 태그의 class속성에 sold-out 추가한다

const $ = (selector) => document.querySelector(selector);
const storage = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    localStorage.getItem("menu");
  },
};

function App() {
  this.menu = [];

  // count 세기
  const updateMenuCount = () => {
    let count = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${count}개`;
  };

  // 메뉴 추가
  const addMenu = () => {
    if ($("#espresso-menu-input").value === "") {
      alert("Please enter the menu");
      return; // 함수가 끝나게 한다
    }
    const inputValue = $("#espresso-menu-input").value;
    this.menu.push({ name: inputValue });
    storage.setLocalStorage(this.menu);
    const template = menu
      .map((item) => {
        return `<li class="menu-list-item d-flex items-center py-2">
    <span class="w-100 pl-2 menu-name">${item.name}</span>
    <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button">
      수정
    </button>
    <button type="button" class="bg-gray-50 text-gray-500 text-sm menu-remove-button">
      삭제
    </button>
  </li>`;
      })
      .join("");

    // 리스트 추가할때마다 inserAdjacentHTML
    // $("#espresso-menu-list").insertAdjacentHTML(
    //   "beforeend",
    //   template(inputValue)
    // );

    // 리스트 추가
    $("#espresso-menu-list").innerHTML = template;
    // 리스트 갯수 세기
    updateMenuCount();
    // 메뉴 추가 후 input창 빈값으로 초기화
    $("#espresso-menu-input").value = "";
  };

  // 메뉴 수정
  const modifyMenu = (e) => {
    const menuName = e.target.closest("li").querySelector(".menu-name");
    const modifiedMenu = prompt("메뉴명을 수정해주세요", menuName.innerText);
    menuName.innerText = modifiedMenu;
  };

  // 메뉴 삭제
  const removeMenu = (e) => {
    if (confirm("일정을 삭제하시겠습니까?")) {
      e.target.closest("li").remove();
      updateMenuCount();
    }
  };

  // form태그에 submit할때 새로고침현상 제거
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  // 메뉴 수정, 삭제 버튼이벤트 {위임} = 상위 element에 이벤트 걸고 target classList로 찾은 후 closest element 찾는다
  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      modifyMenu(e);
    } else if (e.target.classList.contains("menu-remove-button")) {
      removeMenu(e);
    }
  });

  // 버튼 클릭시 추가
  $("#espresso-menu-submit-button").addEventListener("click", addMenu);

  // 메뉴의 이름을 입력받고 엔터키 누르면 추가
  $("#espresso-menu-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addMenu();
    }
  });
}
App();
