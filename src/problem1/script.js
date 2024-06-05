// While Loop
var sum_to_n_a = function (n) {
  let sum = 0;
  while (n > 0) {
    sum += n;
    n--;
  }

  return sum;
};

// Recursion
var sum_to_n_b = function (n) {
  if (n > 1) {
    return n + sum_to_n_b(n - 1);
  }
  return 1;
};

// For Loop
var sum_to_n_c = function (n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
};
