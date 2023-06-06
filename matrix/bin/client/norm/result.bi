'  1.2 Functions
'  Let X and Y be sets. Then, a function f that maps X into Y is a rule f : X ? Y
'  that assigns a unique element f(x) (the image of x) of Y to each element x of X.
'  Equivalently, a function f : X ? Y can be viewed as a subset F of X × Y such that,
'  for all x ? X, it follows that there exists y ? Y such that (x, y) ? F and such that, if
' 
'  (x, y 1 ), (x, y 2 ) ? F, then y 1 = y 2 . In this case, F = Graph(f ) = {(x, f(x)): x ? X}.
'  The set X is the domain of f, while the set Y is the codomain of f. If f : X ? X, then
'
'  {f(x): x ? X 1 }.
'  f is a function on X. For X 1 ? X, it is convenient to de?ne f(X 1 ) =
'  The set f(X), which is denoted by R(f ), is the range of f. If, in addition, Z is a set
'  and g : Y ? Z, then g • f : X ? Z (the composition of g and f ) is the function
' 
'  (g • f )(x) = g[f(x)]. If x 1 , x 2 ? X and f(x 1 ) = f(x 2 ) implies that x 1 = x 2 , then f
'  is one-to-one; if R(f ) = Y, then f is onto. The function I X : X ? X de?ned by
' 
'  x for all x ? X is the identity on X. Finally, x ? X is a ?xed point of the
'  I X (x) =
'  function f : X ? X if f (x) = x.
Declare Operator Let(ByRef x As Integer, ByRef y As Integer) As Integer

' The following result shows that function composition is associative.
' Proposition 1.2.1. Let X, Y, Z, and W be sets, and let f : X ? Y, g : Y ? Z,
' h : Z ? W. Then,
' h • (g • f ) = (h • g) • f.

[Let] x = y

End

