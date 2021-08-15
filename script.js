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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
let sort = false;
btnSort.addEventListener('click', function () {
  sort = !sort;
  displayMovements(currentAccount.movements, sort);
});

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance}€`;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out =
    account.movements
      .filter(mov => mov < 0)
      .reduce((acc, mov) => acc + mov, 0) * -1;
  labelSumOut.textContent = `${out}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = function (account) {
  // Display movements
  displayMovements(account.movements);

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
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Clear error message
    labelError.style.opacity = 0;

    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

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

  const amount = Number(inputTransferAmount.value);
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
    // Add positive movement to recipient
    recieverAccount.movements.push(amount);

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

  const amount = Number(inputLoanAmount.value);
  const deposits = currentAccount.movements.filter(mov => mov > 0);
  if (amount && amount > 0 && deposits.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

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
  const pinConfirm = Number(inputClosePin.value);

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
