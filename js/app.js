document.addEventListener("DOMContentLoaded", () => {
  // Размер поля 3на3
  const DIMENSION = 3;
  // Игровое поле на странице
  const grid = document.querySelector(".playing-field");
  // Двумерный массив ячеек на поле
  const board = [
    [[...grid.children][0], [...grid.children][1], [...grid.children][2]],
    [[...grid.children][3], [...grid.children][4], [...grid.children][5]],
    [[...grid.children][6], [...grid.children][7], [...grid.children][8]],
  ];
  // Поле со счетом
  const score = document.querySelector(".current-score");
  // Флаг чей ход, по умолчанию пользователя
  let isComputerMove = false;
  // Кнопка для новой игры
  const newGameButton = document.querySelector(".starting");
  // Кнопка Переиграть
  const replayButton = document.querySelector(".btn-replay");
  // Модальное окно с информацией о победе
  const winWindow = document.querySelector(".win-window");
  // Модальное окно с инструкцией к игре
  const infoWindow = document.querySelector(".information");
  // Модальное окно с историей игр
  const historyWindow = document.querySelector(".score-history");
  //Кнопка закрытия модальных окон
  const btnCloseModalsWindow = document.querySelectorAll(".btn-close");
  // Счетчик побед крестика
  let winCountUser = 0;
  // Счетчик побед нолика
  let winCountComputer = 0;
  // Счетчик сыгранных раундов
  let countOfRound = 0;

  /**
   * Подписка на базовые обработчики
   */
  function startWorkingGame() {
    // Подписка на событие клика кнопки ИГРАТЬ для начала игры
    newGameButton.addEventListener("click", newGame);

    // Подписка на открытие модального окна с инструкцией
    document
      .querySelector(".open-information")
      .addEventListener("click", function () {
        infoWindow.classList.add("modal-show");
      });

    // Подписка кнопок "закрыть" для модальных окон
    for (let i = 0; i < btnCloseModalsWindow.length; i++) {
      btnCloseModalsWindow[i].addEventListener("click", closeModalWindow);
    }

    // Подписка на открытие модального с историей счета
    document
      .querySelector(".open-history")
      .addEventListener("click", function () {
        historyWindow.classList.add("modal-show");
      });
  }

  /**
   * Закрытие всех модальных окон
   */
  function closeModalWindow() {
    winWindow.classList.remove("modal-show");
    document.querySelector(".win-window__text").innerHTML = "";
    infoWindow.classList.remove("modal-show");
    historyWindow.classList.remove("modal-show");
  }

  /**
   * Очистка игрового поля
   */
  function clearPlayingField() {
    for (let i = 0; i < DIMENSION; i++) {
      for (let j = 0; j < DIMENSION; j++) {
        board[i][j].innerHTML = "";
      }
    }
  }

  /**
   * Новая игра
   */
  function newGame() {
    document.querySelector(
      ".text-in-empty"
    ).innerHTML = `У Вас пока нет истории игр, нажмите "играть", чтобы начать.`;
    document.querySelector(".score-history__text").innerHTML = "";
    countOfRound = 1;
    newGameButton.innerHTML = "НОВАЯ ИГРА";
    isComputerMove = false;
    clearPlayingField();
    clearScore();
    Game();
  }

  /**
   * Очистка счета
   */
  function clearScore() {
    winCountUser = 0;
    winCountComputer = 0;
    score.innerHTML = "";
  }

  /**
   * Проверка, если все ячейки заполнены - игра завершена
   */
  function checkCompletedGame() {
    let result = true;
    for (let i = 0; i < DIMENSION; i++) {
      for (let j = 0; j < DIMENSION; j++) {
        if (board[i][j].innerHTML == "") {
          result = false;
          break;
        }
      }
    }
    return result;
  }

  /**
   * Переиграть игру
   */
  function replayGame() {
    isComputerMove =
      isComputerMove == false
        ? (isComputerMove = true)
        : (isComputerMove = false);
    countOfRound++;
    clearPlayingField();
    replayButton.removeEventListener("click", replayGame);
    Game();
  }

  /**
   * Обновление счета
   */
  function updateScore(winner) {
    document.querySelector(".text-in-empty").innerHTML = "";
    let textInWinModal = "";
    if (winner == "X") {
      textInWinModal = "Вы выиграли! Поздравляем!";
      winCountUser++;
    } else if (winner == "O") {
      textInWinModal =
        "Упс, кажется, компьютер Вас победил. Попробуйте снова, нажав на кпоку Новый раунд!";
      winCountComputer++;
    } else {
      textInWinModal = "Ничья";
    }
    winWindow.classList.add("modal-show");
    document.querySelector(".win-window__text").innerHTML = textInWinModal;
    for (let i = 0; i < DIMENSION; i++) {
      for (let j = 0; j < DIMENSION; j++) {
        board[i][j].removeEventListener("click", move);
      }
    }
    document.querySelector(
      ".score-history__text"
    ).innerHTML += `<div class="history-play-wraper"> 
             <span>${countOfRound} раунд</span>
             <span> ${winCountUser}  ${winCountComputer} </span>
           </div>`;
    score.innerHTML = `${winCountUser}  ${winCountComputer}`;
    replayButton.addEventListener("click", replayGame);
  }

  /**
   * Выявление победителя
   */
  function checkWinner(winSymbol) {
    let isWinner = false;
    for (let i = 0; i < DIMENSION; i++) {
      if (!isWinner) {
        if (
          board[i][0].innerHTML == `${winSymbol}` &&
          board[i][1].innerHTML == `${winSymbol}` &&
          board[i][2].innerHTML == `${winSymbol}`
        ) {
          isWinner = true;
        } else if (
          board[0][i].innerHTML == `${winSymbol}` &&
          board[1][i].innerHTML == `${winSymbol}` &&
          board[2][i].innerHTML == `${winSymbol}`
        ) {
          isWinner = true;
        }
      }
    }
    if (!isWinner) {
      if (
        board[0][0].innerHTML == `${winSymbol}` &&
        board[1][1].innerHTML == `${winSymbol}` &&
        board[2][2].innerHTML == `${winSymbol}`
      ) {
        isWinner = true;
      } else if (
        board[0][2].innerHTML == `${winSymbol}` &&
        board[1][1].innerHTML == `${winSymbol}` &&
        board[2][0].innerHTML == `${winSymbol}`
      ) {
        isWinner = true;
      }
    }

    return isWinner;
  }

  /**
   * Ход пользователя, при нажатии на ячейку
   * @param {event} event
   */
  function move(event) {
    let userMoved = false;
    if (event.currentTarget.innerHTML == "") {
      event.currentTarget.innerHTML = "X";
      userMoved = true;
    } else {
      moveUser();
    }

    if (userMoved) {
      if (checkWinner("X")) {
        updateScore("X");
      } else {
        moveComputer();
      }
    }
  }

  /**
   * Проверка, может ли выиграть компьютер или пользователь
   * @param {symbol} symbol крестик или нолик, передданые на проверку
   */
  function canWin(symbol) {
    let can = false;
    for (let i = 0; i < DIMENSION; i++) {
      if (!can) {
        if (
          (board[i][0].innerHTML == `${symbol}` &&
            board[i][1].innerHTML == `${symbol}`) ||
          (board[i][0].innerHTML == `${symbol}` &&
            board[i][2].innerHTML == `${symbol}`) ||
          (board[i][1].innerHTML == `${symbol}` &&
            board[i][2].innerHTML == `${symbol}`)
        ) {
          if (board[i][0].innerHTML == "") {
            board[i][0].innerHTML = `O`;
            can = true;
          }
          if (board[i][1].innerHTML == "") {
            board[i][1].innerHTML = `O`;
            can = true;
          }
          if (board[i][2].innerHTML == "") {
            board[i][2].innerHTML = `O`;
            can = true;
          }
        } else if (
          (board[0][i].innerHTML == `${symbol}` &&
            board[1][i].innerHTML == `${symbol}`) ||
          (board[0][i].innerHTML == `${symbol}` &&
            board[2][i].innerHTML == `${symbol}`) ||
          (board[1][i].innerHTML == `${symbol}` &&
            board[2][i].innerHTML == `${symbol}`)
        ) {
          if (board[0][i].innerHTML == "") {
            board[0][i].innerHTML = `O`;
            can = true;
          }
          if (board[1][i].innerHTML == "") {
            board[1][i].innerHTML = `O`;
            can = true;
          }
          if (board[2][i].innerHTML == "") {
            board[2][i].innerHTML = `O`;
            can = true;
          }
        }
      }
    }
    if (!can) {
      if (
        (board[0][0].innerHTML == `${symbol}` &&
          board[1][1].innerHTML == `${symbol}`) ||
        (board[0][0].innerHTML == `${symbol}` &&
          board[2][2].innerHTML == `${symbol}`) ||
        (board[1][1].innerHTML == `${symbol}` &&
          board[2][2].innerHTML == `${symbol}`)
      ) {
        if (board[0][0].innerHTML == "") {
          board[0][0].innerHTML = `O`;
          can = true;
        }
        if (board[1][1].innerHTML == "") {
          board[1][1].innerHTML = `O`;
          can = true;
        }
        if (board[2][2].innerHTML == "") {
          board[2][2].innerHTML = `O`;
          can = true;
        }
      } else if (
        (board[0][2].innerHTML == `${symbol}` &&
          board[1][1].innerHTML == `${symbol}`) ||
        (board[0][2].innerHTML == `${symbol}` &&
          board[2][0].innerHTML == `${symbol}`) ||
        (board[1][1].innerHTML == `${symbol}` &&
          board[2][0].innerHTML == `${symbol}`)
      ) {
        if (board[0][2].innerHTML == "") {
          board[0][2].innerHTML = `O`;
          can = true;
        }
        if (board[1][1].innerHTML == "") {
          board[1][1].innerHTML = `O`;
          can = true;
        }
        if (board[2][0].innerHTML == "") {
          board[2][0].innerHTML = `O`;
          can = true;
        }
      }
    }
    return can;
  }

  /**
   * Ход компьютера
   */
  function moveComputer() {
    if (!canWin("O") && !canWin("X")) {
      let continueCycle = true;
      for (let i = 0; i < DIMENSION; i++) {
        if (continueCycle) {
          for (let j = 0; j < DIMENSION; j++) {
            if (board[i][j].innerHTML == "") {
              board[i][j].innerHTML = "O";
              continueCycle = false;
              break;
            }
          }
        }
      }
    }
    moveUser();
    if (checkWinner("O")) {
      updateScore("O");
    } else if (checkCompletedGame()) {
      updateScore("");
    }
  }

  /**
   * Ход пользователя
   */
  function moveUser() {
    for (let i = 0; i < DIMENSION; i++) {
      for (let j = 0; j < DIMENSION; j++) {
        board[i][j].addEventListener("click", move);
      }
    }
  }

  /**
   * Начало игры
   */
  function Game() {
    if (isComputerMove) {
      moveComputer();
    } else {
      moveUser();
    }
  }

  startWorkingGame();
});
