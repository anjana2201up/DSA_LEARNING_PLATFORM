// data/problems-extra.js
// 100 additional problems (auto-generated + verified against
// reference solutions in scripts/generate-extra.js — see that file for the
// verification method). Same schema as data/problems.js.

const PROBLEMS_EXTRA = [
  {
    "id": "two-sum-ii-sorted",
    "title": "Two Sum II - Input Array Is Sorted",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Two Pointers",
      "Binary Search"
    ],
    "description": "<p>Given a 1-indexed sorted array <code>numbers</code>, find two numbers that add up to <code>target</code>. Return their 1-indexed positions <code>[i, j]</code> with <code>i &lt; j</code>.</p>",
    "examples": [
      {
        "input": "numbers = [2,7,11,15], target = 9",
        "output": "[1,2]"
      }
    ],
    "constraints": [
      "2 ≤ numbers.length ≤ 3*10^4",
      "numbers is sorted ascending",
      "Exactly one solution exists"
    ],
    "functionName": "twoSumSorted",
    "starterCode": {
      "javascript": "function twoSumSorted(numbers, target) {\n  // your code here\n}",
      "python": "def twoSumSorted(numbers, target):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            2,
            7,
            11,
            15
          ],
          9
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "args": [
          [
            2,
            3,
            4
          ],
          6
        ],
        "expected": [
          1,
          3
        ]
      },
      {
        "args": [
          [
            -1,
            0
          ],
          -1
        ],
        "expected": [
          1,
          2
        ]
      }
    ]
  },
  {
    "id": "three-sum",
    "title": "3Sum",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Two Pointers",
      "Sorting"
    ],
    "description": "<p>Given an integer array <code>nums</code>, return all unique triplets <code>[a,b,c]</code> such that <code>a+b+c=0</code>. Each returned triplet is sorted ascending; the outer list is sorted lexicographically.</p>",
    "examples": [
      {
        "input": "nums = [-1,0,1,2,-1,-4]",
        "output": "[[-1,-1,2],[-1,0,1]]"
      }
    ],
    "constraints": [
      "3 ≤ nums.length ≤ 3000"
    ],
    "functionName": "threeSum",
    "starterCode": {
      "javascript": "function threeSum(nums) {\n  // your code here\n}",
      "python": "def threeSum(nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            -1,
            0,
            1,
            2,
            -1,
            -4
          ]
        ],
        "expected": [
          [
            -1,
            -1,
            2
          ],
          [
            -1,
            0,
            1
          ]
        ]
      },
      {
        "args": [
          [
            0,
            1,
            1
          ]
        ],
        "expected": []
      },
      {
        "args": [
          [
            0,
            0,
            0
          ]
        ],
        "expected": [
          [
            0,
            0,
            0
          ]
        ]
      }
    ]
  },
  {
    "id": "product-except-self",
    "title": "Product of Array Except Self",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Prefix Sum"
    ],
    "description": "<p>Given an array <code>nums</code>, return an array where each element is the product of all other elements (without using division).</p>",
    "examples": [
      {
        "input": "nums = [1,2,3,4]",
        "output": "[24,12,8,6]"
      }
    ],
    "constraints": [
      "2 ≤ nums.length ≤ 10^5"
    ],
    "functionName": "productExceptSelf",
    "starterCode": {
      "javascript": "function productExceptSelf(nums) {\n  // your code here\n}",
      "python": "def productExceptSelf(nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3,
            4
          ]
        ],
        "expected": [
          24,
          12,
          8,
          6
        ]
      },
      {
        "args": [
          [
            -1,
            1,
            0,
            -3,
            3
          ]
        ],
        "expected": [
          0,
          0,
          9,
          0,
          0
        ]
      }
    ]
  },
  {
    "id": "find-duplicate-number",
    "title": "Find the Duplicate Number",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Binary Search",
      "Cyclic Sort"
    ],
    "description": "<p>Given an array <code>nums</code> of n+1 integers in range <code>[1,n]</code>, with exactly one number repeated, find that number without modifying the array or using extra space beyond O(1).</p>",
    "examples": [
      {
        "input": "nums = [1,3,4,2,2]",
        "output": "2"
      }
    ],
    "constraints": [
      "1 ≤ n ≤ 10^5"
    ],
    "functionName": "findDuplicate",
    "starterCode": {
      "javascript": "function findDuplicate(nums) {\n  // your code here\n}",
      "python": "def findDuplicate(nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            1,
            3,
            4,
            2,
            2
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            3,
            1,
            3,
            4,
            2
          ]
        ],
        "expected": 3
      }
    ]
  },
  {
    "id": "find-all-duplicates",
    "title": "Find All Duplicates in an Array",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Cyclic Sort"
    ],
    "description": "<p>Given an array <code>nums</code> of n integers where each is in range <code>[1,n]</code>, some appearing twice, return all the duplicates (any order — result is sorted here for consistent grading).</p>",
    "examples": [
      {
        "input": "nums = [4,3,2,7,8,2,3,1]",
        "output": "[2,3]"
      }
    ],
    "constraints": [
      "1 ≤ n ≤ 10^5"
    ],
    "functionName": "findDuplicates",
    "starterCode": {
      "javascript": "function findDuplicates(nums) {\n  // your code here\n}",
      "python": "def findDuplicates(nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            4,
            3,
            2,
            7,
            8,
            2,
            3,
            1
          ]
        ],
        "expected": [
          2,
          3
        ]
      },
      {
        "args": [
          [
            1,
            1,
            2
          ]
        ],
        "expected": [
          1
        ]
      }
    ]
  },
  {
    "id": "rotate-array",
    "title": "Rotate Array",
    "difficulty": "Medium",
    "tags": [
      "Array"
    ],
    "description": "<p>Given an array <code>nums</code>, rotate it to the right by <code>k</code> steps. Return the rotated array.</p>",
    "examples": [
      {
        "input": "nums = [1,2,3,4,5,6,7], k = 3",
        "output": "[5,6,7,1,2,3,4]"
      }
    ],
    "constraints": [
      "1 ≤ nums.length ≤ 10^5"
    ],
    "functionName": "rotate",
    "starterCode": {
      "javascript": "function rotate(nums, k) {\n  // your code here\n}",
      "python": "def rotate(nums, k):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3,
            4,
            5,
            6,
            7
          ],
          3
        ],
        "expected": [
          5,
          6,
          7,
          1,
          2,
          3,
          4
        ]
      },
      {
        "args": [
          [
            -1,
            -100,
            3,
            99
          ],
          2
        ],
        "expected": [
          3,
          99,
          -1,
          -100
        ]
      }
    ]
  },
  {
    "id": "max-consecutive-ones",
    "title": "Max Consecutive Ones",
    "difficulty": "Easy",
    "tags": [
      "Array"
    ],
    "description": "<p>Given a binary array <code>nums</code>, return the maximum number of consecutive 1s.</p>",
    "examples": [
      {
        "input": "nums = [1,1,0,1,1,1]",
        "output": "3"
      }
    ],
    "constraints": [
      "1 ≤ nums.length ≤ 10^5"
    ],
    "functionName": "findMaxConsecutiveOnes",
    "starterCode": {
      "javascript": "function findMaxConsecutiveOnes(nums) {\n  // your code here\n}",
      "python": "def findMaxConsecutiveOnes(nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            1,
            1,
            0,
            1,
            1,
            1
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            1,
            0,
            1,
            1,
            0,
            1
          ]
        ],
        "expected": 2
      }
    ]
  },
  {
    "id": "third-maximum-number",
    "title": "Third Maximum Number",
    "difficulty": "Easy",
    "tags": [
      "Array"
    ],
    "description": "<p>Given an integer array <code>nums</code>, return the third distinct maximum. If it doesn't exist, return the maximum.</p>",
    "examples": [
      {
        "input": "nums = [3,2,1]",
        "output": "1"
      }
    ],
    "constraints": [
      "1 ≤ nums.length ≤ 10^4"
    ],
    "functionName": "thirdMax",
    "starterCode": {
      "javascript": "function thirdMax(nums) {\n  // your code here\n}",
      "python": "def thirdMax(nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            3,
            2,
            1
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            1,
            2
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            2,
            2,
            3,
            1
          ]
        ],
        "expected": 1
      }
    ]
  },
  {
    "id": "squares-of-sorted-array",
    "title": "Squares of a Sorted Array",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Two Pointers"
    ],
    "description": "<p>Given a sorted array <code>nums</code> (possibly with negatives), return the squares of each number, also sorted ascending.</p>",
    "examples": [
      {
        "input": "nums = [-4,-1,0,3,10]",
        "output": "[0,1,9,16,100]"
      }
    ],
    "constraints": [
      "1 ≤ nums.length ≤ 10^4"
    ],
    "functionName": "sortedSquares",
    "starterCode": {
      "javascript": "function sortedSquares(nums) {\n  // your code here\n}",
      "python": "def sortedSquares(nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            -4,
            -1,
            0,
            3,
            10
          ]
        ],
        "expected": [
          0,
          1,
          9,
          16,
          100
        ]
      },
      {
        "args": [
          [
            -7,
            -3,
            2,
            3,
            11
          ]
        ],
        "expected": [
          4,
          9,
          9,
          49,
          121
        ]
      }
    ]
  },
  {
    "id": "merge-sorted-array",
    "title": "Merge Sorted Array",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Two Pointers"
    ],
    "description": "<p>Given sorted arrays <code>nums1</code> (first <code>m</code> elements valid) and <code>nums2</code> (<code>n</code> elements), return the merged sorted array of length <code>m+n</code>.</p>",
    "examples": [
      {
        "input": "nums1=[1,2,3,0,0,0], m=3, nums2=[2,5,6], n=3",
        "output": "[1,2,2,3,5,6]"
      }
    ],
    "constraints": [
      "0 ≤ m,n ≤ 200"
    ],
    "functionName": "mergeSortedArray",
    "starterCode": {
      "javascript": "function mergeSortedArray(nums1, m, nums2, n) {\n  // your code here\n}",
      "python": "def mergeSortedArray(nums1, m, nums2, n):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3,
            0,
            0,
            0
          ],
          3,
          [
            2,
            5,
            6
          ],
          3
        ],
        "expected": [
          1,
          2,
          2,
          3,
          5,
          6
        ]
      },
      {
        "args": [
          [
            1
          ],
          1,
          [],
          0
        ],
        "expected": [
          1
        ]
      }
    ]
  },
  {
    "id": "remove-duplicates-sorted-array",
    "title": "Remove Duplicates from Sorted Array",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Two Pointers"
    ],
    "description": "<p>Given a sorted array <code>nums</code>, return the array of unique elements (order preserved).</p>",
    "examples": [
      {
        "input": "nums = [1,1,2]",
        "output": "[1,2]"
      }
    ],
    "constraints": [
      "1 ≤ nums.length ≤ 3*10^4"
    ],
    "functionName": "removeDuplicates",
    "starterCode": {
      "javascript": "function removeDuplicates(nums) {\n  // your code here\n}",
      "python": "def removeDuplicates(nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            1,
            1,
            2
          ]
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "args": [
          [
            0,
            0,
            1,
            1,
            1,
            2,
            2,
            3,
            3,
            4
          ]
        ],
        "expected": [
          0,
          1,
          2,
          3,
          4
        ]
      }
    ]
  },
  {
    "id": "array-partition",
    "title": "Array Partition I",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Greedy",
      "Sorting"
    ],
    "description": "<p>Given <code>2n</code> integers, pair them up to maximize the sum of the minimum of each pair. Return that maximum sum.</p>",
    "examples": [
      {
        "input": "nums = [1,4,3,2]",
        "output": "4",
        "explanation": "Pair as (1,2) and (3,4): min sum = 1+3 = 4."
      }
    ],
    "constraints": [
      "nums.length is even"
    ],
    "functionName": "arrayPairSum",
    "starterCode": {
      "javascript": "function arrayPairSum(nums) {\n  // your code here\n}",
      "python": "def arrayPairSum(nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            1,
            4,
            3,
            2
          ]
        ],
        "expected": 4
      },
      {
        "args": [
          [
            6,
            2,
            6,
            5,
            1,
            2
          ]
        ],
        "expected": 9
      }
    ]
  },
  {
    "id": "container-with-most-water",
    "title": "Container With Most Water",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Two Pointers"
    ],
    "description": "<p>Given heights <code>height[i]</code> for n vertical lines, find two lines that together with the x-axis form a container holding the most water. Return the max area.</p>",
    "examples": [
      {
        "input": "height = [1,8,6,2,5,4,8,3,7]",
        "output": "49"
      }
    ],
    "constraints": [
      "2 ≤ height.length ≤ 10^5"
    ],
    "functionName": "maxArea",
    "starterCode": {
      "javascript": "function maxArea(height) {\n  // your code here\n}",
      "python": "def maxArea(height):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            1,
            8,
            6,
            2,
            5,
            4,
            8,
            3,
            7
          ]
        ],
        "expected": 49
      },
      {
        "args": [
          [
            1,
            1
          ]
        ],
        "expected": 1
      }
    ]
  },
  {
    "id": "trapping-rain-water",
    "title": "Trapping Rain Water",
    "difficulty": "Hard",
    "tags": [
      "Array",
      "Two Pointers",
      "DP"
    ],
    "description": "<p>Given elevation heights, compute how much rainwater can be trapped between the bars.</p>",
    "examples": [
      {
        "input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        "output": "6"
      }
    ],
    "constraints": [
      "1 ≤ height.length ≤ 2*10^4"
    ],
    "functionName": "trap",
    "starterCode": {
      "javascript": "function trap(height) {\n  // your code here\n}",
      "python": "def trap(height):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            0,
            1,
            0,
            2,
            1,
            0,
            1,
            3,
            2,
            1,
            2,
            1
          ]
        ],
        "expected": 6
      },
      {
        "args": [
          [
            4,
            2,
            0,
            3,
            2,
            5
          ]
        ],
        "expected": 9
      }
    ]
  },
  {
    "id": "sort-colors",
    "title": "Sort Colors",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Two Pointers",
      "Sorting"
    ],
    "description": "<p>Given an array with values 0, 1, and 2 representing colors, sort them in place so same colors are adjacent, in the order 0,1,2. Return the sorted array.</p>",
    "examples": [
      {
        "input": "nums = [2,0,2,1,1,0]",
        "output": "[0,0,1,1,2,2]"
      }
    ],
    "constraints": [
      "1 ≤ nums.length ≤ 300"
    ],
    "functionName": "sortColors",
    "starterCode": {
      "javascript": "function sortColors(nums) {\n  // your code here\n}",
      "python": "def sortColors(nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            2,
            0,
            2,
            1,
            1,
            0
          ]
        ],
        "expected": [
          0,
          0,
          1,
          1,
          2,
          2
        ]
      },
      {
        "args": [
          [
            2,
            0,
            1
          ]
        ],
        "expected": [
          0,
          1,
          2
        ]
      }
    ]
  },
  {
    "id": "remove-element",
    "title": "Remove Element",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Two Pointers"
    ],
    "description": "<p>Given an array <code>nums</code> and a value <code>val</code>, remove all instances of <code>val</code> in place, preserving order, and return the remaining elements.</p>",
    "examples": [
      {
        "input": "nums = [3,2,2,3], val = 3",
        "output": "[2,2]"
      }
    ],
    "constraints": [
      "0 ≤ nums.length ≤ 100"
    ],
    "functionName": "removeElement",
    "starterCode": {
      "javascript": "function removeElement(nums, val) {\n  // your code here\n}",
      "python": "def removeElement(nums, val):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            3,
            2,
            2,
            3
          ],
          3
        ],
        "expected": [
          2,
          2
        ]
      },
      {
        "args": [
          [
            0,
            1,
            2,
            2,
            3,
            0,
            4,
            2
          ],
          2
        ],
        "expected": [
          0,
          1,
          3,
          0,
          4
        ]
      }
    ]
  },
  {
    "id": "is-subsequence",
    "title": "Is Subsequence",
    "difficulty": "Easy",
    "tags": [
      "String",
      "Two Pointers"
    ],
    "description": "<p>Given strings <code>s</code> and <code>t</code>, return whether <code>s</code> is a subsequence of <code>t</code>.</p>",
    "examples": [
      {
        "input": "s = \"abc\", t = \"ahbgdc\"",
        "output": "true"
      }
    ],
    "constraints": [
      "0 ≤ s.length ≤ 100",
      "0 ≤ t.length ≤ 10^4"
    ],
    "functionName": "isSubsequence",
    "starterCode": {
      "javascript": "function isSubsequence(s, t) {\n  // your code here\n}",
      "python": "def isSubsequence(s, t):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "abc",
          "ahbgdc"
        ],
        "expected": true
      },
      {
        "args": [
          "axc",
          "ahbgdc"
        ],
        "expected": false
      }
    ]
  },
  {
    "id": "reverse-string",
    "title": "Reverse String",
    "difficulty": "Easy",
    "tags": [
      "String",
      "Two Pointers"
    ],
    "description": "<p>Given a character array <code>s</code>, reverse it in place and return it.</p>",
    "examples": [
      {
        "input": "s = [\"h\",\"e\",\"l\",\"l\",\"o\"]",
        "output": "[\"o\",\"l\",\"l\",\"e\",\"h\"]"
      }
    ],
    "constraints": [
      "1 ≤ s.length ≤ 10^5"
    ],
    "functionName": "reverseString",
    "starterCode": {
      "javascript": "function reverseString(s) {\n  // your code here\n}",
      "python": "def reverseString(s):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            "h",
            "e",
            "l",
            "l",
            "o"
          ]
        ],
        "expected": [
          "o",
          "l",
          "l",
          "e",
          "h"
        ]
      },
      {
        "args": [
          [
            "H",
            "a",
            "n",
            "n",
            "a",
            "h"
          ]
        ],
        "expected": [
          "h",
          "a",
          "n",
          "n",
          "a",
          "H"
        ]
      }
    ]
  },
  {
    "id": "backspace-string-compare",
    "title": "Backspace String Compare",
    "difficulty": "Easy",
    "tags": [
      "String",
      "Stack",
      "Two Pointers"
    ],
    "description": "<p>Given strings <code>s</code> and <code>t</code> where <code>#</code> means a backspace, return whether they become equal after processing backspaces.</p>",
    "examples": [
      {
        "input": "s = \"ab#c\", t = \"ad#c\"",
        "output": "true"
      }
    ],
    "constraints": [
      "1 ≤ s.length, t.length ≤ 200"
    ],
    "functionName": "backspaceCompare",
    "starterCode": {
      "javascript": "function backspaceCompare(s, t) {\n  // your code here\n}",
      "python": "def backspaceCompare(s, t):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "ab#c",
          "ad#c"
        ],
        "expected": true
      },
      {
        "args": [
          "ab##",
          "c#d#"
        ],
        "expected": true
      },
      {
        "args": [
          "a#c",
          "b"
        ],
        "expected": false
      }
    ]
  },
  {
    "id": "maximum-average-subarray",
    "title": "Maximum Average Subarray I",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Sliding Window"
    ],
    "description": "<p>Given an array <code>nums</code> and integer <code>k</code>, find the maximum average of any contiguous subarray of length <code>k</code>.</p>",
    "examples": [
      {
        "input": "nums = [1,12,-5,-6,50,3], k = 4",
        "output": "12.75"
      }
    ],
    "constraints": [
      "1 ≤ k ≤ nums.length ≤ 10^5"
    ],
    "functionName": "findMaxAverage",
    "starterCode": {
      "javascript": "function findMaxAverage(nums, k) {\n  // your code here\n}",
      "python": "def findMaxAverage(nums, k):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            1,
            12,
            -5,
            -6,
            50,
            3
          ],
          4
        ],
        "expected": 12.75
      },
      {
        "args": [
          [
            5
          ],
          1
        ],
        "expected": 5
      }
    ]
  },
  {
    "id": "longest-substring-without-repeating",
    "title": "Longest Substring Without Repeating Characters",
    "difficulty": "Medium",
    "tags": [
      "String",
      "Sliding Window"
    ],
    "description": "<p>Given a string <code>s</code>, find the length of the longest substring without repeating characters.</p>",
    "examples": [
      {
        "input": "s = \"abcabcbb\"",
        "output": "3"
      }
    ],
    "constraints": [
      "0 ≤ s.length ≤ 5*10^4"
    ],
    "functionName": "lengthOfLongestSubstring",
    "starterCode": {
      "javascript": "function lengthOfLongestSubstring(s) {\n  // your code here\n}",
      "python": "def lengthOfLongestSubstring(s):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "abcabcbb"
        ],
        "expected": 3
      },
      {
        "args": [
          "bbbbb"
        ],
        "expected": 1
      },
      {
        "args": [
          "pwwkew"
        ],
        "expected": 3
      }
    ]
  },
  {
    "id": "minimum-size-subarray-sum",
    "title": "Minimum Size Subarray Sum",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Sliding Window"
    ],
    "description": "<p>Given a target sum and array <code>nums</code> of positive integers, return the minimal length of a contiguous subarray whose sum is ≥ target, or 0 if none exists.</p>",
    "examples": [
      {
        "input": "target = 7, nums = [2,3,1,2,4,3]",
        "output": "2"
      }
    ],
    "constraints": [
      "1 ≤ nums.length ≤ 10^5"
    ],
    "functionName": "minSubArrayLen",
    "starterCode": {
      "javascript": "function minSubArrayLen(target, nums) {\n  // your code here\n}",
      "python": "def minSubArrayLen(target, nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          7,
          [
            2,
            3,
            1,
            2,
            4,
            3
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          11,
          [
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1
          ]
        ],
        "expected": 0
      }
    ]
  },
  {
    "id": "find-all-anagrams-in-string",
    "title": "Find All Anagrams in a String",
    "difficulty": "Medium",
    "tags": [
      "String",
      "Sliding Window"
    ],
    "description": "<p>Given strings <code>s</code> and <code>p</code>, return all starting indices of <code>p</code>'s anagrams in <code>s</code>, sorted ascending.</p>",
    "examples": [
      {
        "input": "s = \"cbaebabacd\", p = \"abc\"",
        "output": "[0,6]"
      }
    ],
    "constraints": [
      "1 ≤ s.length, p.length ≤ 3*10^4"
    ],
    "functionName": "findAnagrams",
    "starterCode": {
      "javascript": "function findAnagrams(s, p) {\n  // your code here\n}",
      "python": "def findAnagrams(s, p):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "cbaebabacd",
          "abc"
        ],
        "expected": [
          0,
          6
        ]
      },
      {
        "args": [
          "abab",
          "ab"
        ],
        "expected": [
          0,
          1,
          2
        ]
      }
    ]
  },
  {
    "id": "longest-repeating-char-replacement",
    "title": "Longest Repeating Character Replacement",
    "difficulty": "Medium",
    "tags": [
      "String",
      "Sliding Window"
    ],
    "description": "<p>Given a string <code>s</code> and integer <code>k</code>, you may replace up to <code>k</code> characters. Return the length of the longest substring of a single repeating letter achievable.</p>",
    "examples": [
      {
        "input": "s = \"ABAB\", k = 2",
        "output": "4"
      }
    ],
    "constraints": [
      "1 ≤ s.length ≤ 10^5"
    ],
    "functionName": "characterReplacement",
    "starterCode": {
      "javascript": "function characterReplacement(s, k) {\n  // your code here\n}",
      "python": "def characterReplacement(s, k):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "ABAB",
          2
        ],
        "expected": 4
      },
      {
        "args": [
          "AABABBA",
          1
        ],
        "expected": 4
      }
    ]
  },
  {
    "id": "permutation-in-string",
    "title": "Permutation in String",
    "difficulty": "Medium",
    "tags": [
      "String",
      "Sliding Window"
    ],
    "description": "<p>Given strings <code>s1</code> and <code>s2</code>, return whether <code>s2</code> contains a permutation of <code>s1</code> as a substring.</p>",
    "examples": [
      {
        "input": "s1 = \"ab\", s2 = \"eidbaooo\"",
        "output": "true"
      }
    ],
    "constraints": [
      "1 ≤ s1.length ≤ s2.length ≤ 10^4"
    ],
    "functionName": "checkInclusion",
    "starterCode": {
      "javascript": "function checkInclusion(s1, s2) {\n  // your code here\n}",
      "python": "def checkInclusion(s1, s2):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "ab",
          "eidbaooo"
        ],
        "expected": true
      },
      {
        "args": [
          "ab",
          "eidboaoo"
        ],
        "expected": false
      }
    ]
  },
  {
    "id": "fruit-into-baskets",
    "title": "Fruit Into Baskets",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Sliding Window"
    ],
    "description": "<p>Given an array of fruit types on a row of trees, and exactly 2 baskets (each holding only one type), return the max number of fruits collectible in a contiguous subarray using at most 2 distinct types.</p>",
    "examples": [
      {
        "input": "fruits = [1,2,1]",
        "output": "3"
      }
    ],
    "constraints": [
      "1 ≤ fruits.length ≤ 10^5"
    ],
    "functionName": "totalFruit",
    "starterCode": {
      "javascript": "function totalFruit(fruits) {\n  // your code here\n}",
      "python": "def totalFruit(fruits):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            1
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            0,
            1,
            2,
            2
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            1,
            2,
            3,
            2,
            2
          ]
        ],
        "expected": 4
      }
    ]
  },
  {
    "id": "next-greater-element",
    "title": "Next Greater Element I",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Stack",
      "Hash Map"
    ],
    "description": "<p>For each element of <code>nums1</code> (a subset of <code>nums2</code>), find the next greater element to its right in <code>nums2</code>, or -1 if none. Return results in the order of <code>nums1</code>.</p>",
    "examples": [
      {
        "input": "nums1 = [4,1,2], nums2 = [1,3,4,2]",
        "output": "[-1,3,-1]"
      }
    ],
    "constraints": [
      "1 ≤ nums1.length ≤ nums2.length ≤ 1000"
    ],
    "functionName": "nextGreaterElement",
    "starterCode": {
      "javascript": "function nextGreaterElement(nums1, nums2) {\n  // your code here\n}",
      "python": "def nextGreaterElement(nums1, nums2):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            4,
            1,
            2
          ],
          [
            1,
            3,
            4,
            2
          ]
        ],
        "expected": [
          -1,
          3,
          -1
        ]
      },
      {
        "args": [
          [
            2,
            4
          ],
          [
            1,
            2,
            3,
            4
          ]
        ],
        "expected": [
          3,
          -1
        ]
      }
    ]
  },
  {
    "id": "evaluate-rpn",
    "title": "Evaluate Reverse Polish Notation",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Stack",
      "Math"
    ],
    "description": "<p>Evaluate an arithmetic expression given in Reverse Polish Notation (postfix), as an array of tokens.</p>",
    "examples": [
      {
        "input": "tokens = [\"2\",\"1\",\"+\",\"3\",\"*\"]",
        "output": "9"
      }
    ],
    "constraints": [
      "1 ≤ tokens.length ≤ 10^4"
    ],
    "functionName": "evalRPN",
    "starterCode": {
      "javascript": "function evalRPN(tokens) {\n  // your code here\n}",
      "python": "def evalRPN(tokens):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            "2",
            "1",
            "+",
            "3",
            "*"
          ]
        ],
        "expected": 9
      },
      {
        "args": [
          [
            "4",
            "13",
            "5",
            "/",
            "+"
          ]
        ],
        "expected": 6
      }
    ]
  },
  {
    "id": "daily-temperatures",
    "title": "Daily Temperatures",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Stack"
    ],
    "description": "<p>Given daily temperatures, return an array where each element is the number of days to wait for a warmer temperature (0 if none).</p>",
    "examples": [
      {
        "input": "temperatures = [73,74,75,71,69,72,76,73]",
        "output": "[1,1,4,2,1,1,0,0]"
      }
    ],
    "constraints": [
      "1 ≤ temperatures.length ≤ 10^5"
    ],
    "functionName": "dailyTemperatures",
    "starterCode": {
      "javascript": "function dailyTemperatures(temperatures) {\n  // your code here\n}",
      "python": "def dailyTemperatures(temperatures):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            73,
            74,
            75,
            71,
            69,
            72,
            76,
            73
          ]
        ],
        "expected": [
          1,
          1,
          4,
          2,
          1,
          1,
          0,
          0
        ]
      }
    ]
  },
  {
    "id": "remove-adjacent-duplicates",
    "title": "Remove All Adjacent Duplicates In String",
    "difficulty": "Easy",
    "tags": [
      "String",
      "Stack"
    ],
    "description": "<p>Given a string, repeatedly remove adjacent duplicate letter pairs until none remain. Return the result.</p>",
    "examples": [
      {
        "input": "s = \"abbaca\"",
        "output": "\"ca\""
      }
    ],
    "constraints": [
      "1 ≤ s.length ≤ 10^5"
    ],
    "functionName": "removeDuplicatesAdjacent",
    "starterCode": {
      "javascript": "function removeDuplicatesAdjacent(s) {\n  // your code here\n}",
      "python": "def removeDuplicatesAdjacent(s):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "abbaca"
        ],
        "expected": "ca"
      },
      {
        "args": [
          "azxxzy"
        ],
        "expected": "ay"
      }
    ]
  },
  {
    "id": "asteroid-collision",
    "title": "Asteroid Collision",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Stack"
    ],
    "description": "<p>Given an array of asteroids (positive = moving right, negative = moving left), simulate collisions (larger survives; equal size both explode) and return the final state.</p>",
    "examples": [
      {
        "input": "asteroids = [5,10,-5]",
        "output": "[5,10]"
      }
    ],
    "constraints": [
      "1 ≤ asteroids.length ≤ 10^4"
    ],
    "functionName": "asteroidCollision",
    "starterCode": {
      "javascript": "function asteroidCollision(asteroids) {\n  // your code here\n}",
      "python": "def asteroidCollision(asteroids):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            5,
            10,
            -5
          ]
        ],
        "expected": [
          5,
          10
        ]
      },
      {
        "args": [
          [
            8,
            -8
          ]
        ],
        "expected": []
      },
      {
        "args": [
          [
            10,
            2,
            -5
          ]
        ],
        "expected": [
          10
        ]
      }
    ]
  },
  {
    "id": "largest-rectangle-histogram",
    "title": "Largest Rectangle in Histogram",
    "difficulty": "Hard",
    "tags": [
      "Array",
      "Stack"
    ],
    "description": "<p>Given bar heights of a histogram (width 1 each), find the area of the largest rectangle that fits within it.</p>",
    "examples": [
      {
        "input": "heights = [2,1,5,6,2,3]",
        "output": "10"
      }
    ],
    "constraints": [
      "1 ≤ heights.length ≤ 10^5"
    ],
    "functionName": "largestRectangleArea",
    "starterCode": {
      "javascript": "function largestRectangleArea(heights) {\n  // your code here\n}",
      "python": "def largestRectangleArea(heights):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            2,
            1,
            5,
            6,
            2,
            3
          ]
        ],
        "expected": 10
      },
      {
        "args": [
          [
            2,
            4
          ]
        ],
        "expected": 4
      }
    ]
  },
  {
    "id": "search-insert-position",
    "title": "Search Insert Position",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Binary Search"
    ],
    "description": "<p>Given a sorted array and target, return the index if found, or the index where it would be inserted in order.</p>",
    "examples": [
      {
        "input": "nums = [1,3,5,6], target = 5",
        "output": "2"
      }
    ],
    "constraints": [
      "1 ≤ nums.length ≤ 10^4"
    ],
    "functionName": "searchInsert",
    "starterCode": {
      "javascript": "function searchInsert(nums, target) {\n  // your code here\n}",
      "python": "def searchInsert(nums, target):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            1,
            3,
            5,
            6
          ],
          5
        ],
        "expected": 2
      },
      {
        "args": [
          [
            1,
            3,
            5,
            6
          ],
          2
        ],
        "expected": 1
      },
      {
        "args": [
          [
            1,
            3,
            5,
            6
          ],
          7
        ],
        "expected": 4
      }
    ]
  },
  {
    "id": "first-last-position-sorted-array",
    "title": "Find First and Last Position of Element in Sorted Array",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Binary Search"
    ],
    "description": "<p>Given a sorted array and a target, return <code>[first, last]</code> indices of target's occurrences, or <code>[-1,-1]</code> if absent.</p>",
    "examples": [
      {
        "input": "nums = [5,7,7,8,8,10], target = 8",
        "output": "[3,4]"
      }
    ],
    "constraints": [
      "0 ≤ nums.length ≤ 10^5"
    ],
    "functionName": "searchRange",
    "starterCode": {
      "javascript": "function searchRange(nums, target) {\n  // your code here\n}",
      "python": "def searchRange(nums, target):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            5,
            7,
            7,
            8,
            8,
            10
          ],
          8
        ],
        "expected": [
          3,
          4
        ]
      },
      {
        "args": [
          [
            5,
            7,
            7,
            8,
            8,
            10
          ],
          6
        ],
        "expected": [
          -1,
          -1
        ]
      }
    ]
  },
  {
    "id": "find-minimum-rotated-sorted-array",
    "title": "Find Minimum in Rotated Sorted Array",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Binary Search"
    ],
    "description": "<p>Given a rotated sorted array with unique elements, find the minimum element.</p>",
    "examples": [
      {
        "input": "nums = [3,4,5,1,2]",
        "output": "1"
      }
    ],
    "constraints": [
      "1 ≤ nums.length ≤ 5000"
    ],
    "functionName": "findMin",
    "starterCode": {
      "javascript": "function findMin(nums) {\n  // your code here\n}",
      "python": "def findMin(nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            3,
            4,
            5,
            1,
            2
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          [
            11,
            13,
            15,
            17
          ]
        ],
        "expected": 11
      }
    ]
  },
  {
    "id": "sqrt-x",
    "title": "Sqrt(x)",
    "difficulty": "Easy",
    "tags": [
      "Math",
      "Binary Search"
    ],
    "description": "<p>Given a non-negative integer <code>x</code>, return the integer square root (floor of sqrt(x)).</p>",
    "examples": [
      {
        "input": "x = 8",
        "output": "2"
      }
    ],
    "constraints": [
      "0 ≤ x ≤ 2^31-1"
    ],
    "functionName": "mySqrt",
    "starterCode": {
      "javascript": "function mySqrt(x) {\n  // your code here\n}",
      "python": "def mySqrt(x):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          8
        ],
        "expected": 2
      },
      {
        "args": [
          4
        ],
        "expected": 2
      },
      {
        "args": [
          0
        ],
        "expected": 0
      }
    ]
  },
  {
    "id": "search-2d-matrix",
    "title": "Search a 2D Matrix",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Binary Search",
      "Matrix"
    ],
    "description": "<p>Given an m x n matrix where each row is sorted and the first element of each row is greater than the last of the previous row, determine if <code>target</code> exists.</p>",
    "examples": [
      {
        "input": "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3",
        "output": "true"
      }
    ],
    "constraints": [
      "1 ≤ m,n ≤ 100"
    ],
    "functionName": "searchMatrix",
    "starterCode": {
      "javascript": "function searchMatrix(matrix, target) {\n  // your code here\n}",
      "python": "def searchMatrix(matrix, target):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            [
              1,
              3,
              5,
              7
            ],
            [
              10,
              11,
              16,
              20
            ],
            [
              23,
              30,
              34,
              60
            ]
          ],
          3
        ],
        "expected": true
      },
      {
        "args": [
          [
            [
              1,
              3,
              5,
              7
            ],
            [
              10,
              11,
              16,
              20
            ],
            [
              23,
              30,
              34,
              60
            ]
          ],
          13
        ],
        "expected": false
      }
    ]
  },
  {
    "id": "peak-index-mountain-array",
    "title": "Peak Index in a Mountain Array",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Binary Search"
    ],
    "description": "<p>Given a mountain array (strictly increasing then strictly decreasing), find the index of the peak element.</p>",
    "examples": [
      {
        "input": "arr = [0,2,1,0]",
        "output": "1"
      }
    ],
    "constraints": [
      "3 ≤ arr.length ≤ 10^5"
    ],
    "functionName": "peakIndexInMountainArray",
    "starterCode": {
      "javascript": "function peakIndexInMountainArray(arr) {\n  // your code here\n}",
      "python": "def peakIndexInMountainArray(arr):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            0,
            2,
            1,
            0
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            0,
            10,
            5,
            2
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            3,
            4,
            5,
            1
          ]
        ],
        "expected": 2
      }
    ]
  },
  {
    "id": "koko-eating-bananas",
    "title": "Koko Eating Bananas",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Binary Search"
    ],
    "description": "<p>Given piles of bananas and <code>h</code> hours, find the minimum eating speed <code>k</code> (bananas/hour) so Koko finishes all piles within <code>h</code> hours.</p>",
    "examples": [
      {
        "input": "piles = [3,6,7,11], h = 8",
        "output": "4"
      }
    ],
    "constraints": [
      "1 ≤ piles.length ≤ 10^4"
    ],
    "functionName": "minEatingSpeed",
    "starterCode": {
      "javascript": "function minEatingSpeed(piles, h) {\n  // your code here\n}",
      "python": "def minEatingSpeed(piles, h):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            3,
            6,
            7,
            11
          ],
          8
        ],
        "expected": 4
      },
      {
        "args": [
          [
            30,
            11,
            23,
            4,
            20
          ],
          5
        ],
        "expected": 30
      },
      {
        "args": [
          [
            30,
            11,
            23,
            4,
            20
          ],
          6
        ],
        "expected": 23
      }
    ]
  },
  {
    "id": "capacity-to-ship-packages",
    "title": "Capacity To Ship Packages Within D Days",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Binary Search"
    ],
    "description": "<p>Given package weights (shipped in order) and <code>days</code>, find the minimum ship capacity so all packages ship within <code>days</code>.</p>",
    "examples": [
      {
        "input": "weights = [1,2,3,4,5,6,7,8,9,10], days = 5",
        "output": "15"
      }
    ],
    "constraints": [
      "1 ≤ days ≤ weights.length ≤ 5*10^4"
    ],
    "functionName": "shipWithinDays",
    "starterCode": {
      "javascript": "function shipWithinDays(weights, days) {\n  // your code here\n}",
      "python": "def shipWithinDays(weights, days):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10
          ],
          5
        ],
        "expected": 15
      },
      {
        "args": [
          [
            3,
            2,
            2,
            4,
            1,
            4
          ],
          3
        ],
        "expected": 6
      }
    ]
  },
  {
    "id": "reverse-words-in-string",
    "title": "Reverse Words in a String",
    "difficulty": "Medium",
    "tags": [
      "String"
    ],
    "description": "<p>Given a string <code>s</code>, reverse the order of the words (collapsing extra spaces).</p>",
    "examples": [
      {
        "input": "s = \"  hello world  \"",
        "output": "\"world hello\""
      }
    ],
    "constraints": [
      "1 ≤ s.length ≤ 10^4"
    ],
    "functionName": "reverseWords",
    "starterCode": {
      "javascript": "function reverseWords(s) {\n  // your code here\n}",
      "python": "def reverseWords(s):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "  hello world  "
        ],
        "expected": "world hello"
      },
      {
        "args": [
          "the sky is blue"
        ],
        "expected": "blue is sky the"
      }
    ]
  },
  {
    "id": "string-compression",
    "title": "String Compression",
    "difficulty": "Medium",
    "tags": [
      "String",
      "Two Pointers"
    ],
    "description": "<p>Given a character array, compress it in place using counts of repeated characters (e.g. \"aabbccc\" → \"a2b2c3\"); return the compressed string.</p>",
    "examples": [
      {
        "input": "chars = [\"a\",\"a\",\"b\",\"b\",\"c\",\"c\",\"c\"]",
        "output": "\"a2b2c3\""
      }
    ],
    "constraints": [
      "1 ≤ chars.length ≤ 2000"
    ],
    "functionName": "compress",
    "starterCode": {
      "javascript": "function compress(chars) {\n  // your code here\n}",
      "python": "def compress(chars):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            "a",
            "a",
            "b",
            "b",
            "c",
            "c",
            "c"
          ]
        ],
        "expected": "a2b2c3"
      },
      {
        "args": [
          [
            "a"
          ]
        ],
        "expected": "a"
      },
      {
        "args": [
          [
            "a",
            "b"
          ]
        ],
        "expected": "ab"
      }
    ]
  },
  {
    "id": "count-and-say",
    "title": "Count and Say",
    "difficulty": "Medium",
    "tags": [
      "String",
      "Recursion"
    ],
    "description": "<p>The count-and-say sequence starts \"1\"; each term describes the previous term by run-length (\"one 1\" → \"11\"). Return the nth term as a string.</p>",
    "examples": [
      {
        "input": "n = 4",
        "output": "\"1211\""
      }
    ],
    "constraints": [
      "1 ≤ n ≤ 30"
    ],
    "functionName": "countAndSay",
    "starterCode": {
      "javascript": "function countAndSay(n) {\n  // your code here\n}",
      "python": "def countAndSay(n):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          1
        ],
        "expected": "1"
      },
      {
        "args": [
          4
        ],
        "expected": "1211"
      }
    ]
  },
  {
    "id": "longest-palindromic-substring",
    "title": "Longest Palindromic Substring",
    "difficulty": "Medium",
    "tags": [
      "String",
      "DP"
    ],
    "description": "<p>Given a string <code>s</code>, return the longest palindromic substring.</p>",
    "examples": [
      {
        "input": "s = \"babad\"",
        "output": "\"bab\" (or \"aba\")"
      }
    ],
    "constraints": [
      "1 ≤ s.length ≤ 1000"
    ],
    "functionName": "longestPalindrome",
    "starterCode": {
      "javascript": "function longestPalindrome(s) {\n  // your code here\n}",
      "python": "def longestPalindrome(s):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "cbbd"
        ],
        "expected": "bb"
      },
      {
        "args": [
          "a"
        ],
        "expected": "a"
      }
    ]
  },
  {
    "id": "zigzag-conversion",
    "title": "Zigzag Conversion",
    "difficulty": "Medium",
    "tags": [
      "String"
    ],
    "description": "<p>Write a string in a zigzag pattern across <code>numRows</code>, then read line by line and return the result.</p>",
    "examples": [
      {
        "input": "s = \"PAYPALISHIRING\", numRows = 3",
        "output": "\"PAHNAPLSIIGYIR\""
      }
    ],
    "constraints": [
      "1 ≤ s.length ≤ 1000"
    ],
    "functionName": "convertZigzag",
    "starterCode": {
      "javascript": "function convertZigzag(s, numRows) {\n  // your code here\n}",
      "python": "def convertZigzag(s, num_rows):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "PAYPALISHIRING",
          3
        ],
        "expected": "PAHNAPLSIIGYIR"
      },
      {
        "args": [
          "A",
          1
        ],
        "expected": "A"
      }
    ]
  },
  {
    "id": "str-str",
    "title": "Implement strStr()",
    "difficulty": "Easy",
    "tags": [
      "String"
    ],
    "description": "<p>Given strings <code>haystack</code> and <code>needle</code>, return the index of needle's first occurrence, or -1.</p>",
    "examples": [
      {
        "input": "haystack = \"sadbutsad\", needle = \"sad\"",
        "output": "0"
      }
    ],
    "constraints": [
      "1 ≤ haystack.length ≤ 10^4"
    ],
    "functionName": "strStr",
    "starterCode": {
      "javascript": "function strStr(haystack, needle) {\n  // your code here\n}",
      "python": "def strStr(haystack, needle):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "sadbutsad",
          "sad"
        ],
        "expected": 0
      },
      {
        "args": [
          "leetcode",
          "leeto"
        ],
        "expected": -1
      }
    ]
  },
  {
    "id": "word-pattern",
    "title": "Word Pattern",
    "difficulty": "Easy",
    "tags": [
      "String",
      "Hash Map"
    ],
    "description": "<p>Given a pattern and a string <code>s</code> of space-separated words, return whether <code>s</code> follows the same bijective pattern.</p>",
    "examples": [
      {
        "input": "pattern = \"abba\", s = \"dog cat cat dog\"",
        "output": "true"
      }
    ],
    "constraints": [
      "1 ≤ pattern.length ≤ 300"
    ],
    "functionName": "wordPattern",
    "starterCode": {
      "javascript": "function wordPattern(pattern, s) {\n  // your code here\n}",
      "python": "def wordPattern(pattern, s):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "abba",
          "dog cat cat dog"
        ],
        "expected": true
      },
      {
        "args": [
          "abba",
          "dog cat cat fish"
        ],
        "expected": false
      }
    ]
  },
  {
    "id": "isomorphic-strings",
    "title": "Isomorphic Strings",
    "difficulty": "Easy",
    "tags": [
      "String",
      "Hash Map"
    ],
    "description": "<p>Given strings <code>s</code> and <code>t</code>, return whether the characters in <code>s</code> can be replaced (bijectively) to get <code>t</code>.</p>",
    "examples": [
      {
        "input": "s = \"egg\", t = \"add\"",
        "output": "true"
      }
    ],
    "constraints": [
      "1 ≤ s.length ≤ 5*10^4"
    ],
    "functionName": "isIsomorphic",
    "starterCode": {
      "javascript": "function isIsomorphic(s, t) {\n  // your code here\n}",
      "python": "def isIsomorphic(s, t):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "egg",
          "add"
        ],
        "expected": true
      },
      {
        "args": [
          "foo",
          "bar"
        ],
        "expected": false
      }
    ]
  },
  {
    "id": "ransom-note",
    "title": "Ransom Note",
    "difficulty": "Easy",
    "tags": [
      "String",
      "Hash Map"
    ],
    "description": "<p>Given strings <code>ransomNote</code> and <code>magazine</code>, return whether the ransom note can be built using letters from the magazine (each letter used once).</p>",
    "examples": [
      {
        "input": "ransomNote = \"aa\", magazine = \"aab\"",
        "output": "true"
      }
    ],
    "constraints": [
      "1 ≤ ransomNote.length, magazine.length ≤ 10^5"
    ],
    "functionName": "canConstruct",
    "starterCode": {
      "javascript": "function canConstruct(ransomNote, magazine) {\n  // your code here\n}",
      "python": "def canConstruct(ransom_note, magazine):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "a",
          "b"
        ],
        "expected": false
      },
      {
        "args": [
          "aa",
          "aab"
        ],
        "expected": true
      }
    ]
  },
  {
    "id": "add-binary",
    "title": "Add Binary",
    "difficulty": "Easy",
    "tags": [
      "String",
      "Math"
    ],
    "description": "<p>Given two binary strings, return their sum, also as a binary string.</p>",
    "examples": [
      {
        "input": "a = \"11\", b = \"1\"",
        "output": "\"100\""
      }
    ],
    "constraints": [
      "1 ≤ a.length, b.length ≤ 10^4"
    ],
    "functionName": "addBinary",
    "starterCode": {
      "javascript": "function addBinary(a, b) {\n  // your code here\n}",
      "python": "def addBinary(a, b):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "11",
          "1"
        ],
        "expected": "100"
      },
      {
        "args": [
          "1010",
          "1011"
        ],
        "expected": "10101"
      }
    ]
  },
  {
    "id": "multiply-strings",
    "title": "Multiply Strings",
    "difficulty": "Medium",
    "tags": [
      "String",
      "Math"
    ],
    "description": "<p>Given two non-negative integers as strings, return their product, also as a string (no built-in bignum conversion).</p>",
    "examples": [
      {
        "input": "num1 = \"123\", num2 = \"456\"",
        "output": "\"56088\""
      }
    ],
    "constraints": [
      "1 ≤ num1.length, num2.length ≤ 200"
    ],
    "functionName": "multiplyStrings",
    "starterCode": {
      "javascript": "function multiplyStrings(num1, num2) {\n  // your code here\n}",
      "python": "def multiplyStrings(num1, num2):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "2",
          "3"
        ],
        "expected": "6"
      },
      {
        "args": [
          "123",
          "456"
        ],
        "expected": "56088"
      }
    ]
  },
  {
    "id": "reverse-integer",
    "title": "Reverse Integer",
    "difficulty": "Medium",
    "tags": [
      "Math"
    ],
    "description": "<p>Given a signed 32-bit integer, reverse its digits. Return 0 if the reversed value overflows a 32-bit signed integer.</p>",
    "examples": [
      {
        "input": "x = 123",
        "output": "321"
      }
    ],
    "constraints": [
      "-2^31 ≤ x ≤ 2^31-1"
    ],
    "functionName": "reverseInteger",
    "starterCode": {
      "javascript": "function reverseInteger(x) {\n  // your code here\n}",
      "python": "def reverseInteger(x):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          123
        ],
        "expected": 321
      },
      {
        "args": [
          -123
        ],
        "expected": -321
      },
      {
        "args": [
          120
        ],
        "expected": 21
      }
    ]
  },
  {
    "id": "fizzbuzz",
    "title": "FizzBuzz",
    "difficulty": "Easy",
    "tags": [
      "Math"
    ],
    "description": "<p>Given <code>n</code>, return a string array for 1..n where multiples of 3 → \"Fizz\", multiples of 5 → \"Buzz\", multiples of both → \"FizzBuzz\", else the number as a string.</p>",
    "examples": [
      {
        "input": "n = 5",
        "output": "[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\"]"
      }
    ],
    "constraints": [
      "1 ≤ n ≤ 10^4"
    ],
    "functionName": "fizzBuzz",
    "starterCode": {
      "javascript": "function fizzBuzz(n) {\n  // your code here\n}",
      "python": "def fizzBuzz(n):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          5
        ],
        "expected": [
          "1",
          "2",
          "Fizz",
          "4",
          "Buzz"
        ]
      },
      {
        "args": [
          15
        ],
        "expected": [
          "1",
          "2",
          "Fizz",
          "4",
          "Buzz",
          "Fizz",
          "7",
          "8",
          "Fizz",
          "Buzz",
          "11",
          "Fizz",
          "13",
          "14",
          "FizzBuzz"
        ]
      }
    ]
  },
  {
    "id": "power-of-three",
    "title": "Power of Three",
    "difficulty": "Easy",
    "tags": [
      "Math",
      "Recursion"
    ],
    "description": "<p>Given an integer <code>n</code>, return whether it is a power of three.</p>",
    "examples": [
      {
        "input": "n = 27",
        "output": "true"
      }
    ],
    "constraints": [
      "-2^31 ≤ n ≤ 2^31-1"
    ],
    "functionName": "isPowerOfThree",
    "starterCode": {
      "javascript": "function isPowerOfThree(n) {\n  // your code here\n}",
      "python": "def isPowerOfThree(n):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          27
        ],
        "expected": true
      },
      {
        "args": [
          0
        ],
        "expected": false
      },
      {
        "args": [
          45
        ],
        "expected": false
      }
    ]
  },
  {
    "id": "sum-of-two-integers",
    "title": "Sum of Two Integers",
    "difficulty": "Medium",
    "tags": [
      "Bit Manipulation",
      "Math"
    ],
    "description": "<p>Given two integers <code>a</code> and <code>b</code>, return their sum without using the <code>+</code> or <code>-</code> operators (bit manipulation).</p>",
    "examples": [
      {
        "input": "a = 1, b = 2",
        "output": "3"
      }
    ],
    "constraints": [
      "-1000 ≤ a,b ≤ 1000"
    ],
    "functionName": "getSum",
    "starterCode": {
      "javascript": "function getSum(a, b) {\n  // your code here\n}",
      "python": "def getSum(a, b):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          1,
          2
        ],
        "expected": 3
      },
      {
        "args": [
          2,
          3
        ],
        "expected": 5
      },
      {
        "args": [
          -2,
          3
        ],
        "expected": 1
      }
    ]
  },
  {
    "id": "number-of-1-bits",
    "title": "Number of 1 Bits",
    "difficulty": "Easy",
    "tags": [
      "Bit Manipulation"
    ],
    "description": "<p>Given an unsigned integer, return the number of '1' bits in its binary representation (Hamming weight).</p>",
    "examples": [
      {
        "input": "n = 11 (binary 1011)",
        "output": "3"
      }
    ],
    "constraints": [
      "n fits in 32 bits"
    ],
    "functionName": "hammingWeight",
    "starterCode": {
      "javascript": "function hammingWeight(n) {\n  // your code here\n}",
      "python": "def hammingWeight(n):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          11
        ],
        "expected": 3
      },
      {
        "args": [
          128
        ],
        "expected": 1
      },
      {
        "args": [
          4294967293
        ],
        "expected": 31
      }
    ]
  },
  {
    "id": "counting-bits",
    "title": "Counting Bits",
    "difficulty": "Easy",
    "tags": [
      "Bit Manipulation",
      "DP"
    ],
    "description": "<p>Given <code>n</code>, return an array where element <code>i</code> is the number of 1 bits in the binary representation of <code>i</code>, for <code>0 ≤ i ≤ n</code>.</p>",
    "examples": [
      {
        "input": "n = 5",
        "output": "[0,1,1,2,1,2]"
      }
    ],
    "constraints": [
      "0 ≤ n ≤ 10^5"
    ],
    "functionName": "countBits",
    "starterCode": {
      "javascript": "function countBits(n) {\n  // your code here\n}",
      "python": "def countBits(n):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          2
        ],
        "expected": [
          0,
          1,
          1
        ]
      },
      {
        "args": [
          5
        ],
        "expected": [
          0,
          1,
          1,
          2,
          1,
          2
        ]
      }
    ]
  },
  {
    "id": "excel-sheet-column-number",
    "title": "Excel Sheet Column Number",
    "difficulty": "Easy",
    "tags": [
      "Math",
      "String"
    ],
    "description": "<p>Given a column title as it appears in an Excel sheet (e.g. \"AB\"), return its column number.</p>",
    "examples": [
      {
        "input": "columnTitle = \"AB\"",
        "output": "28"
      }
    ],
    "constraints": [
      "1 ≤ columnTitle.length ≤ 7"
    ],
    "functionName": "titleToNumber",
    "starterCode": {
      "javascript": "function titleToNumber(columnTitle) {\n  // your code here\n}",
      "python": "def titleToNumber(column_title):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "A"
        ],
        "expected": 1
      },
      {
        "args": [
          "AB"
        ],
        "expected": 28
      },
      {
        "args": [
          "ZY"
        ],
        "expected": 701
      }
    ]
  },
  {
    "id": "excel-sheet-column-title",
    "title": "Excel Sheet Column Title",
    "difficulty": "Easy",
    "tags": [
      "Math",
      "String"
    ],
    "description": "<p>Given a positive integer <code>columnNumber</code>, return its corresponding Excel column title.</p>",
    "examples": [
      {
        "input": "columnNumber = 28",
        "output": "\"AB\""
      }
    ],
    "constraints": [
      "1 ≤ columnNumber ≤ 2^31-1"
    ],
    "functionName": "convertToTitle",
    "starterCode": {
      "javascript": "function convertToTitle(columnNumber) {\n  // your code here\n}",
      "python": "def convertToTitle(column_number):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          1
        ],
        "expected": "A"
      },
      {
        "args": [
          28
        ],
        "expected": "AB"
      },
      {
        "args": [
          701
        ],
        "expected": "ZY"
      }
    ]
  },
  {
    "id": "happy-number",
    "title": "Happy Number",
    "difficulty": "Easy",
    "tags": [
      "Math",
      "Hash Set"
    ],
    "description": "<p>A happy number eventually reaches 1 when repeatedly replaced by the sum of squares of its digits. Return whether <code>n</code> is happy.</p>",
    "examples": [
      {
        "input": "n = 19",
        "output": "true"
      }
    ],
    "constraints": [
      "1 ≤ n ≤ 2^31-1"
    ],
    "functionName": "isHappy",
    "starterCode": {
      "javascript": "function isHappy(n) {\n  // your code here\n}",
      "python": "def isHappy(n):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          19
        ],
        "expected": true
      },
      {
        "args": [
          2
        ],
        "expected": false
      }
    ]
  },
  {
    "id": "add-digits",
    "title": "Add Digits",
    "difficulty": "Easy",
    "tags": [
      "Math"
    ],
    "description": "<p>Given a non-negative integer, repeatedly add its digits until the result has one digit. Return that digit.</p>",
    "examples": [
      {
        "input": "num = 38",
        "output": "2",
        "explanation": "3+8=11, 1+1=2"
      }
    ],
    "constraints": [
      "0 ≤ num ≤ 2^31-1"
    ],
    "functionName": "addDigits",
    "starterCode": {
      "javascript": "function addDigits(num) {\n  // your code here\n}",
      "python": "def addDigits(num):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          38
        ],
        "expected": 2
      },
      {
        "args": [
          0
        ],
        "expected": 0
      }
    ]
  },
  {
    "id": "house-robber",
    "title": "House Robber",
    "difficulty": "Medium",
    "tags": [
      "DP"
    ],
    "description": "<p>Given non-negative amounts of money in houses along a street, find the max you can rob without robbing two adjacent houses.</p>",
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "4"
      }
    ],
    "constraints": [
      "1 ≤ nums.length ≤ 100"
    ],
    "functionName": "rob",
    "starterCode": {
      "javascript": "function rob(nums) {\n  // your code here\n}",
      "python": "def rob(nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "expected": 4
      },
      {
        "args": [
          [
            2,
            7,
            9,
            3,
            1
          ]
        ],
        "expected": 12
      }
    ]
  },
  {
    "id": "house-robber-ii",
    "title": "House Robber II",
    "difficulty": "Medium",
    "tags": [
      "DP"
    ],
    "description": "<p>Same as House Robber, but the houses are arranged in a circle (first and last are adjacent).</p>",
    "examples": [
      {
        "input": "nums = [2,3,2]",
        "output": "3"
      }
    ],
    "constraints": [
      "1 ≤ nums.length ≤ 100"
    ],
    "functionName": "robCircular",
    "starterCode": {
      "javascript": "function robCircular(nums) {\n  // your code here\n}",
      "python": "def robCircular(nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            2,
            3,
            2
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "expected": 4
      },
      {
        "args": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": 3
      }
    ]
  },
  {
    "id": "coin-change",
    "title": "Coin Change",
    "difficulty": "Medium",
    "tags": [
      "DP"
    ],
    "description": "<p>Given coin denominations and a target amount, return the fewest coins needed to make that amount, or -1 if impossible.</p>",
    "examples": [
      {
        "input": "coins = [1,2,5], amount = 11",
        "output": "3"
      }
    ],
    "constraints": [
      "1 ≤ coins.length ≤ 12",
      "0 ≤ amount ≤ 10^4"
    ],
    "functionName": "coinChange",
    "starterCode": {
      "javascript": "function coinChange(coins, amount) {\n  // your code here\n}",
      "python": "def coinChange(coins, amount):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            5
          ],
          11
        ],
        "expected": 3
      },
      {
        "args": [
          [
            2
          ],
          3
        ],
        "expected": -1
      },
      {
        "args": [
          [
            1
          ],
          0
        ],
        "expected": 0
      }
    ]
  },
  {
    "id": "coin-change-ii",
    "title": "Coin Change II",
    "difficulty": "Medium",
    "tags": [
      "DP"
    ],
    "description": "<p>Given coin denominations and a target amount, return the number of distinct combinations that make up that amount.</p>",
    "examples": [
      {
        "input": "amount = 5, coins = [1,2,5]",
        "output": "4"
      }
    ],
    "constraints": [
      "1 ≤ coins.length ≤ 300",
      "0 ≤ amount ≤ 5000"
    ],
    "functionName": "coinChangeCombinations",
    "starterCode": {
      "javascript": "function coinChangeCombinations(amount, coins) {\n  // your code here\n}",
      "python": "def coinChangeCombinations(amount, coins):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          5,
          [
            1,
            2,
            5
          ]
        ],
        "expected": 4
      },
      {
        "args": [
          3,
          [
            2
          ]
        ],
        "expected": 0
      },
      {
        "args": [
          10,
          [
            10
          ]
        ],
        "expected": 1
      }
    ]
  },
  {
    "id": "unique-paths",
    "title": "Unique Paths",
    "difficulty": "Medium",
    "tags": [
      "DP"
    ],
    "description": "<p>A robot starts at the top-left of an m x n grid and can only move right or down. Return the number of unique paths to the bottom-right.</p>",
    "examples": [
      {
        "input": "m = 3, n = 7",
        "output": "28"
      }
    ],
    "constraints": [
      "1 ≤ m,n ≤ 100"
    ],
    "functionName": "uniquePaths",
    "starterCode": {
      "javascript": "function uniquePaths(m, n) {\n  // your code here\n}",
      "python": "def uniquePaths(m, n):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          3,
          7
        ],
        "expected": 28
      },
      {
        "args": [
          3,
          2
        ],
        "expected": 3
      }
    ]
  },
  {
    "id": "minimum-path-sum",
    "title": "Minimum Path Sum",
    "difficulty": "Medium",
    "tags": [
      "DP",
      "Matrix"
    ],
    "description": "<p>Given an m x n grid of non-negative numbers, find the path from top-left to bottom-right (moving only right or down) with the minimum sum.</p>",
    "examples": [
      {
        "input": "grid = [[1,3,1],[1,5,1],[4,2,1]]",
        "output": "7"
      }
    ],
    "constraints": [
      "1 ≤ m,n ≤ 200"
    ],
    "functionName": "minPathSum",
    "starterCode": {
      "javascript": "function minPathSum(grid) {\n  // your code here\n}",
      "python": "def minPathSum(grid):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            [
              1,
              3,
              1
            ],
            [
              1,
              5,
              1
            ],
            [
              4,
              2,
              1
            ]
          ]
        ],
        "expected": 7
      },
      {
        "args": [
          [
            [
              1,
              2,
              3
            ],
            [
              4,
              5,
              6
            ]
          ]
        ],
        "expected": 12
      }
    ]
  },
  {
    "id": "decode-ways",
    "title": "Decode Ways",
    "difficulty": "Medium",
    "tags": [
      "DP",
      "String"
    ],
    "description": "<p>A message of digits can be decoded to letters (A=1..Z=26). Given a digit string, return the number of ways to decode it.</p>",
    "examples": [
      {
        "input": "s = \"226\"",
        "output": "3"
      }
    ],
    "constraints": [
      "1 ≤ s.length ≤ 100"
    ],
    "functionName": "numDecodings",
    "starterCode": {
      "javascript": "function numDecodings(s) {\n  // your code here\n}",
      "python": "def numDecodings(s):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "12"
        ],
        "expected": 2
      },
      {
        "args": [
          "226"
        ],
        "expected": 3
      },
      {
        "args": [
          "06"
        ],
        "expected": 0
      }
    ]
  },
  {
    "id": "word-break",
    "title": "Word Break",
    "difficulty": "Medium",
    "tags": [
      "DP",
      "String"
    ],
    "description": "<p>Given a string <code>s</code> and a dictionary of words, return whether <code>s</code> can be segmented into a sequence of dictionary words.</p>",
    "examples": [
      {
        "input": "s = \"leetcode\", wordDict = [\"leet\",\"code\"]",
        "output": "true"
      }
    ],
    "constraints": [
      "1 ≤ s.length ≤ 300"
    ],
    "functionName": "wordBreak",
    "starterCode": {
      "javascript": "function wordBreak(s, wordDict) {\n  // your code here\n}",
      "python": "def wordBreak(s, word_dict):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "leetcode",
          [
            "leet",
            "code"
          ]
        ],
        "expected": true
      },
      {
        "args": [
          "catsandog",
          [
            "cats",
            "dog",
            "sand",
            "and",
            "cat"
          ]
        ],
        "expected": false
      }
    ]
  },
  {
    "id": "maximum-product-subarray",
    "title": "Maximum Product Subarray",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "DP"
    ],
    "description": "<p>Given an integer array <code>nums</code>, find the contiguous subarray with the largest product and return that product.</p>",
    "examples": [
      {
        "input": "nums = [2,3,-2,4]",
        "output": "6"
      }
    ],
    "constraints": [
      "1 ≤ nums.length ≤ 2*10^4"
    ],
    "functionName": "maxProduct",
    "starterCode": {
      "javascript": "function maxProduct(nums) {\n  // your code here\n}",
      "python": "def maxProduct(nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            2,
            3,
            -2,
            4
          ]
        ],
        "expected": 6
      },
      {
        "args": [
          [
            -2,
            0,
            -1
          ]
        ],
        "expected": 0
      }
    ]
  },
  {
    "id": "jump-game",
    "title": "Jump Game",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Greedy",
      "DP"
    ],
    "description": "<p>Given an array where each element is your max jump length from that position, return whether you can reach the last index starting at index 0.</p>",
    "examples": [
      {
        "input": "nums = [2,3,1,1,4]",
        "output": "true"
      }
    ],
    "constraints": [
      "1 ≤ nums.length ≤ 10^4"
    ],
    "functionName": "canJump",
    "starterCode": {
      "javascript": "function canJump(nums) {\n  // your code here\n}",
      "python": "def canJump(nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            2,
            3,
            1,
            1,
            4
          ]
        ],
        "expected": true
      },
      {
        "args": [
          [
            3,
            2,
            1,
            0,
            4
          ]
        ],
        "expected": false
      }
    ]
  },
  {
    "id": "jump-game-ii",
    "title": "Jump Game II",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Greedy",
      "DP"
    ],
    "description": "<p>Given the same setup as Jump Game, return the minimum number of jumps to reach the last index (guaranteed reachable).</p>",
    "examples": [
      {
        "input": "nums = [2,3,1,1,4]",
        "output": "2"
      }
    ],
    "constraints": [
      "1 ≤ nums.length ≤ 10^4"
    ],
    "functionName": "jumpGameII",
    "starterCode": {
      "javascript": "function jumpGameII(nums) {\n  // your code here\n}",
      "python": "def jumpGameII(nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            2,
            3,
            1,
            1,
            4
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            2,
            3,
            0,
            1,
            4
          ]
        ],
        "expected": 2
      }
    ]
  },
  {
    "id": "partition-equal-subset-sum",
    "title": "Partition Equal Subset Sum",
    "difficulty": "Medium",
    "tags": [
      "DP"
    ],
    "description": "<p>Given an array of positive integers, return whether it can be split into two subsets with equal sums.</p>",
    "examples": [
      {
        "input": "nums = [1,5,11,5]",
        "output": "true"
      }
    ],
    "constraints": [
      "1 ≤ nums.length ≤ 200"
    ],
    "functionName": "canPartition",
    "starterCode": {
      "javascript": "function canPartition(nums) {\n  // your code here\n}",
      "python": "def canPartition(nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            1,
            5,
            11,
            5
          ]
        ],
        "expected": true
      },
      {
        "args": [
          [
            1,
            2,
            3,
            5
          ]
        ],
        "expected": false
      }
    ]
  },
  {
    "id": "longest-palindromic-subsequence",
    "title": "Longest Palindromic Subsequence",
    "difficulty": "Medium",
    "tags": [
      "DP",
      "String"
    ],
    "description": "<p>Given a string <code>s</code>, return the length of the longest palindromic subsequence (not necessarily contiguous).</p>",
    "examples": [
      {
        "input": "s = \"bbbab\"",
        "output": "4"
      }
    ],
    "constraints": [
      "1 ≤ s.length ≤ 1000"
    ],
    "functionName": "longestPalinSubseq",
    "starterCode": {
      "javascript": "function longestPalinSubseq(s) {\n  // your code here\n}",
      "python": "def longestPalinSubseq(s):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "bbbab"
        ],
        "expected": 4
      },
      {
        "args": [
          "cbbd"
        ],
        "expected": 2
      }
    ]
  },
  {
    "id": "edit-distance",
    "title": "Edit Distance",
    "difficulty": "Hard",
    "tags": [
      "DP",
      "String"
    ],
    "description": "<p>Given two strings, return the minimum number of insert/delete/replace operations to convert one into the other.</p>",
    "examples": [
      {
        "input": "word1 = \"horse\", word2 = \"ros\"",
        "output": "3"
      }
    ],
    "constraints": [
      "0 ≤ word1.length, word2.length ≤ 500"
    ],
    "functionName": "minDistance",
    "starterCode": {
      "javascript": "function minDistance(word1, word2) {\n  // your code here\n}",
      "python": "def minDistance(word1, word2):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "horse",
          "ros"
        ],
        "expected": 3
      },
      {
        "args": [
          "intention",
          "execution"
        ],
        "expected": 5
      }
    ]
  },
  {
    "id": "best-time-buy-sell-stock-ii",
    "title": "Best Time to Buy and Sell Stock II",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Greedy",
      "DP"
    ],
    "description": "<p>Given daily prices, you may buy/sell multiple times (must sell before buying again). Return the maximum total profit.</p>",
    "examples": [
      {
        "input": "prices = [7,1,5,3,6,4]",
        "output": "7"
      }
    ],
    "constraints": [
      "1 ≤ prices.length ≤ 3*10^4"
    ],
    "functionName": "maxProfitII",
    "starterCode": {
      "javascript": "function maxProfitII(prices) {\n  // your code here\n}",
      "python": "def maxProfitII(prices):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            7,
            1,
            5,
            3,
            6,
            4
          ]
        ],
        "expected": 7
      },
      {
        "args": [
          [
            1,
            2,
            3,
            4,
            5
          ]
        ],
        "expected": 4
      },
      {
        "args": [
          [
            7,
            6,
            4,
            3,
            1
          ]
        ],
        "expected": 0
      }
    ]
  },
  {
    "id": "gas-station",
    "title": "Gas Station",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Greedy"
    ],
    "description": "<p>Given circular gas stations with <code>gas[i]</code> available and <code>cost[i]</code> to travel to the next, return the starting index to complete the circuit, or -1 if impossible.</p>",
    "examples": [
      {
        "input": "gas = [1,2,3,4,5], cost = [3,4,5,1,2]",
        "output": "3"
      }
    ],
    "constraints": [
      "1 ≤ gas.length = cost.length ≤ 10^5"
    ],
    "functionName": "canCompleteCircuit",
    "starterCode": {
      "javascript": "function canCompleteCircuit(gas, cost) {\n  // your code here\n}",
      "python": "def canCompleteCircuit(gas, cost):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3,
            4,
            5
          ],
          [
            3,
            4,
            5,
            1,
            2
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            2,
            3,
            4
          ],
          [
            3,
            4,
            3
          ]
        ],
        "expected": -1
      }
    ]
  },
  {
    "id": "assign-cookies",
    "title": "Assign Cookies",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Greedy",
      "Sorting"
    ],
    "description": "<p>Given children's greed factors <code>g</code> and cookie sizes <code>s</code>, return the max number of content children (a child is content if given a cookie ≥ their greed factor).</p>",
    "examples": [
      {
        "input": "g = [1,2,3], s = [1,1]",
        "output": "1"
      }
    ],
    "constraints": [
      "1 ≤ g.length, s.length ≤ 3*10^4"
    ],
    "functionName": "findContentChildren",
    "starterCode": {
      "javascript": "function findContentChildren(g, s) {\n  // your code here\n}",
      "python": "def findContentChildren(g, s):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3
          ],
          [
            1,
            1
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            1,
            2
          ],
          [
            1,
            2,
            3
          ]
        ],
        "expected": 2
      }
    ]
  },
  {
    "id": "non-overlapping-intervals",
    "title": "Non-overlapping Intervals",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Greedy",
      "Sorting"
    ],
    "description": "<p>Given a collection of intervals, return the minimum number to remove so the rest don't overlap.</p>",
    "examples": [
      {
        "input": "intervals = [[1,2],[2,3],[3,4],[1,3]]",
        "output": "1"
      }
    ],
    "constraints": [
      "1 ≤ intervals.length ≤ 10^5"
    ],
    "functionName": "eraseOverlapIntervals",
    "starterCode": {
      "javascript": "function eraseOverlapIntervals(intervals) {\n  // your code here\n}",
      "python": "def eraseOverlapIntervals(intervals):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ],
            [
              1,
              3
            ]
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              1,
              2
            ],
            [
              1,
              2
            ]
          ]
        ],
        "expected": 2
      }
    ]
  },
  {
    "id": "minimum-arrows-burst-balloons",
    "title": "Minimum Number of Arrows to Burst Balloons",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Greedy",
      "Sorting"
    ],
    "description": "<p>Given balloons as intervals <code>[x_start, x_end]</code>, return the minimum arrows (vertical shots) needed to burst all of them.</p>",
    "examples": [
      {
        "input": "points = [[10,16],[2,8],[1,6],[7,12]]",
        "output": "2"
      }
    ],
    "constraints": [
      "1 ≤ points.length ≤ 10^5"
    ],
    "functionName": "findMinArrowShots",
    "starterCode": {
      "javascript": "function findMinArrowShots(points) {\n  // your code here\n}",
      "python": "def findMinArrowShots(points):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            [
              10,
              16
            ],
            [
              2,
              8
            ],
            [
              1,
              6
            ],
            [
              7,
              12
            ]
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              3,
              4
            ],
            [
              5,
              6
            ],
            [
              7,
              8
            ]
          ]
        ],
        "expected": 4
      }
    ]
  },
  {
    "id": "task-scheduler",
    "title": "Task Scheduler",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Greedy",
      "Hash Map"
    ],
    "description": "<p>Given a char array of tasks and a cooldown <code>n</code> between same tasks, return the minimum number of time units (including idles) to finish all tasks.</p>",
    "examples": [
      {
        "input": "tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 2",
        "output": "8"
      }
    ],
    "constraints": [
      "1 ≤ tasks.length ≤ 10^4"
    ],
    "functionName": "leastInterval",
    "starterCode": {
      "javascript": "function leastInterval(tasks, n) {\n  // your code here\n}",
      "python": "def leastInterval(tasks, n):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            "A",
            "A",
            "A",
            "B",
            "B",
            "B"
          ],
          2
        ],
        "expected": 8
      },
      {
        "args": [
          [
            "A",
            "A",
            "A",
            "B",
            "B",
            "B"
          ],
          0
        ],
        "expected": 6
      }
    ]
  },
  {
    "id": "boats-to-save-people",
    "title": "Boats to Save People",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Greedy",
      "Two Pointers"
    ],
    "description": "<p>Given people's weights and a boat weight limit (max 2 people per boat), return the minimum number of boats needed to carry everyone.</p>",
    "examples": [
      {
        "input": "people = [3,2,2,1], limit = 3",
        "output": "3"
      }
    ],
    "constraints": [
      "1 ≤ people.length ≤ 5*10^4"
    ],
    "functionName": "numRescueBoats",
    "starterCode": {
      "javascript": "function numRescueBoats(people, limit) {\n  // your code here\n}",
      "python": "def numRescueBoats(people, limit):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            1,
            2
          ],
          3
        ],
        "expected": 1
      },
      {
        "args": [
          [
            3,
            2,
            2,
            1
          ],
          3
        ],
        "expected": 3
      },
      {
        "args": [
          [
            3,
            5,
            3,
            4
          ],
          5
        ],
        "expected": 4
      }
    ]
  },
  {
    "id": "merge-intervals-problem",
    "title": "Merge Intervals",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Sorting"
    ],
    "description": "<p>Given a collection of intervals, merge all overlapping intervals and return the result sorted by start.</p>",
    "examples": [
      {
        "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]"
      }
    ],
    "constraints": [
      "1 ≤ intervals.length ≤ 10^4"
    ],
    "functionName": "mergeIntervalsProblem",
    "starterCode": {
      "javascript": "function mergeIntervalsProblem(intervals) {\n  // your code here\n}",
      "python": "def mergeIntervalsProblem(intervals):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            [
              1,
              3
            ],
            [
              2,
              6
            ],
            [
              8,
              10
            ],
            [
              15,
              18
            ]
          ]
        ],
        "expected": [
          [
            1,
            6
          ],
          [
            8,
            10
          ],
          [
            15,
            18
          ]
        ]
      },
      {
        "args": [
          [
            [
              1,
              4
            ],
            [
              4,
              5
            ]
          ]
        ],
        "expected": [
          [
            1,
            5
          ]
        ]
      }
    ]
  },
  {
    "id": "kth-largest-element",
    "title": "Kth Largest Element in an Array",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Sorting",
      "Heap"
    ],
    "description": "<p>Given an unsorted array and integer <code>k</code>, return the kth largest element (kth largest in sorted order, not kth distinct).</p>",
    "examples": [
      {
        "input": "nums = [3,2,1,5,6,4], k = 2",
        "output": "5"
      }
    ],
    "constraints": [
      "1 ≤ k ≤ nums.length ≤ 10^5"
    ],
    "functionName": "findKthLargest",
    "starterCode": {
      "javascript": "function findKthLargest(nums, k) {\n  // your code here\n}",
      "python": "def findKthLargest(nums, k):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            3,
            2,
            1,
            5,
            6,
            4
          ],
          2
        ],
        "expected": 5
      },
      {
        "args": [
          [
            3,
            2,
            3,
            1,
            2,
            4,
            5,
            5,
            6
          ],
          4
        ],
        "expected": 4
      }
    ]
  },
  {
    "id": "top-k-frequent-elements",
    "title": "Top K Frequent Elements",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Hash Map",
      "Sorting"
    ],
    "description": "<p>Given an array and integer <code>k</code>, return the k most frequent elements (ties broken by smaller value first, for deterministic grading).</p>",
    "examples": [
      {
        "input": "nums = [1,1,1,2,2,3], k = 2",
        "output": "[1,2]"
      }
    ],
    "constraints": [
      "1 ≤ nums.length ≤ 10^5"
    ],
    "functionName": "topKFrequent",
    "starterCode": {
      "javascript": "function topKFrequent(nums, k) {\n  // your code here\n}",
      "python": "def topKFrequent(nums, k):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            1,
            1,
            1,
            2,
            2,
            3
          ],
          2
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "args": [
          [
            1
          ],
          1
        ],
        "expected": [
          1
        ]
      }
    ]
  },
  {
    "id": "sort-array-by-parity",
    "title": "Sort Array By Parity",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Two Pointers",
      "Sorting"
    ],
    "description": "<p>Given an integer array, move all even elements before all odd elements (evens keep relative order, then odds keep relative order).</p>",
    "examples": [
      {
        "input": "nums = [3,1,2,4]",
        "output": "[2,4,3,1]"
      }
    ],
    "constraints": [
      "1 ≤ nums.length ≤ 5000"
    ],
    "functionName": "sortArrayByParity",
    "starterCode": {
      "javascript": "function sortArrayByParity(nums) {\n  // your code here\n}",
      "python": "def sortArrayByParity(nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            3,
            1,
            2,
            4
          ]
        ],
        "expected": [
          2,
          4,
          3,
          1
        ]
      },
      {
        "args": [
          [
            0,
            1
          ]
        ],
        "expected": [
          0,
          1
        ]
      }
    ]
  },
  {
    "id": "relative-sort-array",
    "title": "Relative Sort Array",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Sorting"
    ],
    "description": "<p>Given arr1 and arr2 (arr2 has distinct elements, all present in arr1), sort arr1 so elements match arr2's relative order; remaining elements go at the end in ascending order.</p>",
    "examples": [
      {
        "input": "arr1 = [2,3,1,3,2,4,6,7,9,2,19], arr2 = [2,1,4,3,9,6]",
        "output": "[2,2,2,1,4,3,3,9,6,7,19]"
      }
    ],
    "constraints": [
      "1 ≤ arr1.length, arr2.length ≤ 1000"
    ],
    "functionName": "relativeSortArray",
    "starterCode": {
      "javascript": "function relativeSortArray(arr1, arr2) {\n  // your code here\n}",
      "python": "def relativeSortArray(arr1, arr2):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            2,
            3,
            1,
            3,
            2,
            4,
            6,
            7,
            9,
            2,
            19
          ],
          [
            2,
            1,
            4,
            3,
            9,
            6
          ]
        ],
        "expected": [
          2,
          2,
          2,
          1,
          4,
          3,
          3,
          9,
          6,
          7,
          19
        ]
      }
    ]
  },
  {
    "id": "transpose-matrix",
    "title": "Transpose Matrix",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Matrix"
    ],
    "description": "<p>Given a 2D matrix, return its transpose (rows become columns).</p>",
    "examples": [
      {
        "input": "matrix = [[1,2,3],[4,5,6]]",
        "output": "[[1,4],[2,5],[3,6]]"
      }
    ],
    "constraints": [
      "1 ≤ rows, cols ≤ 1000"
    ],
    "functionName": "transpose",
    "starterCode": {
      "javascript": "function transpose(matrix) {\n  // your code here\n}",
      "python": "def transpose(matrix):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            [
              1,
              2,
              3
            ],
            [
              4,
              5,
              6
            ]
          ]
        ],
        "expected": [
          [
            1,
            4
          ],
          [
            2,
            5
          ],
          [
            3,
            6
          ]
        ]
      },
      {
        "args": [
          [
            [
              1,
              2
            ],
            [
              3,
              4
            ]
          ]
        ],
        "expected": [
          [
            1,
            3
          ],
          [
            2,
            4
          ]
        ]
      }
    ]
  },
  {
    "id": "rotate-image",
    "title": "Rotate Image",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Matrix"
    ],
    "description": "<p>Given an n x n matrix, rotate it 90 degrees clockwise. Return the rotated matrix.</p>",
    "examples": [
      {
        "input": "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        "output": "[[7,4,1],[8,5,2],[9,6,3]]"
      }
    ],
    "constraints": [
      "1 ≤ n ≤ 20"
    ],
    "functionName": "rotateImage",
    "starterCode": {
      "javascript": "function rotateImage(matrix) {\n  // your code here\n}",
      "python": "def rotateImage(matrix):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            [
              1,
              2,
              3
            ],
            [
              4,
              5,
              6
            ],
            [
              7,
              8,
              9
            ]
          ]
        ],
        "expected": [
          [
            7,
            4,
            1
          ],
          [
            8,
            5,
            2
          ],
          [
            9,
            6,
            3
          ]
        ]
      }
    ]
  },
  {
    "id": "spiral-matrix",
    "title": "Spiral Matrix",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Matrix"
    ],
    "description": "<p>Given an m x n matrix, return all elements in spiral order.</p>",
    "examples": [
      {
        "input": "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        "output": "[1,2,3,6,9,8,7,4,5]"
      }
    ],
    "constraints": [
      "1 ≤ m,n ≤ 10"
    ],
    "functionName": "spiralOrder",
    "starterCode": {
      "javascript": "function spiralOrder(matrix) {\n  // your code here\n}",
      "python": "def spiralOrder(matrix):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            [
              1,
              2,
              3
            ],
            [
              4,
              5,
              6
            ],
            [
              7,
              8,
              9
            ]
          ]
        ],
        "expected": [
          1,
          2,
          3,
          6,
          9,
          8,
          7,
          4,
          5
        ]
      },
      {
        "args": [
          [
            [
              1,
              2,
              3,
              4
            ],
            [
              5,
              6,
              7,
              8
            ],
            [
              9,
              10,
              11,
              12
            ]
          ]
        ],
        "expected": [
          1,
          2,
          3,
          4,
          8,
          12,
          11,
          10,
          9,
          5,
          6,
          7
        ]
      }
    ]
  },
  {
    "id": "set-matrix-zeroes",
    "title": "Set Matrix Zeroes",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Matrix"
    ],
    "description": "<p>Given an m x n matrix, if an element is 0, set its entire row and column to 0. Return the modified matrix.</p>",
    "examples": [
      {
        "input": "matrix = [[1,1,1],[1,0,1],[1,1,1]]",
        "output": "[[1,0,1],[0,0,0],[1,0,1]]"
      }
    ],
    "constraints": [
      "1 ≤ m,n ≤ 200"
    ],
    "functionName": "setZeroes",
    "starterCode": {
      "javascript": "function setZeroes(matrix) {\n  // your code here\n}",
      "python": "def setZeroes(matrix):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            [
              1,
              1,
              1
            ],
            [
              1,
              0,
              1
            ],
            [
              1,
              1,
              1
            ]
          ]
        ],
        "expected": [
          [
            1,
            0,
            1
          ],
          [
            0,
            0,
            0
          ],
          [
            1,
            0,
            1
          ]
        ]
      }
    ]
  },
  {
    "id": "flood-fill",
    "title": "Flood Fill",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Matrix",
      "DFS"
    ],
    "description": "<p>Given an image grid, a starting pixel <code>(sr,sc)</code>, and a new color, perform a flood fill (like the paint bucket tool) and return the modified image.</p>",
    "examples": [
      {
        "input": "image = [[1,1,1],[1,1,0],[1,0,1]], sr=1, sc=1, color=2",
        "output": "[[2,2,2],[2,2,0],[2,0,1]]"
      }
    ],
    "constraints": [
      "1 ≤ m,n ≤ 50"
    ],
    "functionName": "floodFill",
    "starterCode": {
      "javascript": "function floodFill(image, sr, sc, color) {\n  // your code here\n}",
      "python": "def floodFill(image, sr, sc, color):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            [
              1,
              1,
              1
            ],
            [
              1,
              1,
              0
            ],
            [
              1,
              0,
              1
            ]
          ],
          1,
          1,
          2
        ],
        "expected": [
          [
            2,
            2,
            2
          ],
          [
            2,
            2,
            0
          ],
          [
            2,
            0,
            1
          ]
        ]
      }
    ]
  },
  {
    "id": "number-of-islands",
    "title": "Number of Islands",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Matrix",
      "DFS",
      "BFS"
    ],
    "description": "<p>Given an m x n binary grid ('1' land, '0' water), return the number of islands (connected groups of land, horizontally/vertically).</p>",
    "examples": [
      {
        "input": "grid = [[\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\"],[\"0\",\"0\",\"1\"]]",
        "output": "2"
      }
    ],
    "constraints": [
      "1 ≤ m,n ≤ 300"
    ],
    "functionName": "numIslands",
    "starterCode": {
      "javascript": "function numIslands(grid) {\n  // your code here\n}",
      "python": "def numIslands(grid):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            [
              "1",
              "1",
              "0"
            ],
            [
              "1",
              "1",
              "0"
            ],
            [
              "0",
              "0",
              "1"
            ]
          ]
        ],
        "expected": 2
      },
      {
        "args": [
          [
            [
              "1",
              "1",
              "1"
            ],
            [
              "0",
              "1",
              "0"
            ],
            [
              "1",
              "1",
              "1"
            ]
          ]
        ],
        "expected": 1
      }
    ]
  },
  {
    "id": "pascals-triangle",
    "title": "Pascal's Triangle",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "DP"
    ],
    "description": "<p>Given <code>numRows</code>, return the first <code>numRows</code> rows of Pascal's Triangle.</p>",
    "examples": [
      {
        "input": "numRows = 5",
        "output": "[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]"
      }
    ],
    "constraints": [
      "1 ≤ numRows ≤ 30"
    ],
    "functionName": "generatePascalsTriangle",
    "starterCode": {
      "javascript": "function generatePascalsTriangle(numRows) {\n  // your code here\n}",
      "python": "def generatePascalsTriangle(num_rows):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          1
        ],
        "expected": [
          [
            1
          ]
        ]
      },
      {
        "args": [
          5
        ],
        "expected": [
          [
            1
          ],
          [
            1,
            1
          ],
          [
            1,
            2,
            1
          ],
          [
            1,
            3,
            3,
            1
          ],
          [
            1,
            4,
            6,
            4,
            1
          ]
        ]
      }
    ]
  },
  {
    "id": "valid-sudoku",
    "title": "Valid Sudoku",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Matrix",
      "Hash Set"
    ],
    "description": "<p>Given a 9x9 board (digits '1'-'9' or '.'), determine if the filled cells satisfy Sudoku rules (rows, columns, 3x3 boxes have no repeated digits).</p>",
    "examples": [
      {
        "input": "a partially filled 9x9 board",
        "output": "true or false"
      }
    ],
    "constraints": [
      "board.length === 9",
      "board[i].length === 9"
    ],
    "functionName": "isValidSudoku",
    "starterCode": {
      "javascript": "function isValidSudoku(board) {\n  // your code here\n}",
      "python": "def isValidSudoku(board):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            [
              "5",
              "3",
              ".",
              ".",
              "7",
              ".",
              ".",
              ".",
              "."
            ],
            [
              "6",
              ".",
              ".",
              "1",
              "9",
              "5",
              ".",
              ".",
              "."
            ],
            [
              ".",
              "9",
              "8",
              ".",
              ".",
              ".",
              ".",
              "6",
              "."
            ],
            [
              "8",
              ".",
              ".",
              ".",
              "6",
              ".",
              ".",
              ".",
              "3"
            ],
            [
              "4",
              ".",
              ".",
              "8",
              ".",
              "3",
              ".",
              ".",
              "1"
            ],
            [
              "7",
              ".",
              ".",
              ".",
              "2",
              ".",
              ".",
              ".",
              "6"
            ],
            [
              ".",
              "6",
              ".",
              ".",
              ".",
              ".",
              "2",
              "8",
              "."
            ],
            [
              ".",
              ".",
              ".",
              "4",
              "1",
              "9",
              ".",
              ".",
              "5"
            ],
            [
              ".",
              ".",
              ".",
              ".",
              "8",
              ".",
              ".",
              "7",
              "9"
            ]
          ]
        ],
        "expected": true
      }
    ]
  },
  {
    "id": "length-of-last-word",
    "title": "Length of Last Word",
    "difficulty": "Easy",
    "tags": [
      "String"
    ],
    "description": "<p>Given a string of words separated by spaces, return the length of the last word.</p>",
    "examples": [
      {
        "input": "s = \"Hello World\"",
        "output": "5"
      }
    ],
    "constraints": [
      "1 ≤ s.length ≤ 10^4"
    ],
    "functionName": "lengthOfLastWord",
    "starterCode": {
      "javascript": "function lengthOfLastWord(s) {\n  // your code here\n}",
      "python": "def lengthOfLastWord(s):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          "Hello World"
        ],
        "expected": 5
      },
      {
        "args": [
          "   fly me   to   the moon  "
        ],
        "expected": 4
      }
    ]
  },
  {
    "id": "majority-element-ii",
    "title": "Majority Element II",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Boyer-Moore Voting"
    ],
    "description": "<p>Given an integer array, return all elements appearing more than <code>⌊n/3⌋</code> times, sorted ascending.</p>",
    "examples": [
      {
        "input": "nums = [3,2,3]",
        "output": "[3]"
      }
    ],
    "constraints": [
      "1 ≤ nums.length ≤ 5*10^4"
    ],
    "functionName": "majorityElementII",
    "starterCode": {
      "javascript": "function majorityElementII(nums) {\n  // your code here\n}",
      "python": "def majorityElementII(nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            3,
            2,
            3
          ]
        ],
        "expected": [
          3
        ]
      },
      {
        "args": [
          [
            1
          ]
        ],
        "expected": [
          1
        ]
      },
      {
        "args": [
          [
            1,
            2
          ]
        ],
        "expected": [
          1,
          2
        ]
      }
    ]
  },
  {
    "id": "contains-duplicate-ii",
    "title": "Contains Duplicate II",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Hash Map"
    ],
    "description": "<p>Given an array and integer <code>k</code>, return whether there are two equal elements whose indices differ by at most <code>k</code>.</p>",
    "examples": [
      {
        "input": "nums = [1,2,3,1], k = 3",
        "output": "true"
      }
    ],
    "constraints": [
      "1 ≤ nums.length ≤ 10^5"
    ],
    "functionName": "containsNearbyDuplicate",
    "starterCode": {
      "javascript": "function containsNearbyDuplicate(nums, k) {\n  // your code here\n}",
      "python": "def containsNearbyDuplicate(nums, k):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3,
            1
          ],
          3
        ],
        "expected": true
      },
      {
        "args": [
          [
            1,
            0,
            1,
            1
          ],
          1
        ],
        "expected": true
      },
      {
        "args": [
          [
            1,
            2,
            3,
            1,
            2,
            3
          ],
          2
        ],
        "expected": false
      }
    ]
  },
  {
    "id": "single-number-ii",
    "title": "Single Number II",
    "difficulty": "Medium",
    "tags": [
      "Bit Manipulation"
    ],
    "description": "<p>Given an array where every element appears exactly three times except one, find that single element.</p>",
    "examples": [
      {
        "input": "nums = [2,2,3,2]",
        "output": "3"
      }
    ],
    "constraints": [
      "1 ≤ nums.length ≤ 3*10^4"
    ],
    "functionName": "singleNumberII",
    "starterCode": {
      "javascript": "function singleNumberII(nums) {\n  // your code here\n}",
      "python": "def singleNumberII(nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            2,
            2,
            3,
            2
          ]
        ],
        "expected": 3
      },
      {
        "args": [
          [
            0,
            1,
            0,
            1,
            0,
            1,
            99
          ]
        ],
        "expected": 99
      }
    ]
  },
  {
    "id": "single-number-iii",
    "title": "Single Number III",
    "difficulty": "Medium",
    "tags": [
      "Bit Manipulation"
    ],
    "description": "<p>Given an array where exactly two elements appear once and all others appear twice, return the two singular elements, sorted ascending.</p>",
    "examples": [
      {
        "input": "nums = [1,2,1,3,2,5]",
        "output": "[3,5]"
      }
    ],
    "constraints": [
      "2 ≤ nums.length ≤ 3*10^4"
    ],
    "functionName": "singleNumberIII",
    "starterCode": {
      "javascript": "function singleNumberIII(nums) {\n  // your code here\n}",
      "python": "def singleNumberIII(nums):\n    # your code here\n    pass"
    },
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            1,
            3,
            2,
            5
          ]
        ],
        "expected": [
          3,
          5
        ]
      },
      {
        "args": [
          [
            -1,
            0
          ]
        ],
        "expected": [
          -1,
          0
        ]
      }
    ]
  }
];

module.exports = { PROBLEMS_EXTRA };