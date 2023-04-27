"use strict";

const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

// const dummyTransactions = [
//   { id: 1, text: "Flower", amount: -20 },
//   { id: 2, text: "Salary", amount: 300 },
//   { id: 3, text: "Book", amount: -10 },
//   { id: 4, text: "Camera", amount: 150 },
// ];

// console.table(dummyTransactions);

/////////////////////////////
// LOCAL STORAGE

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Update local storage transactions
const updateLocalStorage = function () {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

/////////////////////////////
// FUNCTIONS

// Generate random ID
const generateID = function () {
  return Math.floor(Math.random() * 100000000);
};

// Remove transaction by ID
const removeTransaction = function (id) {
  // update transactions array by removing the transaction taht contains the id that we click
  transactions = transactions.filter((transaction) => transaction.id !== id);

  // update local storage
  updateLocalStorage();

  // update initial state
  init();
};

// Add transaction
const addTransaction = function (e) {
  e.preventDefault();

  // catch error for incorrect input values
  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add a text and amount 🙂");
  } else {
    // create the transaction object
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
    };

    // push the object into the transactions array
    transactions.push(transaction);

    // display in DOM
    addTransactionDOM(transaction);

    // update Balance, income, expense
    updateValues();

    // update local storage
    updateLocalStorage();

    // clear input fields
    text.value = "";
    amount.value = "";
  }
};

// Add transactions to DOM list
const addTransactionDOM = function (transaction) {
  // get the sign - or +
  const sign = transaction.amount < 0 ? "-" : "+";

  // create a new DOM list element
  const item = document.createElement("li");

  // add class minus or plus based on value
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  // add text to the item
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>
  `;

  // insert item in the list container ul
  list.prepend(item);
};

// Update balance, income and expense
const updateValues = function () {
  // get a new array only with the amounts
  const amounts = transactions.map((transaction) => transaction.amount);

  // get the total amount
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);

  // get income
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);

  // get expense
  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  // console.log(amounts, total, income, expense);

  // insert balance, income and expense
  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
};

// Init function
const init = function () {
  // clear all list
  list.innerHTML = "";

  // loop to get all single transactions
  transactions.forEach(addTransactionDOM);

  // update the values (balance - income -expense)
  updateValues();
};

init();

/////////////////////////////
// EVENT LISTENERS
form.addEventListener("submit", addTransaction);
