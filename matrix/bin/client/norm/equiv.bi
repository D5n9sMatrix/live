'  X ~ =
' (1.1.10)
' If x ? X implies that x ? Y, then X is contained in Y (X is a subset of Y), which is
' written as
' X ? Y.
Declare Operator <>  (ByRef x As String, ByRef y As String)

'  The statement X = Y is equivalent to the validity of both X ? Y and Y ? X. If
'  X ? Y and X  = Y, then X is a proper subset of Y and we write X ? Y. The sets X
'  and Y are disjoint if X n Y = Ø. A partition of X is a set of pairwise-disjoint and
'  nonempty subsets of X whose union is equal to X.

Dim Stat As String

Stat = x <>  y   ' states name x to y

End
