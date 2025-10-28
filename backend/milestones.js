// server/milestones.js
module.exports = {
  // ✅ SELECTION SORT
  "Selection Sort": [
    {
      key: "sel_1_concept",
      title: "Understands 'find-min each pass'",
      afterTurnsMin: 2,
      detect: /select(ing)?\s+the\s+min(imum)?|argmin|scan\s+for\s+min/i
    },
    {
      key: "sel_2_dryrun",
      title: "Dry-run on a small array",
      afterTurnsMin: 4,
      detect: /\[?\s*\d.*\]\s*->|\b(pass|step)\b.*(swap|min)/i
    },
    {
      key: "sel_3_swap",
      title: "Explains swap to current index i",
      afterTurnsMin: 6,
      detect: /\bswap\b|\bposition\b|\bindex\s*0\b/i 
    },
    {
      key: "sel_4_complexity",
      title: "States O(n²) and why",
      afterTurnsMin: 8,
      detect: /O\s*\(\s*n\s*\^\s*2\s*\)|O\s*\(\s*n\s*2\s*\)|\bn\^2\b/i
    },
    {
      key: "sel_5_space_stability",
      title: "Knows space O(1) & (not) stability",
      afterTurnsMin: 10,
      detect: /\bspace\b.*O\(1\)|\bstable\b|\bnot\s+stable\b/i
    }
  ],

  // ✅ BUBBLE SORT
  "Bubble Sort": [
    {
      key: "bub_1_concept",
      title: "Understands repeated swapping of adjacent elements",
      afterTurnsMin: 2,
      detect: /\badjacent\b.*swap|bubbl(es|ing)|pairwise\s+compare/i
    },
    {
      key: "bub_2_dryrun",
      title: "Can trace one pass in an array",
      afterTurnsMin: 4,
      detect: /pass\s+\d|step\s+\d|after\s+first\s+pass/i
    },
    {
      key: "bub_3_optimization",
      title: "Knows about early stop optimization",
      afterTurnsMin: 6,
      detect: /no\s+swap|already\s+sorted|early\s+stop/i
    },
    {
      key: "bub_4_complexity",
      title: "States O(n²) and average/worst case",
      afterTurnsMin: 8,
      detect: /O\s*\(\s*n\s*\^\s*2\s*\)|O\s*\(\s*n\s*2\s*\)|\bn\^2\b/i
    },
    {
      key: "bub_5_space_stability",
      title: "Mentions O(1) space and stability",
      afterTurnsMin: 10,
      detect: /\bspace\b.*O\(1\)|\bstable\b/i
    }
  ],

  // ✅ INSERTION SORT
  "Insertion Sort": [
    {
      key: "ins_1_concept",
      title: "Understands insertion into sorted subarray",
      afterTurnsMin: 2,
      detect: /insert(ing)?\s+(into|in)\s+sorted|shifting\s+elements|key\s+element/i
    },
    {
      key: "ins_2_dryrun",
      title: "Performs dry-run on example",
      afterTurnsMin: 4,
      detect: /trace|example|step\s+\d|iteration\s+\d/i
    },
    {
      key: "ins_3_shift",
      title: "Explains element shifting vs swapping",
      afterTurnsMin: 6,
      detect: /shift|move|while.*(compare|insert)/i
    },
    {
      key: "ins_4_complexity",
      title: "States O(n²) and why it’s faster for nearly sorted data",
      afterTurnsMin: 8,
      detect: /O\s*\(\s*n\s*\^\s*2\s*\)|nearly\s+sorted|best\s+case\s+O\(n\)/i
    },
    {
      key: "ins_5_space_stability",
      title: "Mentions O(1) space and stable property",
      afterTurnsMin: 10,
      detect: /\bspace\b.*O\(1\)|\bstable\b/i
    }
  ],

  // ✅ MERGE SORT
  "Merge Sort": [
    {
      key: "mer_1_concept",
      title: "Understands divide and conquer concept",
      afterTurnsMin: 2,
      detect: /divide.*conquer|split.*half|recursive/i
    },
    {
      key: "mer_2_recursion",
      title: "Explains recursive splitting into halves",
      afterTurnsMin: 4,
      detect: /recurs(ion|ive)|split|half|base\s+case/i
    },
    {
      key: "mer_3_merge_step",
      title: "Describes merge operation of two sorted arrays",
      afterTurnsMin: 6,
      detect: /\bmerge\b|combine.*sorted|two\s+sorted\s+lists/i
    },
    {
      key: "mer_4_complexity",
      title: "States O(n log n) time and reason",
      afterTurnsMin: 8,
      detect: /O\s*\(\s*n\s*log\s*n\s*\)|divide\s+and\s+merge/i
    },
    {
      key: "mer_5_space_stability",
      title: "Mentions O(n) space and stability",
      afterTurnsMin: 10,
      detect: /O\(n\).*space|\bstable\b/i
    }
  ],

  // ✅ QUICK SORT
  "Quick Sort": [
    {
      key: "qui_1_concept",
      title: "Understands pivot-based partitioning",
      afterTurnsMin: 2,
      detect: /\bpivot\b|partition|split.*less.*greater/i
    },
    {
      key: "qui_2_partition",
      title: "Explains partition process clearly",
      afterTurnsMin: 4,
      detect: /left.*smaller|right.*greater|partition.*pivot/i
    },
    {
      key: "qui_3_recursion",
      title: "Explains recursive subcalls on partitions",
      afterTurnsMin: 6,
      detect: /recurs(ion|ive)|call\s+quick\s+sort|subarray/i
    },
    {
      key: "qui_4_complexity",
      title: "States O(n log n) average and O(n²) worst case",
      afterTurnsMin: 8,
      detect: /O\(n\s*log\s*n\)|O\(n\^2\)|pivot\s+choice/i
    },
    {
      key: "qui_5_space_stability",
      title: "Mentions O(log n) space and instability",
      afterTurnsMin: 10,
      detect: /O\(log\s*n\)|\bnot\s+stable\b/i
    }
  ],

  // ✅ HEAP SORT
  "Heap Sort": [
    {
      key: "hea_1_concept",
      title: "Understands heap data structure and max-heap property",
      afterTurnsMin: 2,
      detect: /\bheap\b|max[-\s]*heap|min[-\s]*heap|parent\s+child/i
    },
    {
      key: "hea_2_heapify",
      title: "Explains heapify or building heap",
      afterTurnsMin: 4,
      detect: /heapify|build\s+heap|adjust\s+heap/i
    },
    {
      key: "hea_3_extract",
      title: "Explains extract-max and swap process",
      afterTurnsMin: 6,
      detect: /extract|max\s+element|swap\s+root/i
    },
    {
      key: "hea_4_complexity",
      title: "States O(n log n) and why (heapify + extract)",
      afterTurnsMin: 8,
      detect: /O\(n\s*log\s*n\)|heapify|extract/i
    },
    {
      key: "hea_5_space_stability",
      title: "Mentions O(1) space and instability",
      afterTurnsMin: 10,
      detect: /O\(1\).*space|\bnot\s+stable\b/i
    }
  ]
};
