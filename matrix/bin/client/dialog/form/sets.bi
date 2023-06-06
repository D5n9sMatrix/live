' Fact 1.5.13. Let X and Y be ﬁnite sets, assume that card(X) = card(Y), and
' let f : X → Y. Then, f is one-to-one if and only if f is onto. (Remark: See Fact
' 1.6.1.)
#macro Fact(x, y)
Declare Operator Let (Byref x As Short, Byref y As Short, Byval card As long) As Integer
' Fact 1.5.15. Let f : X → Y. Then, the following statements are equivalent:
' i) f is onto.
' ii) For all A ⊆ X, it follows that f [f −1 (A)] = A.
[Let] x = y 
[Let] card = x 

If card Then 
   Print "Clear j actor, if less 0"
Else
 x = y 
End
 
#endmacro