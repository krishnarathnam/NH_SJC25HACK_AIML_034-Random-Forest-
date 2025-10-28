const algorithmData = {
  'Selection Sort': {
    description: 'Selection Sort works by repeatedly finding the minimum element from the unsorted portion and moving it to the beginning.',
    steps: [
      'Find the minimum element in the array',
      'Swap it with the first element',
      'Repeat for the remaining unsorted portion',
      'Continue until the entire array is sorted'
    ],
    complexity: 'Time: O(n²), Space: O(1)',
    example: 'Array: [64, 25, 12, 22, 11]\nStep 1: Find min (11), swap with first → [11, 25, 12, 22, 64]\nStep 2: Find min in remaining (12), swap → [11, 12, 25, 22, 64]\nContinue...'
  },
  'Bubble Sort': {
    description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    steps: [
      'Compare adjacent elements',
      'Swap if they are in wrong order',
      'Repeat for each pair',
      'Continue until no swaps are needed'
    ],
    complexity: 'Time: O(n²), Space: O(1)',
    example: 'Array: [64, 34, 25, 12, 22]\nPass 1: 64>34, swap → [34, 64, 25, 12, 22]\nPass 1: 64>25, swap → [34, 25, 64, 12, 22]\nContinue...'
  },
  'Insertion Sort': {
    description: 'Insertion Sort builds the final sorted array one item at a time by taking elements from the unsorted portion and inserting them into their correct position.',
    steps: [
      'Start with the second element',
      'Compare with elements to the left',
      'Insert in correct position',
      'Repeat for all elements'
    ],
    complexity: 'Time: O(n²), Space: O(1)',
    example: 'Array: [12, 11, 13, 5, 6]\nStep 1: 11 < 12, insert → [11, 12, 13, 5, 6]\nStep 2: 13 > 12, no change\nStep 3: 5 < 13, insert → [5, 11, 12, 13, 6]\nContinue...'
  },
  'Merge Sort': {
    description: 'Merge Sort divides the array into two halves, recursively sorts them, and then merges the sorted halves.',
    steps: [
      'Divide the array into two halves',
      'Recursively sort both halves',
      'Merge the sorted halves',
      'Continue until array is sorted'
    ],
    complexity: 'Time: O(n log n), Space: O(n)',
    example: 'Array: [38, 27, 43, 3, 9, 82, 10]\nDivide: [38, 27, 43] and [3, 9, 82, 10]\nSort: [27, 38, 43] and [3, 9, 10, 82]\nMerge: [3, 9, 10, 27, 38, 43, 82]'
  },
  'Quick Sort': {
    description: 'Quick Sort picks a pivot element and partitions the array around the pivot, then recursively sorts the sub-arrays.',
    steps: [
      'Choose a pivot element',
      'Partition array around pivot',
      'Recursively sort left and right partitions',
      'Combine results'
    ],
    complexity: 'Time: O(n log n) average, O(n²) worst, Space: O(log n)',
    example: 'Array: [10, 80, 30, 90, 40, 50, 70]\nPivot: 70\nPartition: [10, 30, 40, 50] 70 [80, 90]\nRecursively sort both parts'
  },
  'Heap Sort': {
    description: 'Heap Sort uses a heap data structure to sort elements by repeatedly extracting the maximum element from the heap.',
    steps: [
      'Build a max heap from the array',
      'Extract the maximum element',
      'Place it at the end of sorted portion',
      'Repeat until heap is empty'
    ],
    complexity: 'Time: O(n log n), Space: O(1)',
    example: 'Array: [4, 10, 3, 5, 1]\nBuild heap: [10, 5, 3, 4, 1]\nExtract max (10): [5, 4, 3, 1] + [10]\nContinue...'
  }
};

export default algorithmData;


