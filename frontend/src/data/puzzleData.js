// Puzzle challenges for each sorting algorithm
export const puzzleData = {
  "Selection Sort": [
    {
      id: "sel_puzzle_1",
      title: "Find Minimum Element",
      difficulty: "Easy",
      description: "Complete the function to find the index of the minimum element in the unsorted portion of the array.",
      starterCode: `function findMinIndex(arr, startIdx) {
  let minIdx = startIdx;
  // YOUR CODE HERE
  // Loop through array from startIdx+1 to end
  // Update minIdx if you find a smaller element
  
  return minIdx;
}`,
      solution: `function findMinIndex(arr, startIdx) {
  let minIdx = startIdx;
  for (let i = startIdx + 1; i < arr.length; i++) {
    if (arr[i] < arr[minIdx]) {
      minIdx = i;
    }
  }
  return minIdx;
}`,
      testCases: [
        { input: [[5, 2, 8, 1, 9], 0], expected: 3 },
        { input: [[3, 1, 4, 1, 5], 2], expected: 3 },
      ],
      hint: "Use a for loop starting from startIdx + 1 and compare each element with arr[minIdx]",
      xpReward: 200
    },
    {
      id: "sel_puzzle_2",
      title: "Complete Selection Sort",
      difficulty: "Medium",
      description: "Fill in the missing swap logic in Selection Sort.",
      starterCode: `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    // YOUR CODE HERE
    // Swap arr[i] and arr[minIdx]
    
  }
  return arr;
}`,
      solution: `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    let temp = arr[i];
    arr[i] = arr[minIdx];
    arr[minIdx] = temp;
  }
  return arr;
}`,
      testCases: [
        { input: [[5, 2, 8, 1, 9]], expected: [1, 2, 5, 8, 9] },
        { input: [[3, 1, 4, 1, 5]], expected: [1, 1, 3, 4, 5] },
      ],
      hint: "Use a temporary variable to swap arr[i] and arr[minIdx]",
      xpReward: 200
    }
  ],
  "Bubble Sort": [
    {
      id: "bub_puzzle_1",
      title: "Single Pass of Bubble Sort",
      difficulty: "Easy",
      description: "Complete one pass of bubble sort that moves the largest element to the end.",
      starterCode: `function bubblePass(arr) {
  // YOUR CODE HERE
  // Compare adjacent elements and swap if needed
  // One pass through the array
  
  return arr;
}`,
      solution: `function bubblePass(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      let temp = arr[i];
      arr[i] = arr[i + 1];
      arr[i + 1] = temp;
    }
  }
  return arr;
}`,
      testCases: [
        { input: [[5, 2, 8, 1]], expected: [2, 5, 1, 8] },
        { input: [[3, 1, 4, 2]], expected: [1, 3, 2, 4] },
      ],
      hint: "Loop through the array and swap adjacent elements if arr[i] > arr[i+1]",
      xpReward: 200
    },
    {
      id: "bub_puzzle_2",
      title: "Complete Bubble Sort",
      difficulty: "Medium",
      description: "Implement the full bubble sort algorithm with nested loops.",
      starterCode: `function bubbleSort(arr) {
  // YOUR CODE HERE
  // Outer loop for number of passes
  // Inner loop for comparisons and swaps
  
  return arr;
}`,
      solution: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`,
      testCases: [
        { input: [[5, 2, 8, 1, 9]], expected: [1, 2, 5, 8, 9] },
        { input: [[3, 1, 4, 1, 5]], expected: [1, 1, 3, 4, 5] },
      ],
      hint: "Use nested for loops. Outer loop runs n-1 times, inner loop runs n-i-1 times",
      xpReward: 200
    }
  ],
  "Insertion Sort": [
    {
      id: "ins_puzzle_1",
      title: "Insert Element in Sorted Array",
      difficulty: "Easy",
      description: "Complete the logic to insert an element into its correct position in a sorted portion.",
      starterCode: `function insertElement(arr, i) {
  let key = arr[i];
  let j = i - 1;
  // YOUR CODE HERE
  // Shift elements greater than key to the right
  // Insert key at the correct position
  
  return arr;
}`,
      solution: `function insertElement(arr, i) {
  let key = arr[i];
  let j = i - 1;
  while (j >= 0 && arr[j] > key) {
    arr[j + 1] = arr[j];
    j--;
  }
  arr[j + 1] = key;
  return arr;
}`,
      testCases: [
        { input: [[1, 3, 5, 2], 3], expected: [1, 2, 3, 5] },
        { input: [[2, 4, 6, 3], 3], expected: [2, 3, 4, 6] },
      ],
      hint: "Use a while loop to shift elements right while they're greater than the key",
      xpReward: 200
    }
  ],
  "Merge Sort": [
    {
      id: "mer_puzzle_1",
      title: "Merge Two Sorted Arrays",
      difficulty: "Medium",
      description: "Implement the merge function that combines two sorted arrays into one sorted array.",
      starterCode: `function merge(left, right) {
  let result = [];
  let i = 0, j = 0;
  // YOUR CODE HERE
  // Compare elements from left and right
  // Add smaller element to result
  
  return result;
}`,
      solution: `function merge(left, right) {
  let result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
      testCases: [
        { input: [[1, 3, 5], [2, 4, 6]], expected: [1, 2, 3, 4, 5, 6] },
        { input: [[1, 5], [2, 3, 4]], expected: [1, 2, 3, 4, 5] },
      ],
      hint: "Use two pointers and compare elements. Don't forget to add remaining elements!",
      xpReward: 200
    }
  ],
  "Quick Sort": [
    {
      id: "qui_puzzle_1",
      title: "Partition Around Pivot",
      difficulty: "Hard",
      description: "Implement the partition function that rearranges elements around a pivot.",
      starterCode: `function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  // YOUR CODE HERE
  // Move elements smaller than pivot to the left
  // Return the partition index
  
  return i + 1;
}`,
      solution: `function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
  let temp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = temp;
  return i + 1;
}`,
      testCases: [
        { input: [[5, 2, 8, 1, 9], 0, 4], expected: 2 },
      ],
      hint: "Loop through elements, swap smaller ones to the left, then place pivot in final position",
      xpReward: 200
    }
  ],
  "Heap Sort": [
    {
      id: "hea_puzzle_1",
      title: "Heapify Function",
      difficulty: "Hard",
      description: "Complete the heapify function to maintain max-heap property.",
      starterCode: `function heapify(arr, n, i) {
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;
  // YOUR CODE HERE
  // Find largest among root, left child, and right child
  // Swap and recursively heapify if needed
  
}`,
      solution: `function heapify(arr, n, i) {
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  if (largest !== i) {
    let temp = arr[i];
    arr[i] = arr[largest];
    arr[largest] = temp;
    heapify(arr, n, largest);
  }
}`,
      testCases: [
        { input: [[1, 3, 5, 4, 6, 13, 10, 9, 8, 15, 17], 11, 0], expected: undefined },
      ],
      hint: "Compare root with left and right children, swap with largest, then recursively heapify",
      xpReward: 200
    }
  ]
};

export const getPuzzlesForAlgorithm = (algorithm) => {
  return puzzleData[algorithm] || [];
};

