// data/topics.js
// Central content store for DSA Nexus.
// To scale from ~30 topics to 100+: append new topic objects to TOPICS
// and (if needed) a new category to CATEGORIES. Nothing else changes -
// the sidebar, routing, complexity dial and compiler all read from here.

const CATEGORIES = [
  { id: "foundations", label: "Foundations", level: "Basic" },
  { id: "linear", label: "Linear Structures", level: "Basic" },
  { id: "recursion", label: "Recursion & Backtracking", level: "Intermediate" },
  { id: "searching-sorting", label: "Searching & Sorting", level: "Intermediate" },
  { id: "trees", label: "Trees & Heaps", level: "Intermediate" },
  { id: "graphs", label: "Graphs", level: "Advanced" },
  { id: "dp", label: "Dynamic Programming", level: "Advanced" },
  { id: "advanced", label: "Advanced Topics", level: "Advanced" }
];

// complexity: used to drive the "Complexity Dial" signature visual.
// scale index 0..6 -> O(1) O(log n) O(n) O(n log n) O(n^2) O(2^n) O(n!)
const SCALE = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n^2)", "O(2^n)", "O(n!)"];

const TOPICS = [
  // ---------------- FOUNDATIONS ----------------
  {
    id: "intro-to-dsa",
    category: "foundations",
    title: "Introduction to DSA",
    summary: "What data structures and algorithms are, and why every efficient program depends on them.",
    diagram: "array",
    complexity: { time: 2, space: 2, note: "Varies by structure/algorithm chosen" },
    content: `
      <p>A <strong>data structure</strong> is a way of organizing data so it can be used efficiently. An <strong>algorithm</strong> is a
      step-by-step procedure for solving a problem. Together they determine how fast your program runs and how much memory it uses.</p>
      <p>Picking the right combination is the core skill tested in technical interviews and the core skill behind fast, scalable software.
      The same problem (e.g. "find a value") can take <code>O(n)</code> time with a plain list or <code>O(log n)</code> time with a sorted
      array and binary search &mdash; same task, radically different cost.</p>
      <h3>Why this course is ordered the way it is</h3>
      <ul>
        <li><strong>Foundations</strong> &mdash; arrays and strings, the building blocks everything else sits on top of.</li>
        <li><strong>Linear structures</strong> &mdash; linked lists, stacks, queues: data with a single path through it.</li>
        <li><strong>Recursion</strong> &mdash; the mental model behind trees, divide-and-conquer, and backtracking.</li>
        <li><strong>Searching & sorting</strong> &mdash; the most reused algorithmic patterns in all of computing.</li>
        <li><strong>Trees, graphs</strong> &mdash; non-linear structures for hierarchies and networks.</li>
        <li><strong>Dynamic programming & advanced topics</strong> &mdash; optimization techniques for the hardest problems.</li>
      </ul>`,
    code: {
      js: `// Same problem, two data structures, two costs\nfunction linearFind(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}\n\nconsole.log(linearFind([5, 3, 8, 1, 9], 8));`,
    }
  },
  {
    id: "big-o-notation",
    category: "foundations",
    title: "Big-O Notation",
    summary: "The language used to describe how an algorithm's time or memory use grows with input size.",
    diagram: "graph-curve",
    complexity: { time: 2, space: 0, note: "Big-O describes growth rate, not a fixed structure" },
    content: `
      <p>Big-O describes the <em>upper bound</em> on how an algorithm's running time (or memory) grows as input size <code>n</code> grows.
      It ignores constant factors and lower-order terms because what matters at scale is the shape of the growth curve.</p>
      <table class="ref-table">
        <tr><th>Notation</th><th>Name</th><th>Example</th></tr>
        <tr><td>O(1)</td><td>Constant</td><td>Array index access</td></tr>
        <tr><td>O(log n)</td><td>Logarithmic</td><td>Binary search</td></tr>
        <tr><td>O(n)</td><td>Linear</td><td>Single loop through an array</td></tr>
        <tr><td>O(n log n)</td><td>Linearithmic</td><td>Merge sort, quick sort (avg)</td></tr>
        <tr><td>O(n^2)</td><td>Quadratic</td><td>Bubble sort, nested loops</td></tr>
        <tr><td>O(2^n)</td><td>Exponential</td><td>Naive recursive Fibonacci</td></tr>
        <tr><td>O(n!)</td><td>Factorial</td><td>Brute-force traveling salesman</td></tr>
      </table>
      <p>Always ask about <strong>best, average, and worst case</strong> &mdash; an algorithm can behave very differently depending on input
      order (e.g. quick sort is O(n log n) on average but O(n^2) on already-sorted worst-case input with a naive pivot).</p>`,
    code: {
      js: `// O(n^2) vs O(n): notice the nested loop\nfunction hasDuplicateSlow(arr) {\n  for (let i = 0; i < arr.length; i++)\n    for (let j = i + 1; j < arr.length; j++)\n      if (arr[i] === arr[j]) return true;\n  return false;\n}\n\nfunction hasDuplicateFast(arr) {\n  const seen = new Set();\n  for (const x of arr) {\n    if (seen.has(x)) return true;\n    seen.add(x);\n  }\n  return false;\n}\n\nconsole.log(hasDuplicateSlow([1,2,3,4,2]));\nconsole.log(hasDuplicateFast([1,2,3,4,2]));`
    }
  },
  {
    id: "arrays",
    category: "foundations",
    title: "Arrays",
    summary: "A contiguous, indexable block of memory - the simplest and most-used data structure.",
    diagram: "array",
    complexity: { time: 0, space: 2, note: "O(1) access, O(n) insert/delete at arbitrary position" },
    content: `
      <p>An array stores elements in contiguous memory, so any element can be accessed in <code>O(1)</code> via its index. Insertion or
      deletion in the middle costs <code>O(n)</code> because subsequent elements must shift.</p>
      <table class="ref-table">
        <tr><th>Operation</th><th>Time</th></tr>
        <tr><td>Access by index</td><td>O(1)</td></tr>
        <tr><td>Search (unsorted)</td><td>O(n)</td></tr>
        <tr><td>Insert/delete at end</td><td>O(1) amortized</td></tr>
        <tr><td>Insert/delete at start/middle</td><td>O(n)</td></tr>
      </table>`,
    code: {
      js: `const arr = [10, 20, 30, 40];\narr.push(50);          // O(1) amortized\narr.splice(1, 0, 15);  // O(n) - shifts everything after index 1\nconsole.log(arr);`
    }
  },
  {
    id: "strings",
    category: "foundations",
    title: "Strings",
    summary: "Arrays of characters with their own family of pattern-matching and manipulation algorithms.",
    diagram: "array",
    complexity: { time: 2, space: 2, note: "Most operations are O(n); concatenation in a loop can silently become O(n^2)" },
    content: `
      <p>Strings are typically implemented as immutable character arrays. A common beginner trap: repeatedly concatenating strings inside
      a loop with <code>+=</code> can cost <code>O(n^2)</code> overall in some languages because each concatenation copies the whole string.
      Use an array/buffer and join once instead.</p>`,
    code: {
      js: `// Reverse a string and check palindrome - two classic string patterns\nfunction reverse(s) {\n  return s.split('').reverse().join('');\n}\nfunction isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return clean === reverse(clean);\n}\nconsole.log(reverse('algorithm'));\nconsole.log(isPalindrome('A man a plan a canal Panama'));`
    }
  },

  // ---------------- LINEAR STRUCTURES ----------------
  {
    id: "linked-list",
    category: "linear",
    title: "Linked List (Singly & Doubly)",
    summary: "Nodes connected by pointers instead of contiguous memory - cheap insertion, no random access.",
    diagram: "linked-list",
    complexity: { time: 2, space: 2, note: "O(1) insert/delete at a known node, O(n) search" },
    content: `
      <p>A linked list stores each element in a node holding a value and a pointer (or two, for doubly linked lists) to neighboring
      nodes. Unlike arrays, insertion/deletion at a known position is <code>O(1)</code> since nothing needs to shift &mdash; but there is
      no O(1) random access, so search is <code>O(n)</code>.</p>
      <table class="ref-table">
        <tr><th>Operation</th><th>Array</th><th>Linked List</th></tr>
        <tr><td>Access by index</td><td>O(1)</td><td>O(n)</td></tr>
        <tr><td>Insert at front</td><td>O(n)</td><td>O(1)</td></tr>
        <tr><td>Insert at end</td><td>O(1)*</td><td>O(1) with tail pointer</td></tr>
      </table>`,
    code: {
      js: `class Node {\n  constructor(val) { this.val = val; this.next = null; }\n}\nclass LinkedList {\n  constructor() { this.head = null; }\n  push(val) {\n    const node = new Node(val);\n    if (!this.head) { this.head = node; return; }\n    let cur = this.head;\n    while (cur.next) cur = cur.next;\n    cur.next = node;\n  }\n  toArray() {\n    const out = []; let cur = this.head;\n    while (cur) { out.push(cur.val); cur = cur.next; }\n    return out;\n  }\n}\nconst list = new LinkedList();\n[1,2,3].forEach(v => list.push(v));\nconsole.log(list.toArray());`
    }
  },
  {
    id: "stack",
    category: "linear",
    title: "Stack (LIFO)",
    summary: "Last-in-first-out structure behind function calls, undo history, and expression parsing.",
    diagram: "stack",
    complexity: { time: 0, space: 2, note: "O(1) push/pop from the top" },
    content: `
      <p>A stack only allows access at one end: <code>push</code> adds to the top, <code>pop</code> removes from the top. This models
      "last in, first out" behavior seen in the call stack, undo/redo, and balanced-bracket checking.</p>`,
    code: {
      js: `function isBalanced(expr) {\n  const stack = [];\n  const pairs = { ')': '(', ']': '[', '}': '{' };\n  for (const ch of expr) {\n    if ('([{'.includes(ch)) stack.push(ch);\n    else if (')]}'.includes(ch)) {\n      if (stack.pop() !== pairs[ch]) return false;\n    }\n  }\n  return stack.length === 0;\n}\nconsole.log(isBalanced('{[a+(b*c)]}'));\nconsole.log(isBalanced('{[a+(b*c])}'));`
    }
  },
  {
    id: "queue",
    category: "linear",
    title: "Queue (FIFO) & Circular Queue",
    summary: "First-in-first-out structure used in scheduling, BFS, and buffering.",
    diagram: "queue",
    complexity: { time: 0, space: 2, note: "O(1) enqueue/dequeue with a proper implementation" },
    content: `
      <p>A queue serves elements in the order they arrived. A naive array-based queue makes <code>dequeue</code> cost O(n) (shifting all
      elements). A <strong>circular queue</strong> reuses a fixed-size buffer with front/rear indices wrapping around, giving true O(1)
      enqueue and dequeue without shifting.</p>`,
    code: {
      js: `class Queue {\n  constructor() { this.items = []; }\n  enqueue(v) { this.items.push(v); }\n  dequeue() { return this.items.shift(); }\n  peek() { return this.items[0]; }\n}\nconst q = new Queue();\nq.enqueue(1); q.enqueue(2); q.enqueue(3);\nconsole.log(q.dequeue(), q.peek());`
    }
  },

  // ---------------- RECURSION & BACKTRACKING ----------------
  {
    id: "recursion-basics",
    category: "recursion",
    title: "Recursion Basics",
    summary: "Functions that call themselves - the mental model behind trees, divide-and-conquer, and DP.",
    diagram: "tree",
    complexity: { time: 4, space: 2, note: "Depends heavily on the recurrence; naive recursion is often exponential" },
    content: `
      <p>Every recursive function needs a <strong>base case</strong> (when to stop) and a <strong>recursive case</strong> (how to shrink
      the problem toward the base case). Recursion uses the call stack, so depth matters: deep recursion can overflow the stack where
      an equivalent loop would not.</p>`,
    code: {
      js: `function factorial(n) {\n  if (n <= 1) return 1;       // base case\n  return n * factorial(n - 1); // recursive case\n}\nconsole.log(factorial(6));`
    }
  },
  {
    id: "backtracking",
    category: "recursion",
    title: "Backtracking",
    summary: "Explore choices, undo ('backtrack') when they fail, and try the next option - used in N-Queens, Sudoku, permutations.",
    diagram: "tree",
    complexity: { time: 6, space: 4, note: "Often exponential - pruning is what makes it practical" },
    content: `
      <p>Backtracking builds a solution incrementally and abandons ('backtracks' from) a partial solution as soon as it can't possibly
      lead to a valid answer. This pruning is what keeps otherwise exponential search spaces tractable in practice.</p>`,
    code: {
      js: `// Generate all permutations of an array via backtracking\nfunction permute(arr, path = [], out = []) {\n  if (path.length === arr.length) { out.push([...path]); return out; }\n  for (const num of arr) {\n    if (path.includes(num)) continue;\n    path.push(num);\n    permute(arr, path, out);\n    path.pop(); // backtrack\n  }\n  return out;\n}\nconsole.log(permute([1,2,3]));`
    }
  },

  // ---------------- SEARCHING & SORTING ----------------
  {
    id: "linear-search",
    category: "searching-sorting",
    title: "Linear Search",
    summary: "Check every element until you find the target - simple, works on unsorted data.",
    diagram: "array",
    complexity: { time: 2, space: 0, note: "O(n) worst case, O(1) space" },
    content: `<p>Linear search scans elements one by one. No pre-sorting required, but it does not scale: doubling input size doubles the
      worst-case work.</p>`,
    code: { js: `function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) if (arr[i] === target) return i;\n  return -1;\n}\nconsole.log(linearSearch([4,2,9,7], 9));` }
  },
  {
    id: "binary-search",
    category: "searching-sorting",
    title: "Binary Search",
    summary: "Halve the search space every step by comparing against the middle element - requires sorted data.",
    diagram: "graph-curve",
    complexity: { time: 1, space: 0, note: "O(log n) time, O(1) space (iterative)" },
    content: `<p>On sorted data, binary search compares the target to the middle element and discards half the remaining range each step,
      giving <code>O(log n)</code> time instead of <code>O(n)</code>.</p>`,
    code: { js: `function binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;\n  }\n  return -1;\n}\nconsole.log(binarySearch([1,3,5,7,9,11], 7));` }
  },
  {
    id: "bubble-sort",
    category: "searching-sorting",
    title: "Bubble Sort",
    summary: "Repeatedly swap adjacent out-of-order elements until the array is sorted.",
    diagram: "bars",
    complexity: { time: 4, space: 0, note: "O(n^2) time, O(1) space, stable" },
    content: `<p>Simple but inefficient: each pass 'bubbles' the largest unsorted element to its correct position. Mostly of educational
      value today, since merge/quick/heap sort dominate in practice.</p>`,
    code: { js: `function bubbleSort(arr) {\n  const a = [...arr];\n  for (let i = 0; i < a.length; i++)\n    for (let j = 0; j < a.length - i - 1; j++)\n      if (a[j] > a[j+1]) [a[j], a[j+1]] = [a[j+1], a[j]];\n  return a;\n}\nconsole.log(bubbleSort([5,1,4,2,8]));` }
  },
  {
    id: "insertion-sort",
    category: "searching-sorting",
    title: "Insertion Sort",
    summary: "Build a sorted prefix one element at a time by inserting each new element into place.",
    diagram: "bars",
    complexity: { time: 4, space: 0, note: "O(n^2) worst case, O(n) best case (nearly sorted), stable" },
    content: `<p>Efficient for small or nearly-sorted arrays; it's the algorithm many languages use as the base case inside hybrid sorts
      like Timsort.</p>`,
    code: { js: `function insertionSort(arr) {\n  const a = [...arr];\n  for (let i = 1; i < a.length; i++) {\n    const key = a[i]; let j = i - 1;\n    while (j >= 0 && a[j] > key) { a[j+1] = a[j]; j--; }\n    a[j+1] = key;\n  }\n  return a;\n}\nconsole.log(insertionSort([9,4,6,1,3]));` }
  },
  {
    id: "merge-sort",
    category: "searching-sorting",
    title: "Merge Sort",
    summary: "Divide the array in half, sort each half recursively, then merge the sorted halves.",
    diagram: "tree",
    complexity: { time: 3, space: 2, note: "O(n log n) guaranteed, O(n) extra space, stable" },
    content: `<p>A textbook divide-and-conquer algorithm. Its <code>O(n log n)</code> bound holds in the worst case (unlike quick sort),
      at the cost of O(n) auxiliary space.</p>`,
    code: { js: `function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = arr.length >> 1;\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  const out = [];\n  let i = 0, j = 0;\n  while (i < left.length && j < right.length)\n    out.push(left[i] <= right[j] ? left[i++] : right[j++]);\n  return [...out, ...left.slice(i), ...right.slice(j)];\n}\nconsole.log(mergeSort([8,3,7,4,2,9,1]));` }
  },
  {
    id: "quick-sort",
    category: "searching-sorting",
    title: "Quick Sort",
    summary: "Pick a pivot, partition around it, recurse on both sides - fast in practice, in-place.",
    diagram: "tree",
    complexity: { time: 3, space: 1, note: "O(n log n) average, O(n^2) worst case (bad pivot choice)" },
    content: `<p>Quick sort partitions the array around a pivot so smaller elements land left and larger ones land right, then recurses.
      Its worst case is quadratic on adversarial or already-sorted input with a naive pivot, which is why real-world implementations
      randomize or median-of-three the pivot choice.</p>`,
    code: { js: `function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const [pivot, ...rest] = arr;\n  const left = rest.filter(x => x < pivot);\n  const right = rest.filter(x => x >= pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}\nconsole.log(quickSort([6,2,9,1,5,3]));` }
  },
  {
    id: "heap-sort",
    category: "searching-sorting",
    title: "Heap Sort",
    summary: "Build a max-heap, repeatedly pull the max to the end - in-place and O(n log n) guaranteed.",
    diagram: "tree",
    complexity: { time: 3, space: 0, note: "O(n log n) guaranteed, O(1) extra space, not stable" },
    content: `<p>Heap sort builds a binary heap from the array, then repeatedly extracts the maximum (root) and restores the heap property,
      giving guaranteed <code>O(n log n)</code> with no extra memory.</p>`,
    code: { js: `function heapSort(arr) {\n  const a = [...arr];\n  const n = a.length;\n  function heapify(size, root) {\n    let largest = root, l = 2*root+1, r = 2*root+2;\n    if (l < size && a[l] > a[largest]) largest = l;\n    if (r < size && a[r] > a[largest]) largest = r;\n    if (largest !== root) { [a[root], a[largest]] = [a[largest], a[root]]; heapify(size, largest); }\n  }\n  for (let i = Math.floor(n/2)-1; i >= 0; i--) heapify(n, i);\n  for (let i = n-1; i > 0; i--) { [a[0], a[i]] = [a[i], a[0]]; heapify(i, 0); }\n  return a;\n}\nconsole.log(heapSort([4,10,3,5,1]));` }
  },

  // ---------------- TREES & HEAPS ----------------
  {
    id: "binary-tree",
    category: "trees",
    title: "Binary Tree & Traversals",
    summary: "A hierarchical structure where each node has at most two children - plus the three DFS traversal orders.",
    diagram: "tree",
    complexity: { time: 2, space: 2, note: "O(n) to visit every node; O(h) for path-dependent operations" },
    content: `
      <p>Binary trees underlie search trees, heaps, and expression trees. The three classic depth-first orders differ only in when the
      current node is visited relative to its children:</p>
      <ul>
        <li><strong>Preorder</strong>: node → left → right</li>
        <li><strong>Inorder</strong>: left → node → right (gives sorted order for a BST)</li>
        <li><strong>Postorder</strong>: left → right → node (useful for safe deletion)</li>
      </ul>`,
    code: { js: `class Node { constructor(v){ this.val=v; this.left=null; this.right=null; } }\nfunction inorder(node, out=[]) {\n  if (!node) return out;\n  inorder(node.left, out);\n  out.push(node.val);\n  inorder(node.right, out);\n  return out;\n}\nconst root = new Node(5);\nroot.left = new Node(3); root.right = new Node(8);\nroot.left.left = new Node(1);\nconsole.log(inorder(root));` }
  },
  {
    id: "binary-search-tree",
    category: "trees",
    title: "Binary Search Tree (BST)",
    summary: "A binary tree where left < node < right at every level, enabling O(log n) search when balanced.",
    diagram: "tree",
    complexity: { time: 1, space: 2, note: "O(log n) average if balanced, O(n) worst case if it degenerates into a line" },
    content: `<p>A BST keeps every left subtree smaller and every right subtree larger than its root, which makes search, insert, and delete
      run in <code>O(log n)</code> on a balanced tree. An unbalanced BST (e.g. built from already-sorted input) degenerates into a linked
      list with O(n) operations &mdash; which is exactly the problem self-balancing trees like AVL and Red-Black trees solve.</p>`,
    code: { js: `class BSTNode { constructor(v){ this.val=v; this.left=null; this.right=null; } }\nfunction insert(node, val) {\n  if (!node) return new BSTNode(val);\n  if (val < node.val) node.left = insert(node.left, val);\n  else node.right = insert(node.right, val);\n  return node;\n}\nfunction contains(node, val) {\n  if (!node) return false;\n  if (node.val === val) return true;\n  return val < node.val ? contains(node.left, val) : contains(node.right, val);\n}\nlet root = null;\n[8,3,10,1,6].forEach(v => root = insert(root, v));\nconsole.log(contains(root, 6), contains(root, 4));` }
  },
  {
    id: "avl-tree",
    category: "trees",
    title: "AVL Tree (Self-Balancing BST)",
    summary: "A BST that rebalances itself via rotations so height stays O(log n) no matter the insertion order.",
    diagram: "tree",
    complexity: { time: 1, space: 2, note: "O(log n) guaranteed for search/insert/delete" },
    content: `<p>An AVL tree tracks a balance factor (height difference between left and right subtrees) at every node and performs
      rotations (single or double) whenever an insertion or deletion pushes that factor beyond ±1. This guarantees O(log n) height
      always, unlike a plain BST.</p>`,
    code: { js: `// Right rotation, the core operation behind AVL rebalancing\nfunction rotateRight(y) {\n  const x = y.left;\n  y.left = x.right;\n  x.right = y;\n  return x; // x is the new subtree root\n}\nconst y = { val: 30, left: { val: 20, left: { val: 10, left: null, right: null }, right: null }, right: null };\nconsole.log(JSON.stringify(rotateRight(y)));` }
  },
  {
    id: "heap",
    category: "trees",
    title: "Heap & Priority Queue",
    summary: "A complete binary tree where every parent is ≥ (max-heap) or ≤ (min-heap) its children.",
    diagram: "tree",
    complexity: { time: 1, space: 2, note: "O(log n) insert/extract, O(1) peek" },
    content: `<p>A heap is the standard implementation of a <strong>priority queue</strong>: the element with highest priority is always at
      the root, extractable in O(log n) after the tree re-heapifies.</p>`,
    code: { js: `class MinHeap {\n  constructor() { this.data = []; }\n  push(v) {\n    this.data.push(v);\n    let i = this.data.length - 1;\n    while (i > 0) {\n      const p = (i - 1) >> 1;\n      if (this.data[p] <= this.data[i]) break;\n      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];\n      i = p;\n    }\n  }\n  pop() {\n    const top = this.data[0];\n    const last = this.data.pop();\n    if (this.data.length) { this.data[0] = last; this._sinkDown(0); }\n    return top;\n  }\n  _sinkDown(i) {\n    const n = this.data.length;\n    while (true) {\n      let l = 2*i+1, r = 2*i+2, smallest = i;\n      if (l < n && this.data[l] < this.data[smallest]) smallest = l;\n      if (r < n && this.data[r] < this.data[smallest]) smallest = r;\n      if (smallest === i) break;\n      [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];\n      i = smallest;\n    }\n  }\n}\nconst h = new MinHeap();\n[5,2,8,1,9].forEach(v => h.push(v));\nconsole.log(h.pop(), h.pop(), h.pop());` }
  },

  // ---------------- GRAPHS ----------------
  {
    id: "graph-representation",
    category: "graphs",
    title: "Graph Representation",
    summary: "Modeling networks of nodes and edges - adjacency list vs. adjacency matrix.",
    diagram: "graph",
    complexity: { time: 2, space: 2, note: "Adjacency list: O(V+E) space; adjacency matrix: O(V^2) space" },
    content: `
      <p>A graph is a set of vertices connected by edges (directed or undirected, weighted or not). Two common representations:</p>
      <table class="ref-table">
        <tr><th>Representation</th><th>Space</th><th>Best for</th></tr>
        <tr><td>Adjacency list</td><td>O(V + E)</td><td>Sparse graphs (few edges)</td></tr>
        <tr><td>Adjacency matrix</td><td>O(V^2)</td><td>Dense graphs, O(1) edge lookup</td></tr>
      </table>`,
    code: { js: `const graph = {\n  A: ['B', 'C'],\n  B: ['A', 'D'],\n  C: ['A', 'D'],\n  D: ['B', 'C']\n};\nconsole.log(graph);` }
  },
  {
    id: "bfs",
    category: "graphs",
    title: "Breadth-First Search (BFS)",
    summary: "Explore a graph level by level using a queue - finds shortest path in unweighted graphs.",
    diagram: "graph",
    complexity: { time: 2, space: 2, note: "O(V + E) time and space" },
    content: `<p>BFS explores all neighbors at the current depth before moving deeper, using a queue. On an unweighted graph, the first time
      BFS reaches a node is guaranteed to be via a shortest path.</p>`,
    code: { js: `function bfs(graph, start) {\n  const visited = new Set([start]);\n  const queue = [start];\n  const order = [];\n  while (queue.length) {\n    const node = queue.shift();\n    order.push(node);\n    for (const nb of graph[node] || []) {\n      if (!visited.has(nb)) { visited.add(nb); queue.push(nb); }\n    }\n  }\n  return order;\n}\nconst graph = { A:['B','C'], B:['A','D'], C:['A','D'], D:['B','C'] };\nconsole.log(bfs(graph, 'A'));` }
  },
  {
    id: "dfs",
    category: "graphs",
    title: "Depth-First Search (DFS)",
    summary: "Explore as far as possible down one path before backtracking - via recursion or an explicit stack.",
    diagram: "graph",
    complexity: { time: 2, space: 2, note: "O(V + E) time and space" },
    content: `<p>DFS dives deep along one branch before backtracking, naturally expressed with recursion (using the call stack) or an
      explicit stack. It's the basis for cycle detection, topological sort, and connected component discovery.</p>`,
    code: { js: `function dfs(graph, node, visited = new Set(), order = []) {\n  visited.add(node); order.push(node);\n  for (const nb of graph[node] || []) {\n    if (!visited.has(nb)) dfs(graph, nb, visited, order);\n  }\n  return order;\n}\nconst graph = { A:['B','C'], B:['A','D'], C:['A','D'], D:['B','C'] };\nconsole.log(dfs(graph, 'A'));` }
  },
  {
    id: "dijkstra",
    category: "graphs",
    title: "Dijkstra's Algorithm",
    summary: "Find shortest paths from a source in a weighted graph with non-negative edge weights.",
    diagram: "graph",
    complexity: { time: 3, space: 2, note: "O((V+E) log V) with a binary heap priority queue" },
    content: `<p>Dijkstra greedily expands the closest unvisited node, using a priority queue to always process the currently-cheapest known
      distance next. It requires non-negative weights &mdash; for graphs with negative edges, use Bellman-Ford instead.</p>`,
    code: { js: `function dijkstra(graph, start) {\n  const dist = {}; Object.keys(graph).forEach(n => dist[n] = Infinity);\n  dist[start] = 0;\n  const visited = new Set();\n  while (visited.size < Object.keys(graph).length) {\n    let u = null;\n    for (const n in dist) if (!visited.has(n) && (u === null || dist[n] < dist[u])) u = n;\n    if (u === null || dist[u] === Infinity) break;\n    visited.add(u);\n    for (const [v, w] of graph[u]) {\n      if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;\n    }\n  }\n  return dist;\n}\nconst graph = { A:[['B',4],['C',1]], B:[['D',1]], C:[['B',2],['D',5]], D:[] };\nconsole.log(dijkstra(graph, 'A'));` }
  },
  {
    id: "minimum-spanning-tree",
    category: "graphs",
    title: "Minimum Spanning Tree (Kruskal's)",
    summary: "Connect all vertices with the least total edge weight and no cycles, using a greedy + Union-Find approach.",
    diagram: "graph",
    complexity: { time: 3, space: 2, note: "O(E log E) dominated by sorting edges" },
    content: `<p>Kruskal's algorithm sorts all edges by weight and greedily adds each one unless it would form a cycle, checked efficiently
      with a Union-Find (Disjoint Set) structure. The result connects every vertex with the minimum possible total edge weight.</p>`,
    code: { js: `function find(parent, x) { return parent[x] === x ? x : (parent[x] = find(parent, parent[x])); }\nfunction kruskal(n, edges) {\n  const parent = Array.from({length:n}, (_,i)=>i);\n  edges.sort((a,b) => a[2]-b[2]);\n  const mst = [];\n  for (const [u,v,w] of edges) {\n    const ru = find(parent,u), rv = find(parent,v);\n    if (ru !== rv) { parent[ru] = rv; mst.push([u,v,w]); }\n  }\n  return mst;\n}\nconsole.log(kruskal(4, [[0,1,1],[1,2,2],[0,2,4],[2,3,3]]));` }
  },

  // ---------------- DYNAMIC PROGRAMMING ----------------
  {
    id: "dp-intro",
    category: "dp",
    title: "Dynamic Programming: Introduction",
    summary: "Solve complex problems by breaking them into overlapping subproblems and caching results.",
    diagram: "graph-curve",
    complexity: { time: 2, space: 2, note: "Turns exponential brute force into polynomial time via memoization" },
    content: `
      <p>DP applies when a problem has <strong>overlapping subproblems</strong> and <strong>optimal substructure</strong> (the optimal
      solution can be built from optimal solutions to subproblems). Two approaches:</p>
      <ul>
        <li><strong>Memoization (top-down)</strong>: recursion + a cache of already-computed results.</li>
        <li><strong>Tabulation (bottom-up)</strong>: build a table iteratively from the smallest subproblems up.</li>
      </ul>`,
    code: { js: `// Fibonacci: exponential naive recursion vs. O(n) memoized\nfunction fibNaive(n) { return n <= 1 ? n : fibNaive(n-1) + fibNaive(n-2); }\nfunction fibMemo(n, cache = {}) {\n  if (n <= 1) return n;\n  if (cache[n]) return cache[n];\n  return cache[n] = fibMemo(n-1, cache) + fibMemo(n-2, cache);\n}\nconsole.log(fibNaive(15), fibMemo(50));` }
  },
  {
    id: "knapsack",
    category: "dp",
    title: "0/1 Knapsack Problem",
    summary: "Pick items with given weights/values to maximize value under a weight limit, each item used at most once.",
    diagram: "bars",
    complexity: { time: 4, space: 4, note: "O(n * W) time and space (pseudo-polynomial in W)" },
    content: `<p>The classic optimization DP: for each item, decide whether including it (if it fits) beats excluding it, building a table
      indexed by (item, remaining capacity).</p>`,
    code: { js: `function knapsack(weights, values, W) {\n  const n = weights.length;\n  const dp = Array.from({length:n+1}, () => new Array(W+1).fill(0));\n  for (let i = 1; i <= n; i++) {\n    for (let w = 0; w <= W; w++) {\n      dp[i][w] = dp[i-1][w];\n      if (weights[i-1] <= w) dp[i][w] = Math.max(dp[i][w], dp[i-1][w-weights[i-1]] + values[i-1]);\n    }\n  }\n  return dp[n][W];\n}\nconsole.log(knapsack([1,3,4,5], [1,4,5,7], 7));` }
  },
  {
    id: "longest-common-subsequence",
    category: "dp",
    title: "Longest Common Subsequence (LCS)",
    summary: "Find the longest sequence appearing in both strings in order (not necessarily contiguous).",
    diagram: "bars",
    complexity: { time: 4, space: 4, note: "O(m*n) time and space" },
    content: `<p>LCS underlies diff tools and DNA sequence comparison. The DP table <code>dp[i][j]</code> holds the LCS length of the first
      <code>i</code> characters of one string and first <code>j</code> of the other.</p>`,
    code: { js: `function lcs(a, b) {\n  const m = a.length, n = b.length;\n  const dp = Array.from({length:m+1}, () => new Array(n+1).fill(0));\n  for (let i = 1; i <= m; i++)\n    for (let j = 1; j <= n; j++)\n      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);\n  return dp[m][n];\n}\nconsole.log(lcs('ABCBDAB', 'BDCABA'));` }
  },
  {
    id: "longest-increasing-subsequence",
    category: "dp",
    title: "Longest Increasing Subsequence (LIS)",
    summary: "Find the longest strictly increasing subsequence in an array.",
    diagram: "bars",
    complexity: { time: 1, space: 2, note: "O(n log n) with binary search + patience sorting; O(n^2) naive DP" },
    content: `<p>The naive DP is O(n^2): for each index, look back at all smaller indices. A binary-search-based approach ("patience
      sorting") improves this to O(n log n) by maintaining the smallest tail of every increasing subsequence length seen so far.</p>`,
    code: { js: `function lis(nums) {\n  const tails = [];\n  for (const num of nums) {\n    let lo = 0, hi = tails.length;\n    while (lo < hi) { const mid = (lo+hi)>>1; if (tails[mid] < num) lo = mid+1; else hi = mid; }\n    tails[lo] = num;\n  }\n  return tails.length;\n}\nconsole.log(lis([10,9,2,5,3,7,101,18]));` }
  },

  // ---------------- ADVANCED TOPICS ----------------
  {
    id: "trie",
    category: "advanced",
    title: "Trie (Prefix Tree)",
    summary: "A tree specialized for string prefixes - powers autocomplete and spell-check.",
    diagram: "tree",
    complexity: { time: 2, space: 2, note: "O(L) insert/search where L is the word length" },
    content: `<p>A trie stores strings character by character along tree paths, so all words sharing a prefix share the same path. This
      makes prefix search (autocomplete) and lookup run in <code>O(L)</code>, independent of how many words are stored.</p>`,
    code: { js: `class TrieNode { constructor(){ this.children = {}; this.isEnd = false; } }\nclass Trie {\n  constructor(){ this.root = new TrieNode(); }\n  insert(word) {\n    let node = this.root;\n    for (const ch of word) { node.children[ch] ??= new TrieNode(); node = node.children[ch]; }\n    node.isEnd = true;\n  }\n  search(word) {\n    let node = this.root;\n    for (const ch of word) { if (!node.children[ch]) return false; node = node.children[ch]; }\n    return node.isEnd;\n  }\n}\nconst t = new Trie();\n['cat','car','card'].forEach(w => t.insert(w));\nconsole.log(t.search('car'), t.search('ca'));` }
  },
  {
    id: "segment-tree",
    category: "advanced",
    title: "Segment Tree",
    summary: "A tree for fast range queries (sum, min, max) and updates over an array.",
    diagram: "tree",
    complexity: { time: 1, space: 2, note: "O(log n) query and update, O(n) build" },
    content: `<p>A segment tree precomputes aggregates over ranges so that any range query (e.g. sum of indices 3..7) or point update runs
      in <code>O(log n)</code>, versus O(n) with a plain array for range queries.</p>`,
    code: { js: `class SegmentTree {\n  constructor(arr) {\n    this.n = arr.length;\n    this.tree = new Array(4*this.n).fill(0);\n    this.build(arr, 1, 0, this.n-1);\n  }\n  build(arr, node, lo, hi) {\n    if (lo === hi) { this.tree[node] = arr[lo]; return; }\n    const mid = (lo+hi)>>1;\n    this.build(arr, 2*node, lo, mid);\n    this.build(arr, 2*node+1, mid+1, hi);\n    this.tree[node] = this.tree[2*node] + this.tree[2*node+1];\n  }\n  query(node, lo, hi, l, r) {\n    if (r < lo || hi < l) return 0;\n    if (l <= lo && hi <= r) return this.tree[node];\n    const mid = (lo+hi)>>1;\n    return this.query(2*node, lo, mid, l, r) + this.query(2*node+1, mid+1, hi, l, r);\n  }\n}\nconst st = new SegmentTree([1,3,5,7,9,11]);\nconsole.log(st.query(1, 0, 5, 1, 3));`}
  },
  {
    id: "union-find",
    category: "advanced",
    title: "Union-Find (Disjoint Set Union)",
    summary: "Track a partition of elements into disjoint sets with near-O(1) union and find.",
    diagram: "graph",
    complexity: { time: 0, space: 2, note: "O(alpha(n)) amortized (effectively constant) with path compression + union by rank" },
    content: `<p>Union-Find answers "are these two elements in the same group?" and "merge these two groups" extremely fast, using two
      optimizations: <strong>path compression</strong> (flatten the tree on find) and <strong>union by rank/size</strong> (attach the
      smaller tree under the larger). Core to Kruskal's MST and cycle detection.</p>`,
    code: { js: `class DSU {\n  constructor(n) { this.parent = Array.from({length:n}, (_,i)=>i); this.rank = new Array(n).fill(0); }\n  find(x) { return this.parent[x] === x ? x : (this.parent[x] = this.find(this.parent[x])); }\n  union(a, b) {\n    const ra = this.find(a), rb = this.find(b);\n    if (ra === rb) return false;\n    if (this.rank[ra] < this.rank[rb]) this.parent[ra] = rb;\n    else if (this.rank[ra] > this.rank[rb]) this.parent[rb] = ra;\n    else { this.parent[rb] = ra; this.rank[ra]++; }\n    return true;\n  }\n}\nconst dsu = new DSU(5);\ndsu.union(0,1); dsu.union(1,2);\nconsole.log(dsu.find(0) === dsu.find(2), dsu.find(0) === dsu.find(3));`}
  },
  {
    id: "topological-sort",
    category: "advanced",
    title: "Topological Sort",
    summary: "Order the vertices of a directed acyclic graph so every edge points forward in the order.",
    diagram: "graph",
    complexity: { time: 2, space: 2, note: "O(V + E)" },
    content: `<p>Topological sort is only defined for a <strong>DAG</strong> (directed acyclic graph). It's used for task scheduling with
      dependencies, build systems, and course prerequisite ordering.</p>`,
    code: { js: `function topoSort(graph) {\n  const visited = new Set();\n  const order = [];\n  function dfs(node) {\n    visited.add(node);\n    for (const nb of graph[node] || []) if (!visited.has(nb)) dfs(nb);\n    order.push(node); // postorder\n  }\n  for (const node in graph) if (!visited.has(node)) dfs(node);\n  return order.reverse();\n}\nconst graph = { A:['B'], B:['C'], C:[], D:['C'] };\nconsole.log(topoSort(graph));`}
  },
  {
    id: "kmp-string-matching",
    category: "advanced",
    title: "KMP String Matching",
    summary: "Find a pattern inside a text in linear time using a precomputed 'failure function'.",
    diagram: "array",
    complexity: { time: 2, space: 2, note: "O(n + m) versus O(n*m) for naive matching" },
    content: `<p>Knuth-Morris-Pratt precomputes, for the pattern itself, how far to safely skip ahead on a mismatch, avoiding the need to
      ever re-examine text characters. This gives linear-time matching versus the naive O(n*m) approach.</p>`,
    code: { js: `function buildLPS(pattern) {\n  const lps = new Array(pattern.length).fill(0);\n  let len = 0, i = 1;\n  while (i < pattern.length) {\n    if (pattern[i] === pattern[len]) { lps[i++] = ++len; }\n    else if (len > 0) len = lps[len-1];\n    else lps[i++] = 0;\n  }\n  return lps;\n}\nfunction kmpSearch(text, pattern) {\n  const lps = buildLPS(pattern);\n  const matches = [];\n  let i = 0, j = 0;\n  while (i < text.length) {\n    if (text[i] === pattern[j]) { i++; j++; }\n    if (j === pattern.length) { matches.push(i - j); j = lps[j-1]; }\n    else if (i < text.length && text[i] !== pattern[j]) { j > 0 ? j = lps[j-1] : i++; }\n  }\n  return matches;\n}\nconsole.log(kmpSearch('ababcabcabababd', 'abab'));`}
  },
  {
    id: "bitmasking",
    category: "advanced",
    title: "Bitmasking",
    summary: "Represent subsets/states as bits of an integer for extremely fast set operations - key trick in advanced DP.",
    diagram: "array",
    complexity: { time: 0, space: 0, note: "O(1) per bit operation; enables O(2^n * n) DP over subsets" },
    content: `<p>Encoding a set of up to ~20-ish elements as bits of an integer lets you check membership, union, intersection, and toggle in
      O(1) using <code>&amp;</code>, <code>|</code>, <code>^</code>, and <code>&lt;&lt;</code>. This is the backbone of "bitmask DP" used
      in problems like the Traveling Salesman Problem's DP formulation.</p>`,
    code: { js: `const set = 0b0000;\nfunction addItem(mask, i) { return mask | (1 << i); }\nfunction hasItem(mask, i) { return (mask & (1 << i)) !== 0; }\nfunction removeItem(mask, i) { return mask & ~(1 << i); }\nlet mask = addItem(set, 2);\nmask = addItem(mask, 4);\nconsole.log(mask.toString(2), hasItem(mask, 2), hasItem(mask, 3));`}
  }
];

module.exports = { CATEGORIES, TOPICS, SCALE };