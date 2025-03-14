---
layout: default
title: "Optimal Placement of Fences DP Algo"
date: 2025-03-02
tags: dynamic_programming algorithms
author: Guy Cohen
---

Hello there!

I was presented with this cool DP problem while working on the homework for CSE421 @ UW. Here is the problem description:

You are helping out a hobby farmer in a very flat area who has a property with n very heavy-duty fence-posts sunk in concrete on the perimeter of the property at locations given by coordinates v1=(x1,y1),..., vn=(xn,yn). They have installed straight-line fencing between adjacent fence-posts vi and vi+1 for every i as well as between vn and v1. Wherever you are inside the fenced off area you can see every bit of the exterior fencing.

Your hobby farmer friend wants to grow many different kinds of crops and raise many different kinds of animals that they need to separate from each other in different portions of their property, but they don't want to add any more heavy-duty fence-posts or use any more fencing than is absolutely necessary.

You get excited when you realize that you can create n-2 different zones that are all 3-sided simply by running straight-line fences inside the field between pairs of existing vi and vj. (Of course those fences can't cross.)

When you think some more, you realize that there are many possible ways to do it and some of them result in using much less fencing than others. This gets you even more excited because you realize that you can apply the dynamic programming ideas you learned in your algorithms course to figure out what one would use the least fencing! In particular, you start wondering what the best choice of the third vertex vk would be for the 3-sided region that has the 2 other vertices v1 and vn. This gives you some ideas of how to proceed.

Apply all the standard steps associated with dynamic programming to get an efficient algorithm to find the shortest length of fencing necessary.
Solution

Note: for this problem, posts use 0-based indexing (it makes the calculations simpler when performing modulus)

Defn OPT(b, e) to be the minimum total distance of fences needed to connect posts in the range b to e inclusive, where b is the smallest indexed fence post and e is the largest indexed fence post in the range [b, e]
Defn cost(i, j) to return the distance of fence needed to connect posts i and j if they are not adjacent, otherwise if they are adjacent posts (ex i = j + 1) then it returns 0

Recurrence relation defn: OPT(b, e) =
a. 0 if |e - b| <= 2
b. min(cost(b, k) + cost(k, e) + OPT(b, k) + OPT(k, e)), for all k in [b + 1, ..., e - 1]
Note that b < e and b, e must be adjacent (might not be adjacent in the initial configuration of posts, but are in a filled out solution)

Argue for the correctness of your recurrence relation

a. Base Case, |e - b| <= 2: If b - e is less than or equal to two, then at most there can be three fence posts in the range from b to e. Thus since we need to split the shape into zones, and by definition of a zone it has 3 sides, we can't split posts in the range from b to e anymore. Thus the algorithm correctly returns 0 as the minimum fence post length required.

b. Otherwise: This means we have at least four fence posts in the range b to e. Note that for each post, it might either be part of an inside fence or not in the optimal solution. Also note that by definition of a zone, if a fence post isn't used for an inside fence, its adjacent neighbors must be otherwise the shape created would have more than three sides. Thus we can split our algorithm into three cases: (1) include posts at b,e, (2) include posts b but exclude e, (3) include e but exclude b. I will show that the range for k is correct by cases:

(1) If we include posts b, e, then k must be in the range of b + 1 to e - 1, since otherwise it would be adjacent to one of the posts and then they wouldn't get included.
(2) If we include post b but not e, then k = e - 1 since it must be adjacent to e.
(3) If we include post e but not b, then k = b + 1 since it must be adjacent to b.
Thus it is correct to search for k in the range of b + 1 to e - 1.

The recurrence relation is correct because the cost of the posts from b to e with a fence attached to (b, k) and (k, e) is equal to the cost of the fence from (b, k) plus (k, e) plus the cost of the smaller set of posts on the left and right. This can be formally written as:

cost(b, k) + cost(k, e) + OPT(b, k) + OPT(k, e)

Also note that b, e will always be adjacent if OPT was initially called with adjacent posts. This is because at each recursive call, if we call OPT(b, k) or OPT(k, e), then we must have added a fence from (b, k) and from (k, e).

Thus the minimum cost of placing fencing between b and e will be the minimum of the equation across all possible values of k. Therefore, the algorithm is correct since it returns exactly that.

Describe the parameters for the subproblems in your recursion and how you will store their solutions

I will store the sub problems in a 2D n × n array DP, where n is the number of posts given. I will store each solution as an element of this array.
In what order can you evaluate them iteratively?

I will first evaluate the base case, when e - b <= 2. I will then evaluate each diagonal e - b = c, going from c = 1, ..., n - 1 (last diagonal will be top right of DP array)

Write the pseudocode for your iterative algorithm

Algorithm: Cheap Field Fencing

Input: posts is an array of posts, where each post is of the form (xk, yk)
n = posts.length

Function cost(i, j):
    If |i - j| <= 1:
        Return 0
    x1, y1 = posts[i]
    x2, y2 = posts[j]
    Return sqrt((x2 - x1)^2 + (y2 - y1)^2)

DP is 2D array of size n × n initialized with every element as infinity

Set DP[z][w] = 0 for all z, w in [1, ..., n], where z - w <= 2

For diagonal = 3 to n - 1:
    For each (e, b) pair such that e - b = diagonal and e, b in [1, ..., n]:
        best = infinity
        For k = b + 1 to e - 1:
            best = min(best, cost(b, k) + cost(k, e) + DP[b][k] + DP[k][e])
        DP[b][e] = best

Return DP[1][n]


Runtime O(n^3)

We iterate roughly through every diagonal, then inside we iterate across every element on that diagonal, then inside of that we iterate through every element k such that b < k < e.
