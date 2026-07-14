// data/patterns.js
// The "12 Patterns" module: each pattern is a small slide deck (PPT-style)
// rendered by public/js/slides.js. Add a new pattern by pushing one more
// object onto PATTERNS - the slide viewer, sidebar, and routing all read
// from this file automatically.

const PATTERNS = [
  {
    id: "two-pointers",
    title: "Two Pointers",
    tagline: "Walk two indices toward each other (or in step) instead of nesting loops.",
    diagram: "array",
    slides: [
      {
        heading: "What is it?",
        bullets: [
          "Use two indices moving through a (usually sorted) array or string instead of one.",
          "Turns many O(n^2) brute-force scans into O(n).",
          "Common shapes: pointers starting at both ends and closing in, or both starting at the same end at different speeds."
        ]
      },
      {
        heading: "When to reach for it",
        bullets: [
          "Sorted array + 'find a pair/triplet matching a target' (pair sum, 3Sum).",
          "'Remove duplicates in place' or 'reverse in place' problems.",
          "Comparing from both ends: palindrome checks, container-with-most-water."
        ]
      },
      {
        heading: "Template",
        code: `function twoSum(sorted, target) {\n  let left = 0, right = sorted.length - 1;\n  while (left < right) {\n    const sum = sorted[left] + sorted[right];\n    if (sum === target) return [left, right];\n    if (sum < target) left++;\n    else right--;\n  }\n  return [-1, -1];\n}\nconsole.log(twoSum([1,3,4,6,9,12], 10));`
      },
      {
        heading: "Worked example",
        bullets: [
          "Problem: in a sorted array, find two numbers that add up to a target.",
          "left=0 points at the smallest value, right=n-1 at the largest.",
          "If the sum is too big, the largest value can't be part of any valid pair with anything bigger — move right left.",
          "If too small, the smallest value is too weak — move left right.",
          "Each step eliminates one element permanently: O(n) total instead of O(n^2)."
        ]
      },
      {
        heading: "Complexity & practice",
        bullets: [
          "Time: O(n) · Space: O(1) — no extra data structures.",
          "Practice problems: Two Sum II, 3Sum, Container With Most Water, Trapping Rain Water, Valid Palindrome."
        ]
      }
    ]
  },
  {
    id: "sliding-window",
    title: "Sliding Window",
    tagline: "Maintain a moving 'window' over a contiguous range instead of recomputing from scratch.",
    diagram: "array",
    slides: [
      {
        heading: "What is it?",
        bullets: [
          "Keep a window [start, end] over an array/string and slide it forward.",
          "Expand the window by moving end; shrink it by moving start when a condition is violated.",
          "Avoids recomputation: turns O(n*k) brute force into O(n)."
        ]
      },
      {
        heading: "When to reach for it",
        bullets: [
          "'Longest/shortest substring with property X' (no repeating chars, at most K distinct).",
          "'Maximum sum subarray of size K' or 'smallest subarray with sum ≥ target'.",
          "Any problem about a contiguous run in an array or string."
        ]
      },
      {
        heading: "Template — fixed size window",
        code: `function maxSumSubarray(arr, k) {\n  let windowSum = 0, maxSum = -Infinity;\n  for (let end = 0; end < arr.length; end++) {\n    windowSum += arr[end];\n    if (end >= k - 1) {\n      maxSum = Math.max(maxSum, windowSum);\n      windowSum -= arr[end - k + 1]; // slide: drop the leaving element\n    }\n  }\n  return maxSum;\n}\nconsole.log(maxSumSubarray([2,1,5,1,3,2], 3));`
      },
      {
        heading: "Template — variable size window",
        code: `function smallestSubarrayWithSum(arr, targetSum) {\n  let windowSum = 0, start = 0, minLen = Infinity;\n  for (let end = 0; end < arr.length; end++) {\n    windowSum += arr[end];\n    while (windowSum >= targetSum) {\n      minLen = Math.min(minLen, end - start + 1);\n      windowSum -= arr[start];\n      start++; // shrink from the left\n    }\n  }\n  return minLen === Infinity ? 0 : minLen;\n}\nconsole.log(smallestSubarrayWithSum([2,1,5,2,3,2], 7));`
      },
      {
        heading: "Complexity & practice",
        bullets: [
          "Time: O(n) — each element enters and leaves the window at most once.",
          "Space: O(1) to O(k) depending on whether you track a frequency map.",
          "Practice problems: Longest Substring Without Repeating Characters, Minimum Window Substring, Fruit Into Baskets, Longest Repeating Character Replacement."
        ]
      }
    ]
  },
  {
    id: "fast-slow-pointers",
    title: "Fast & Slow Pointers",
    tagline: "Two pointers moving at different speeds through a linked structure - detects cycles and midpoints.",
    diagram: "linked-list",
    slides: [
      {
        heading: "What is it?",
        bullets: [
          "Also called 'Floyd's Tortoise and Hare'.",
          "Slow pointer moves 1 step at a time; fast pointer moves 2 steps.",
          "If there's a cycle, the fast pointer will eventually lap the slow one and they meet."
        ]
      },
      {
        heading: "When to reach for it",
        bullets: [
          "Detecting a cycle in a linked list or an implicit sequence (e.g. Happy Number).",
          "Finding the middle of a linked list in one pass.",
          "Finding the start of a cycle, or the cycle's length."
        ]
      },
      {
        heading: "Template — cycle detection",
        code: `function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true; // they met -> cycle\n  }\n  return false;\n}\n// Build a tiny linked list with a cycle to test:\nconst a = {val:1}; const b = {val:2}; const c = {val:3};\na.next = b; b.next = c; c.next = a; // cycle back to a\nconsole.log(hasCycle(a));`
      },
      {
        heading: "Why it works",
        bullets: [
          "If there's no cycle, fast reaches the end (null) and the loop simply stops.",
          "If there IS a cycle, think of it as a circular track: fast gains one extra step on slow every iteration.",
          "Fast is guaranteed to catch up to (meet) slow within one full lap of the cycle."
        ]
      },
      {
        heading: "Complexity & practice",
        bullets: [
          "Time: O(n) · Space: O(1) — no extra memory, unlike a hash-set-based cycle check.",
          "Practice problems: Linked List Cycle, Middle of the Linked List, Happy Number, Palindrome Linked List."
        ]
      }
    ]
  },
  {
    id: "merge-intervals",
    title: "Merge Intervals",
    tagline: "Sort intervals by start time, then merge any that overlap - one clean linear pass.",
    diagram: "bars",
    slides: [
      {
        heading: "What is it?",
        bullets: [
          "Deals with problems involving overlapping ranges/intervals (times, numeric ranges).",
          "Core trick: sort by start value first — this makes overlap checks a simple local comparison."
        ]
      },
      {
        heading: "When to reach for it",
        bullets: [
          "'Merge all overlapping meeting times.'",
          "'Insert a new interval into a sorted, non-overlapping list.'",
          "'Find free/busy time given several people's schedules.'"
        ]
      },
      {
        heading: "Template",
        code: `function mergeIntervals(intervals) {\n  if (intervals.length < 2) return intervals;\n  const sorted = [...intervals].sort((a,b) => a[0]-b[0]);\n  const merged = [sorted[0]];\n  for (let i = 1; i < sorted.length; i++) {\n    const last = merged[merged.length-1];\n    const cur = sorted[i];\n    if (cur[0] <= last[1]) last[1] = Math.max(last[1], cur[1]); // overlap -> extend\n    else merged.push(cur); // no overlap -> new interval\n  }\n  return merged;\n}\nconsole.log(mergeIntervals([[1,4],[2,5],[7,9],[8,10]]));`
      },
      {
        heading: "Why sorting first matters",
        bullets: [
          "Once sorted by start time, an interval can only possibly overlap the one right before it in the merged result.",
          "That reduces an all-pairs comparison (O(n^2)) down to one linear scan (O(n log n) dominated by the sort)."
        ]
      },
      {
        heading: "Complexity & practice",
        bullets: [
          "Time: O(n log n) (sorting) · Space: O(n) for the output.",
          "Practice problems: Merge Intervals, Insert Interval, Interval List Intersections, Meeting Rooms II."
        ]
      }
    ]
  },
  {
    id: "cyclic-sort",
    title: "Cyclic Sort",
    tagline: "When numbers span a known range like 1..n, place each number at its own index in-place.",
    diagram: "array",
    slides: [
      {
        heading: "What is it?",
        bullets: [
          "Applies when you're given an array containing numbers in a known range (typically 1..n or 0..n-1).",
          "Place each number directly at the index that matches its value, by swapping — no extra memory."
        ]
      },
      {
        heading: "When to reach for it",
        bullets: [
          "'Find the missing number' / 'find all missing numbers' in a 1..n range.",
          "'Find the duplicate number' / 'find all duplicates'.",
          "'Find the first missing positive' — any problem hinting at values bounded by array length."
        ]
      },
      {
        heading: "Template",
        code: `function cyclicSort(nums) {\n  const a = [...nums];\n  let i = 0;\n  while (i < a.length) {\n    const correct = a[i] - 1; // value v belongs at index v-1\n    if (a[i] !== a[correct]) [a[i], a[correct]] = [a[correct], a[i]];\n    else i++;\n  }\n  return a;\n}\nconsole.log(cyclicSort([3,1,5,4,2]));`
      },
      {
        heading: "Finding the missing number",
        code: `function findMissing(nums) {\n  let i = 0;\n  const a = [...nums];\n  while (i < a.length) {\n    const correct = a[i];\n    if (correct < a.length && a[i] !== a[correct]) [a[i], a[correct]] = [a[correct], a[i]];\n    else i++;\n  }\n  for (let j = 0; j < a.length; j++) if (a[j] !== j) return j;\n  return a.length;\n}\nconsole.log(findMissing([4,0,3,1])); // expects 2`
      },
      {
        heading: "Complexity & practice",
        bullets: [
          "Time: O(n) — every element is swapped into place at most once.",
          "Space: O(1) — fully in-place, no hash set needed.",
          "Practice problems: Missing Number, Find All Numbers Disappeared, Find the Duplicate Number, First Missing Positive."
        ]
      }
    ]
  },
  {
    id: "in-place-linked-list-reversal",
    title: "In-place Reversal of a Linked List",
    tagline: "Reverse links between nodes directly, without any extra array or recursion stack.",
    diagram: "linked-list",
    slides: [
      {
        heading: "What is it?",
        bullets: [
          "Reverse a linked list (or a sub-section of one) by re-pointing next references as you walk through it.",
          "Uses O(1) extra space, unlike copying into an array and rebuilding."
        ]
      },
      {
        heading: "When to reach for it",
        bullets: [
          "'Reverse a linked list' or 'reverse nodes between position m and n'.",
          "'Reverse every K-group of nodes' (e.g. Reverse Nodes in k-Group).",
          "Anything asking for an in-place transformation of a linked list's pointers."
        ]
      },
      {
        heading: "Template",
        code: `function reverseList(head) {\n  let prev = null, current = head;\n  while (current) {\n    const next = current.next; // save before overwriting\n    current.next = prev;       // reverse the pointer\n    prev = current;\n    current = next;\n  }\n  return prev; // new head\n}\nfunction toArr(head){ const out=[]; while(head){out.push(head.val); head=head.next;} return out; }\nlet head = {val:1, next:{val:2, next:{val:3, next:{val:4, next:null}}}};\nconsole.log(toArr(reverseList(head)));`
      },
      {
        heading: "The three pointers",
        bullets: [
          "prev — the already-reversed portion (starts as null).",
          "current — the node being processed.",
          "next — saved BEFORE we overwrite current.next, or we'd lose the rest of the list.",
          "This one loop pattern generalizes directly to 'reverse a sublist' and 'reverse in k-groups'."
        ]
      },
      {
        heading: "Complexity & practice",
        bullets: [
          "Time: O(n) · Space: O(1).",
          "Practice problems: Reverse Linked List, Reverse Linked List II, Reverse Nodes in k-Group, Swap Nodes in Pairs."
        ]
      }
    ]
  },
  {
    id: "tree-bfs",
    title: "Tree BFS (Level Order)",
    tagline: "Visit a tree level by level using a queue — natural fit for anything about tree 'levels'.",
    diagram: "tree",
    slides: [
      {
        heading: "What is it?",
        bullets: [
          "Traverse a tree breadth-first: all nodes at depth 0, then depth 1, then depth 2, and so on.",
          "Implemented with a queue: push root, then repeatedly pop a node and push its children."
        ]
      },
      {
        heading: "When to reach for it",
        bullets: [
          "'Print/return the tree level by level.'",
          "'Find the minimum depth of a binary tree.'",
          "'Zigzag traversal', 'average of levels', 'right side view'."
        ]
      },
      {
        heading: "Template",
        code: `function levelOrder(root) {\n  if (!root) return [];\n  const result = [];\n  let queue = [root];\n  while (queue.length) {\n    const levelSize = queue.length;\n    const level = [];\n    const next = [];\n    for (let i = 0; i < levelSize; i++) {\n      const node = queue[i];\n      level.push(node.val);\n      if (node.left) next.push(node.left);\n      if (node.right) next.push(node.right);\n    }\n    result.push(level);\n    queue = next;\n  }\n  return result;\n}\nconst root = {val:1,left:{val:2,left:null,right:null},right:{val:3,left:{val:4,left:null,right:null},right:null}};\nconsole.log(levelOrder(root));`
      },
      {
        heading: "Key trick",
        bullets: [
          "Capture queue.length ('levelSize') BEFORE the inner loop starts.",
          "That freezes 'how many nodes belong to this level', even though you're pushing next-level nodes into a new queue during the same pass."
        ]
      },
      {
        heading: "Complexity & practice",
        bullets: [
          "Time: O(n) — every node visited once · Space: O(n) worst case (a full last level).",
          "Practice problems: Binary Tree Level Order Traversal, Zigzag Level Order, Minimum Depth of Binary Tree, Binary Tree Right Side View."
        ]
      }
    ]
  },
  {
    id: "tree-dfs",
    title: "Tree DFS (Root-to-Leaf Paths)",
    tagline: "Dive to the leaves first using recursion, tracking a running path/sum as you go.",
    diagram: "tree",
    slides: [
      {
        heading: "What is it?",
        bullets: [
          "Explore a tree depth-first, usually via recursion carrying along a 'current path' or 'running total'.",
          "When a leaf is hit, check/record the path; then backtrack and try the other branch."
        ]
      },
      {
        heading: "When to reach for it",
        bullets: [
          "'Does a root-to-leaf path sum to a target?'",
          "'Return all root-to-leaf paths.'",
          "'Find the maximum path sum' or 'diameter of a binary tree'."
        ]
      },
      {
        heading: "Template",
        code: `function hasPathSum(root, targetSum) {\n  if (!root) return false;\n  if (!root.left && !root.right) return root.val === targetSum;\n  const remaining = targetSum - root.val;\n  return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);\n}\nconst root = {val:5,left:{val:4,left:{val:11,left:{val:7},right:{val:2}},right:null},right:{val:8}};\nconsole.log(hasPathSum(root, 22));`
      },
      {
        heading: "Backtracking version (collect all paths)",
        code: `function allPathSums(root, targetSum, path = [], out = []) {\n  if (!root) return out;\n  path.push(root.val);\n  if (!root.left && !root.right && root.val === targetSum) out.push([...path]);\n  else {\n    allPathSums(root.left, targetSum - root.val, path, out);\n    allPathSums(root.right, targetSum - root.val, path, out);\n  }\n  path.pop(); // backtrack\n  return out;\n}`
      },
      {
        heading: "Complexity & practice",
        bullets: [
          "Time: O(n) · Space: O(h) for the recursion stack, where h is the tree height.",
          "Practice problems: Path Sum, Path Sum II, Binary Tree Maximum Path Sum, Sum Root to Leaf Numbers."
        ]
      }
    ]
  },
  {
    id: "two-heaps",
    title: "Two Heaps",
    tagline: "Split data into a max-heap of smaller values and a min-heap of larger ones to track a median.",
    diagram: "tree",
    slides: [
      {
        heading: "What is it?",
        bullets: [
          "Maintain a max-heap for the 'lower half' of seen numbers and a min-heap for the 'upper half'.",
          "Keep the two heaps balanced in size (differ by at most 1) after every insertion."
        ]
      },
      {
        heading: "When to reach for it",
        bullets: [
          "'Find the median of a running data stream.'",
          "'Schedule tasks/intervals to balance two groups.'",
          "Any 'maintain a middle/balance point over a stream' problem."
        ]
      },
      {
        heading: "Template — running median",
        code: `class MedianFinder {\n  constructor(){ this.small = []; this.large = []; } // small = max-heap (as sorted array), large = min-heap\n  _insertSorted(arr, val, desc) {\n    arr.push(val);\n    arr.sort((a,b) => desc ? b-a : a-b);\n  }\n  addNum(num) {\n    if (!this.small.length || num <= this.small[0]) this._insertSorted(this.small, num, true);\n    else this._insertSorted(this.large, num, false);\n    if (this.small.length > this.large.length + 1) this.large.unshift(this.small.pop());\n    else if (this.large.length > this.small.length) this.small.push(this.large.shift());\n  }\n  findMedian() {\n    if (this.small.length > this.large.length) return this.small[0];\n    return (this.small[0] + this.large[0]) / 2;\n  }\n}\nconst mf = new MedianFinder();\n[5,15,1,3].forEach(n => mf.addNum(n));\nconsole.log(mf.findMedian());`
      },
      {
        heading: "Why two heaps?",
        bullets: [
          "The max-heap's root is always the largest of the 'small half'; the min-heap's root is the smallest of the 'large half'.",
          "The median is always at that boundary — O(log n) per insert instead of re-sorting the whole stream each time.",
          "(This demo simulates heaps with sorted arrays for clarity; a real implementation uses a proper binary heap.)"
        ]
      },
      {
        heading: "Complexity & practice",
        bullets: [
          "Time: O(log n) per insertion with true heaps · Space: O(n).",
          "Practice problems: Find Median from Data Stream, Sliding Window Median, IPO / Maximize Capital."
        ]
      }
    ]
  },
  {
    id: "subsets-backtracking",
    title: "Subsets (Backtracking)",
    tagline: "Build every possible subset/permutation/combination by choosing, recursing, and undoing.",
    diagram: "tree",
    slides: [
      {
        heading: "What is it?",
        bullets: [
          "Generate all subsets, permutations, or combinations of a set using recursion + backtracking.",
          "Two common approaches: iterative doubling (for subsets) or 'choose / explore / un-choose' recursion (general purpose)."
        ]
      },
      {
        heading: "When to reach for it",
        bullets: [
          "'Return all subsets of a set.'",
          "'Return all permutations of an array.'",
          "'Return all combinations that sum to a target' (Combination Sum)."
        ]
      },
      {
        heading: "Template — all subsets",
        code: `function subsets(nums) {\n  let result = [[]];\n  for (const num of nums) {\n    const newSubsets = result.map(s => [...s, num]);\n    result = result.concat(newSubsets);\n  }\n  return result;\n}\nconsole.log(subsets([1,2,3]));`
      },
      {
        heading: "Template — combination sum (choose/explore/un-choose)",
        code: `function combinationSum(candidates, target, start = 0, path = [], out = []) {\n  if (target === 0) { out.push([...path]); return out; }\n  if (target < 0) return out;\n  for (let i = start; i < candidates.length; i++) {\n    path.push(candidates[i]);                 // choose\n    combinationSum(candidates, target - candidates[i], i, path, out); // explore\n    path.pop();                                // un-choose (backtrack)\n  }\n  return out;\n}\nconsole.log(combinationSum([2,3,6,7], 7));`
      },
      {
        heading: "Complexity & practice",
        bullets: [
          "Time: typically O(2^n) for subsets, O(n!) for permutations — inherent to enumerating all possibilities.",
          "Practice problems: Subsets, Subsets II, Permutations, Combination Sum, Letter Combinations of a Phone Number."
        ]
      }
    ]
  },
  {
    id: "modified-binary-search",
    title: "Modified Binary Search",
    tagline: "Adapt the halve-the-search-space idea beyond plain sorted arrays: rotated arrays, matrices, answer-search.",
    diagram: "graph-curve",
    slides: [
      {
        heading: "What is it?",
        bullets: [
          "Standard binary search finds a value in a sorted array in O(log n).",
          "'Modified' versions adapt the same halving idea to rotated arrays, 2D matrices, or searching over a range of *answers* rather than array indices."
        ]
      },
      {
        heading: "When to reach for it",
        bullets: [
          "'Search in a rotated sorted array.'",
          "'Find the peak element' / 'find in a bitonic array.'",
          "'Binary search on the answer': e.g. minimize the max load, given a monotonic yes/no feasibility check."
        ]
      },
      {
        heading: "Template — search in rotated sorted array",
        code: `function searchRotated(nums, target) {\n  let lo = 0, hi = nums.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (nums[mid] === target) return mid;\n    if (nums[lo] <= nums[mid]) { // left half is sorted\n      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;\n      else lo = mid + 1;\n    } else {                     // right half is sorted\n      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;\n      else hi = mid - 1;\n    }\n  }\n  return -1;\n}\nconsole.log(searchRotated([4,5,6,7,0,1,2], 0));`
      },
      {
        heading: "Binary search on the answer",
        bullets: [
          "Instead of searching array indices, search a numeric range of possible answers (e.g. 1..max).",
          "At each midpoint, run a 'can we achieve this?' feasibility check — if the check is monotonic (true then false, or vice versa), binary search applies.",
          "Used in problems like 'minimum days to make bouquets' or 'split array to minimize the largest sum'."
        ]
      },
      {
        heading: "Complexity & practice",
        bullets: [
          "Time: O(log n) or O(log(range) * cost of feasibility check).",
          "Practice problems: Search in Rotated Sorted Array, Find Minimum in Rotated Sorted Array, Search a 2D Matrix, Koko Eating Bananas."
        ]
      }
    ]
  },
  {
    id: "top-k-elements",
    title: "Top K Elements (Heap)",
    tagline: "Keep a heap of size K while scanning once - avoids sorting the entire dataset.",
    diagram: "tree",
    slides: [
      {
        heading: "What is it?",
        bullets: [
          "To find the 'top/smallest/most frequent K' items, maintain a heap of exactly size K as you scan.",
          "For the K largest, use a MIN-heap of size K (the root is your weakest 'top-K' member, easy to evict)."
        ]
      },
      {
        heading: "When to reach for it",
        bullets: [
          "'K largest/smallest elements in an array.'",
          "'Top K frequent words/numbers.'",
          "'Kth largest element in a stream.'"
        ]
      },
      {
        heading: "Template — K largest via min-heap (simulated with sorted array)",
        code: `function kLargest(nums, k) {\n  let heap = []; // kept sorted ascending; heap[0] is the smallest of our current top-k\n  for (const n of nums) {\n    if (heap.length < k) { heap.push(n); heap.sort((a,b)=>a-b); }\n    else if (n > heap[0]) { heap[0] = n; heap.sort((a,b)=>a-b); }\n  }\n  return heap;\n}\nconsole.log(kLargest([3,1,5,12,2,11], 3));`
      },
      {
        heading: "Why size-K heap beats full sort",
        bullets: [
          "Sorting everything is O(n log n). Maintaining a heap of size K is O(n log k).",
          "When k is much smaller than n (e.g. 'top 10 of a million records'), that difference is enormous.",
          "(This demo uses a sorted array to simulate the heap for readability; a real binary heap makes each update O(log k) instead of O(k)."
        ]
      },
      {
        heading: "Complexity & practice",
        bullets: [
          "Time: O(n log k) · Space: O(k).",
          "Practice problems: Kth Largest Element in an Array, Top K Frequent Elements, K Closest Points to Origin, Kth Largest Element in a Stream."
        ]
      }
    ]
  }
];

module.exports = { PATTERNS };
