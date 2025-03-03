---
layout: posts
title: "Optimal Placement of Fences DP Algo"
date: 2025-03-02
tags: dynamic_programming algorithms
author: Guy Cohen
---

```py
def cheap_field_fencing(posts):
    n = len(posts)
    
    def cost(i, j):
        if abs(i - j) <= 1:
            return 0
        x1, y1 = posts[i]
        x2, y2 = posts[j]
        return ((x2 - x1)**2 + (y2 - y1)**2)**0.5
    
    # Initialize DP table
    DP = [[(float('inf'), [])] * n for _ in range(n)]
    fences = []
    
    # Base case: e - b <= 2
    for b in range(n):
        for e in range(b, min(b+3, n)):
            DP[b][e] = (0, [])
    
    # Fill DP table
    for diagonal in range(3, n):
        for b in range(n - diagonal):
            e = b + diagonal
            best = float('inf')
            fence = None
            for k in range(b + 1, e):
                current = cost(b, k) + cost(k, e) + DP[b][k] + DP[k][e]
                if current < best:
                  best = current
                  fence = [(b, k), (k, e)]
            DP[b][e] = (best, fence)
  
    return DP[n-1], fences

```

<video width="720" height="480" controls>
  <source src="/assets/videos/fence_animation.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>


