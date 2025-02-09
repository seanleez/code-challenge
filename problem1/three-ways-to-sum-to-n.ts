/**
 * Three different approaches to calculate the sum of numbers from 1 to n.
 * All functions assume n >= 1
 */

/**
 * Iterative approach
 * Time complexity: O(n)
 * Space complexity: O(1)
 */
const sumToN1 = (n: number): number => {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

/**
 * Mathematical approach using arithmetic sequence formula
 * Formula: sum = (n * (n + 1)) / 2
 * Time complexity: O(1)
 * Space complexity: O(1)
 */
const sumToN2 = (n: number): number => {
  return (n * (n + 1)) / 2;
};

/**
 * Recursive approach
 * Time complexity: O(n)
 * Space complexity: O(n) due to call stack
 */
const sumToN3 = (n: number): number => {
  return n === 1 ? 1 : n + sumToN3(n - 1);
};


