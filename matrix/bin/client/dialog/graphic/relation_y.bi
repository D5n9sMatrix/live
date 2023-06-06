' The graph G = (X, R) can be visualized as a set of points in the plane repre-
' senting the nodes in X connected by the arcs in R. Speciﬁcally, the arc (x, y) ∈ R
' from x to y can be visualized as a directed line segment or curve connecting node x
' to node y. The direction of an arc can be denoted by an arrow head. For example,
' consider a graph that represents a city with streets (arcs) connecting houses (nodes).
' Then, a symmetric relation is a street plan with no one-way streets, whereas an
' antisymmetric relation is a street plan with no two-way streets.
#macro arc(x, y)
Declare Operator <> (ByRef x As Integer, ByRef y As Integer, ByVal nodes As Integer) As Integer
' Definition 1.4.1. Let G = (X, R) be a graph. Then, the following terminology
' is deﬁned:
'(X, rev(R)).
'i) The reversal of G is the graph rev(G) =
'ii) The complement of G is the graph G ∼ = (X, R ∼ ).
'iii) The reﬂexive hull of G is the graph ref(G) = (X, ref(R)).
'iv) The symmetric hull of G is the graph sym(G) =
'(X, sym(R)).
'v) The transitive hull of G is the graph trans(G) = (X, trans(R)).
'vi) The equivalence hull of G is the graph equiv(G) =
'(X, equiv(R)).
'vii) G is reﬂexive if R is reﬂexive.
' viii) G is symmetric if R is symmetric. In this case, the arcs (x, y) and (y, x) in
'R are denoted by the subset {x, y} of X, called an edge.
'ix) G is transitive if R is transitive.
'x) G is an equivalence graph if R is an equivalence relation.
'xi) G is antisymmetric if R is antisymmetric.
'xii) G is partially ordered if R is a partial ordering on X.
'xiii) G is totally ordered if R is a total ordering on X.
'xiv) G is a tournament if G has no self-loops, is antisymmetric, and sym(R) =
'X × X.

[Let] nodes = x <> y

If nodes Then
   Print "Nodes partial symetric arcs(x, y) and (y, x)"
   End 1
Else
  For x = 1 To 10
      x++
  Next
  For y = 1 To 10
      y++
  Next
End If 

End 0

#endmacro