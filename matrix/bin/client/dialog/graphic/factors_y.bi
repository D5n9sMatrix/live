' Fact 1.5.3. The following statements are equivalent:
' i) A ⇐⇒ B.
' ii) [A or (not B)] and (not [A and (not B)]).
' (Remark: The statement that i) and ii) are equivalent is a tautology.)
#macro Fact(A, B)
Declare Operator <> (Byref A As Integer, Byref B As Integer, Byval i As Integer) As Integer
' Fact 1.5.4. The following statements are equivalent:
' i) Not [for all x, there exists y such that statement Z is satisﬁed].
' ii) There exists x such that, for all y, statement Z is not satisﬁed.
[Let] A = B 
[Let] i = A <> B 

If i Then
   Print "statements are equivalent all x and y"
Else
 for i = 1 To 10
     i++
 Next
End 
         
#endmacro