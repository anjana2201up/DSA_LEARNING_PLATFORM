// data/problems.js
// The practice problems database for the auto-grader and playground.

const GENERIC_CPP_STARTER = `// C++ starter template
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <unordered_map>
#include <stack>

using namespace std;

// Write your solution here
`;

const GENERIC_JAVA_STARTER = `// Java starter template (Do not modify the Main class name)
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Write your solution and debug statements here.");
    }
}
`;

const PROBLEMS = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "easy",
    tags: ["arrays", "hash-table"],
    description: "Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.<br/><br/>You may assume that each input would have exactly one solution, and you may not use the same element twice.<br/><br/>You can return the answer in any order.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    functionName: "twoSum",
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your code here
}`
    },
    testCases: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] }
    ]
  },
  {
    id: "palindrome-number",
    title: "Palindrome Number",
    difficulty: "easy",
    tags: ["math", "two-pointers"],
    description: "Given an integer <code>x</code>, return <code>true</code> if <code>x</code> is a palindrome, and <code>false</code> otherwise.<br/><br/>An integer is a palindrome when it reads the same backward as forward. For example, <code>121</code> is palindrome while <code>123</code> is not.",
    examples: [
      {
        input: "x = 121",
        output: "true"
      },
      {
        input: "x = -121",
        output: "false",
        explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
      }
    ],
    constraints: [
      "-2^31 <= x <= 2^31 - 1"
    ],
    functionName: "isPalindrome",
    starterCode: {
      javascript: `function isPalindrome(x) {
  // Write your code here
}`
    },
    testCases: [
      { args: [121], expected: true },
      { args: [-121], expected: false },
      { args: [10], expected: false },
      { args: [0], expected: true }
    ]
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "easy",
    tags: ["stack", "strings"],
    description: "Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.<br/><br/>An input string is valid if:<br/>1. Open brackets must be closed by the same type of brackets.<br/>2. Open brackets must be closed in the correct order.<br/>3. Every close bracket has a corresponding open bracket of the same type.",
    examples: [
      {
        input: "s = '()'",
        output: "true"
      },
      {
        input: "s = '()[]{}'",
        output: "true"
      },
      {
        input: "s = '(]'",
        output: "false"
      }
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only: '()[]{}'"
    ],
    functionName: "isValid",
    starterCode: {
      javascript: `function isValid(s) {
  // Write your code here
}`
    },
    testCases: [
      { args: ["()"], expected: true },
      { args: ["()[]{}"], expected: true },
      { args: ["(]"], expected: false },
      { args: ["([])"], expected: true },
      { args: ["("], expected: false }
    ]
  }
];

module.exports = {
  PROBLEMS,
  GENERIC_CPP_STARTER,
  GENERIC_JAVA_STARTER
};