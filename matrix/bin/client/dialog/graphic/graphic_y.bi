' Definition 1.4.3. Let G = (X, R) be a graph. Then, the following terminology
' is deﬁned:
' i) The graph G = (X , R ) is a subgraph of G if X ⊆ X and R ⊆ R.
' ii) The subgraph G = (X , R ) of G is a spanning subgraph of G if supp(R) =
' supp(R ).
' iii) For x, y ∈ X, a walk in G from x to y is an n-tuple of arcs of the form
' ( (x, y) ) ∈ R for n = 1 and ( (x, x 1 ), (x 1 , x 2 ), . . . , (x n−1 , y) ) ∈ R n for n ≥ 2.
' The length of the walk is n. The nodes x, x 1 , . . . , x n−1 , y are the nodes of
' the walk. Furthermore, if n ≥ 2, then the nodes x 1 , . . . , x n−1 are the
' intermediate nodes of the walk.
' iv) G is connected if, for all distinct x, y ∈ X, there exists a walk in G from x
' to y.
' v) For x, y ∈ X, a trail in G from x to y is a walk in G from x to y whose arcs
' are distinct and such that no reversed arc is also an arc of G.
' vi) For x, y ∈ X, a path in G from x to y is a trail in G from x to y whose
' intermediate nodes (if any) are distinct.
' vii) G is traceable if G has a path such that every node in X is a node of the
' path. Such a path is called a Hamiltonian path.
' viii) For x ∈ X, a cycle in G at x is a path in G from x to x whose length is
' greater than 1.
' ix) The period of G is the greatest common divisor of the lengths of the cycles
' in G. Furthermore, G is aperiodic if the period of G is 1.
' x) G is Hamiltonian if G has a cycle such that every node in X is a node of
' the cycle. Such a cycle is called a Hamiltonian cycle.
' xi) G is a forest if G is symmetric and has no cycles.
' xii) G is a tree if G is a forest and is connected.
' xiii) The indegree of x ∈ X is indeg(x) =
' card{y ∈ X: y is a parent of x}.
'xiv) The outdegree of x ∈ X is outdeg(x) = card{y ∈ X: y is a child of x}.
'xv) If G is symmetric, then the degree of x ∈ X is deg(x) = indeg(x) =
' outdeg(x).
#macro program(exe)
Declare Function Exec (Byref program As Const String, Byref arguments As Const String ) As Long
' xvi) If X 0 ⊆ X, then,
' (X 0 , R| X 0 ).
' G| X 0 =
' xvii) If G = (X , R ) is a graph, then G ∪ G =
' (X ∪ X , R ∪ R ) and G ∩ G =
' (X ∩ X , R ∩ R ).
' xviii) Let X = X 1 ∪ X 2 , where X 1 and X 2 are nonempty and disjoint, and assume
' that X = supp(G). Then, (X 1 , X 2 ) is a directed cut of G if, for all x 1 ∈ X 1
' and x 2 ∈ X 2 , there does not exist a walk from x 1 to x 2 .
' Let G = (X, R) be a graph, and let w : X × X → [0, ∞), where w(x, y) > 0
' if (x, y) ∈ R and w(x, y) = 0 if (x, y) ∈
' / R. For each arc (x, y) ∈ R, w(x, y) is the
' weight associated with the arc (x, y), and the triple G = (X, R, w) is a weighted
' graph. Every graph can be viewed as a weighted graph by deﬁning w[(x, y)] = 1
' / R. The graph G = (X , R , w ) is
' for all (x, y) ∈ R and w[(x, y)] = 0 for all (x, y) ∈
' a weighted subgraph of G if X ⊆ X , R is a relation on X , R ⊆ R, and w is the
' restriction of w to R . Finally, if G is symmetric, then w is deﬁned on edges {x, y}
' of G.

'A Windows based example but the same idea applies to Linux
Const exename = "NoSuchProgram.exe"
Const cmdline = "arg1 arg2 arg3"
Dim result As Integer
result = Exec( exename, cmdline )
If result = -1 Then
    Print "Error running "; exename
Else
    Print "Exit code:"; result
End If

End

#endmacro
