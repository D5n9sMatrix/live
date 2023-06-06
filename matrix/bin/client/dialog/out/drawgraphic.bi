' Fact 1.5.12. Let f : X → Y, and let A, B ⊆ Y. Then, the following statements
' hold:
' i) f [f −1 (A)] ⊆ A ⊆ f −1 [f (A)].
' ii) f −1 (A ∪ B) = f −1 (B 1 ) ∪ f −1 (B 2 ).
' iii) f −1 (A 1 ∩ A 2 ) = f −1 (A 1 ) ∩ f −1 (A 2 ).
#macro Fact(x, y)
Declare Operator Let (Byref x As Short, Byref y As Short) As Integer

[Let] x = y 
[Let] y = x 

If x = 0 Then
   Print "say draw graphic"
Else
 x = y 
End

End

#endmacro