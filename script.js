'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const labelError = document.querySelector('.error');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const containerTransfers = document.querySelector('.operation--transfer');
const containerClose = document.querySelector('.operation--close');
const containerLoan = document.querySelector('.operation--loan');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach(function (mov, i) {
    const date = new Date(account.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
let sort = false;
btnSort.addEventListener('click', function () {
  sort = !sort;
  displayMovements(currentAccount, sort);
});

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out =
    account.movements
      .filter(mov => mov < 0)
      .reduce((acc, mov) => acc + mov, 0) * -1;
  labelSumOut.textContent = `${out.toFixed(2)}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const updateUI = function (account) {
  // Display movements
  displayMovements(account);

  // Display balance
  calcDisplayBalance(account);

  // Display summary
  calcDisplaySummary(account);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// Event handlers
let currentAccount;

// FAKE LOG IN
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 1;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Clear error message
    labelError.style.opacity = 0;

    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    // Create current date and time
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    console.log(hour, min);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  } else {
    labelError.style.opacity = 1;
  }
});

// TRANSFER
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const displayMessage = function (message) {
    containerTransfers.style.background =
      message === 'success' ? '#66c873' : '#f5465d';
    setTimeout(() => {
      containerTransfers.style.background =
        'linear-gradient(to top left, #ffb003, #ffcb03)';
    }, 400);
  };

  const amount = +inputTransferAmount.value;
  const recieverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    recieverAccount &&
    amount > 0 &&
    amount <= currentAccount.balance &&
    recieverAccount.username !== currentAccount.username
  ) {
    // Add negative movement to current user
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    // Add positive movement to recipient
    recieverAccount.movements.push(amount);
    recieverAccount.movementsDates.push(new Date().toISOString());

    // Update UI:
    updateUI(currentAccount);

    displayMessage('success');
  } else {
    displayMessage('error');
  }
  // Clear the input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferTo.blur();
});

// LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const displayMessage = function (message) {
    containerLoan.style.background =
      message === 'success' ? 'green' : '#f5465d';
    setTimeout(() => {
      containerLoan.style.background =
        'linear-gradient(to top left, #39b385, #9be15d)';
    }, 400);
  };

  const amount = Math.floor(inputLoanAmount.value);
  const deposits = currentAccount.movements.filter(mov => mov > 0);
  if (amount && amount > 0 && deposits.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);

    displayMessage('success');
  } else {
    displayMessage('error');
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// CLOSE ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const displayMessage = function (message) {
    containerClose.style.background = message === 'success' ? '#66c873' : 'red';
    setTimeout(() => {
      containerClose.style.background =
        'linear-gradient(to top left, #e52a5a, #ff585f)';
    }, 400);
  };

  const usernameConfirm = inputCloseUsername.value;
  const pinConfirm = +inputClosePin.value;

  // Check if credentials are correct
  if (
    usernameConfirm &&
    pinConfirm &&
    usernameConfirm === currentAccount.username &&
    pinConfirm === currentAccount.pin
  ) {
    // Delete user
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);

    // Log user out (Hide UI)
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  } else {
    displayMessage('error');
  }
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// Converting and checking numbers
/*
console.log(23 === 23.0);

// Base 10 - 0 to 9
// Binary base 2 - 0 and 1
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);

console.log(Number('23'));
console.log(+'23');

// Parsing
console.log(Number.parseInt('30px', 10));
console.log(Number.parseInt('e23', 10));

console.log(Number.parseInt('2.5rem'));
console.log(Number.parseFloat('2.5rem'));

console.log(parseFloat(' 2.5rem   '));

// Check if value is not a number
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20X'));
console.log(Number.isNaN(20 / 0));

// Checking if a value is a number
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20x'));
console.log(Number.isFinite(20 / 0));

console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23 / 0));
*/
/*
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3));

console.log(Math.max(5, 18, 23, 11, 2));
console.log(Math.max(5, 18, '23', 11, 2));
console.log(Math.max(5, 18, '23px', 11, 2));

console.log(Math.min(5, 18, 23, 11, 2));

console.log(Math.PI * Number.parseFloat('10px') ** 2);

console.log(Math.trunc(Math.random() * 6) + 1);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
// 0...1 -> 0...(max-min) -> min...max
console.log(randomInt(10, 20));

// Rounding integers
console.log(Math.trunc(23.3));

console.log(Math.round(23.3));
console.log(Math.round(23.9));

console.log(Math.ceil(23.9));
console.log(Math.ceil(23.9));

console.log(Math.floor(23.9));
console.log(Math.floor('23.9'));

console.log(Math.trunc(23.9));

console.log(Math.trunc(-23.9));
console.log(Math.floor(-23.9));

// Rounding floats
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2));
console.log(+(2.345).toFixed(2));
*/
/*
// Remainnder
console.log(5 % 2);
console.log(8 % 3);

console.log(6 % 2);

const isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(514));

labelBalance.addEventListener('click', function () {
  console.log('color');
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.background = 'orangered';
    // 0, 6, 3, 9
    if (i % 3 === 0) row.style.background = 'blue';
  });
});
*/
/*
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 4);

console.log(4674367643767684839733n);
console.log(BigInt(74749749739397393797397397379));

// Operations
console.log(10000n + 10000n);
console.log(100739793792973023097203200n * 30000n);
// console.log(Math.sqrt(16n));

const huge = 238638263863823682683263286n;
const num = 23;
console.log(huge * BigInt(num));

// Exception
console.log(20n > 15);
console.log(20n === 20); // false
console.log(typeof 20n);
console.log(20n == '20'); // true

console.log(huge + ' is Really big!! (thats what she said) ');

// Division
console.log(11n / 3n);
console.log(10 / 3);
*/

// Create a date
/*
const now = new Date();
console.log(now);

console.log(new Date('Aug 16 2021 10:57:11'));
console.log(new Date('December 24, 2015'));
console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 10, 19, 15, 23, 5));
console.log(new Date(2037, 10, 33));

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));
*/

/*
// Working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());
console.log(future.getTime());

console.log(new Date(2142235380000));

console.log(Date.now());

future.setFullYear(2040);
console.log(future);
*/
