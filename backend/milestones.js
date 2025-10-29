// server/milestones.js
module.exports = {
  // ✅ SELECTION SORT
  "Selection Sort": [
    {
      key: "sel_1_concept",
      title: "Understands 'find-min each pass'",
      afterTurnsMin: 5,
      detect: /select|minimum|min|small|find|search|look|scan|unsorted|each/i
    },
    {
      key: "sel_2_dryrun",
      title: "Dry-run on a small array",
      afterTurnsMin: 10,
      detect: /pass|step|iteration|trace|example|array|\d.*\d|\[.*\]|first|swap|position/i
    },
    {
      key: "sel_3_swap",
      title: "Explains swap to current index i",
      afterTurnsMin: 15,
      detect: /swap|exchange|replace|position|index|place|move|put/i 
    },
    {
      key: "sel_4_complexity",
      title: "States O(n²) and why",
      afterTurnsMin: 20,
      detect: /O\(n|complexity|time|quadratic|n\^2|n\*n|n\s*2|slow|fast|compare|nested|loop/i
    },
    {
      key: "sel_5_space_stability",
      title: "Knows space O(1) & (not) stability",
      afterTurnsMin: 25,
      detect: /space|memory|O\(1\)|constant|stable|stability|unstable|not.*stable|in-place|order/i
    }
  ],

  // ✅ BUBBLE SORT
  "Bubble Sort": [
    {
      key: "bub_1_concept",
      title: "Understands repeated swapping of adjacent elements",
      afterTurnsMin: 5,
      detect: /adjacent|neighbor|next|swap|bubbl|pair|compare.*two|compar(e|ing).*element/i
    },
    {
      key: "bub_2_dryrun",
      title: "Can trace one pass in an array",
      afterTurnsMin: 10,
      detect: /pass|iteration|round|step|trace|walk|through|example|\d.*\d|array|\[.*\]|first.*last|compare|position/i
    },
    {
      key: "bub_3_optimization",
      title: "Knows about early stop optimization",
      afterTurnsMin: 15,
      detect: /stop|optimi|flag|sorted|no.*swap|swap.*no|already|done|finish|check|improv/i
    },
    {
      key: "bub_4_complexity",
      title: "States O(n²) and average/worst case",
      afterTurnsMin: 20,
      detect: /O\(n|complexity|time|quadratic|n\^2|n\*n|n\s*2|worst|best|average|slow|fast|efficient/i
    },
    {
      key: "bub_5_space_stability",
      title: "Mentions O(1) space and stability",
      afterTurnsMin: 25,
      detect: /space|memory|O\(1\)|constant|stable|stability|in-place|order|relative|extra/i
    }
  ],

  // ✅ INSERTION SORT
  "Insertion Sort": [
    {
      key: "ins_1_concept",
      title: "Understands insertion into sorted subarray",
      afterTurnsMin: 5,
      detect: /insert|sorted|shift|key|card|pick|place|compare|left|right|subarray/i
    },
    {
      key: "ins_2_dryrun",
      title: "Performs dry-run on example",
      afterTurnsMin: 10,
      detect: /trace|example|step|iteration|pass|array|\d.*\d|\[.*\]|walk|through/i
    },
    {
      key: "ins_3_shift",
      title: "Explains element shifting vs swapping",
      afterTurnsMin: 15,
      detect: /shift|move|while|compare|swap|back|left|position|greater|less/i
    },
    {
      key: "ins_4_complexity",
      title: "States O(n²) and why it's faster for nearly sorted data",
      afterTurnsMin: 20,
      detect: /O\(n|complexity|time|nearly|sorted|best|worst|average|fast|slow|efficient/i
    },
    {
      key: "ins_5_space_stability",
      title: "Mentions O(1) space and stable property",
      afterTurnsMin: 25,
      detect: /space|memory|O\(1\)|constant|stable|stability|in-place|order|relative/i
    }
  ],

  // ✅ MERGE SORT (More complex, needs more time)
  "Merge Sort": [
    {
      key: "mer_1_concept",
      title: "Understands divide and conquer concept",
      afterTurnsMin: 6,
      detect: /divide|conquer|split|break|half|two|parts|recursive|smaller/i
    },
    {
      key: "mer_2_recursion",
      title: "Explains recursive splitting into halves",
      afterTurnsMin: 12,
      detect: /recurs|split|divide|half|middle|base|case|call|itself|subarrays?/i
    },
    {
      key: "mer_3_merge_step",
      title: "Describes merge operation of two sorted arrays",
      afterTurnsMin: 18,
      detect: /merge|combine|join|together|sorted|two|compare|smaller|larger|pointer/i
    },
    {
      key: "mer_4_complexity",
      title: "States O(n log n) time and reason",
      afterTurnsMin: 24,
      detect: /O\(n|complexity|time|log|divide|level|height|tree|fast|efficient/i
    },
    {
      key: "mer_5_space_stability",
      title: "Mentions O(n) space and stability",
      afterTurnsMin: 30,
      detect: /space|memory|O\(n|extra|auxiliary|array|stable|stability|order|relative/i
    }
  ],

  // ✅ QUICK SORT (Most complex, needs most time)
  "Quick Sort": [
    {
      key: "qui_1_concept",
      title: "Understands pivot-based partitioning",
      afterTurnsMin: 6,
      detect: /pivot|partition|split|divide|element|choose|select|reference|less|greater|smaller|larger/i
    },
    {
      key: "qui_2_partition",
      title: "Explains partition process clearly",
      afterTurnsMin: 12,
      detect: /partition|left|right|side|smaller|larger|greater|less|pivot|move|swap|arrange|place/i
    },
    {
      key: "qui_3_recursion",
      title: "Explains recursive subcalls on partitions",
      afterTurnsMin: 18,
      detect: /recurs|call|itself|subarray|left|right|partition|sort|again|repeat/i
    },
    {
      key: "qui_4_complexity",
      title: "States O(n log n) average and O(n²) worst case",
      afterTurnsMin: 24,
      detect: /O\(n|complexity|time|log|worst|best|average|pivot|balanced|unbalanced|fast|slow/i
    },
    {
      key: "qui_5_space_stability",
      title: "Mentions O(log n) space and instability",
      afterTurnsMin: 30,
      detect: /space|memory|O\(log|stack|recursion|stable|unstable|not.*stable|in-place|order/i
    }
  ],

  // ✅ HEAP SORT (Advanced concept, needs more time)
  "Heap Sort": [
    {
      key: "hea_1_concept",
      title: "Understands heap data structure and max-heap property",
      afterTurnsMin: 7,
      detect: /heap|max|min|parent|child|tree|binary|root|node|property|largest|complete/i
    },
    {
      key: "hea_2_heapify",
      title: "Explains heapify or building heap",
      afterTurnsMin: 14,
      detect: /heapify|build|construct|create|adjust|maintain|property|down|up|sift/i
    },
    {
      key: "hea_3_extract",
      title: "Explains extract-max and swap process",
      afterTurnsMin: 21,
      detect: /extract|remove|max|root|swap|replace|last|first|top|element/i
    },
    {
      key: "hea_4_complexity",
      title: "States O(n log n) and why (heapify + extract)",
      afterTurnsMin: 28,
      detect: /O\(n|complexity|time|log|heapify|extract|level|height|fast|efficient/i
    },
    {
      key: "hea_5_space_stability",
      title: "Mentions O(1) space and instability",
      afterTurnsMin: 35,
      detect: /space|memory|O\(1\)|constant|stable|unstable|not.*stable|in-place|order/i
    }
  ]
};
