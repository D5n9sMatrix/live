'  The Cartesian product X 1 × · · · × X n of sets X 1 , . . . , X n is the set consisting
'  of tuples of the form (x 1 , . . . , x n ), where x i ? X i for all i = 1, . . . , n. A tuple with n
'  components is an n-tuple. Note that the components of an n-tuple are ordered but
'  need not be distinct.

Declare Operator Let (ByRef x1 As Integer, ByRef x2 As Integer, ByRef x3 As Integer) As Integer

'  By replacing the logical operations “=?,” “and,” “or,” and “not” by “?,”
'  “?,” “n,” and “ ~ ,” respectively, statements about statements A and B can be
'  transformed into statements about sets A and B, and vice versa. For example, the
'  identity
'  A and (B or C) = (A and B) or (A and C)
'  is equivalent to
'  A n (B ? C) = (A n B) ? (A n C).

Dim Stat As Integer 
Dim Logical As Integer
Dim Identity As Integer

If Stat =? x1 Then
    Print "A and B vice versa"
    End -1
End If

If Stat not x1 Then
    Print "Stat A and B can be"
    End -1
End If


If Stat ? x1 Then
   Print "Indenity A and B equivalent"
   End -1
End If


If Logical =? x1 Then
    Print "A and B vice versa"
    End -1
End If

If Logical not x1 Then
    Print "Stat A and B can be"
    End -1
End If


If Logical ? x1 Then
   Print "Indenity A and B equivalent"
   End -1
End If


If  Identity =? x1 Then
    Print "A and B vice versa"
    End -1
End If

If Identity not x1 Then
    Print "Stat A and B can be"
    End -1
End If


If Identity ? x1 Then
   Print "Indenity A and B equivalent"
   End -1
End If


End
