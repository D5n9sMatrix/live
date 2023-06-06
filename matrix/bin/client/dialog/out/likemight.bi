' Fact 1.5.11. Let f : X → Y, and let A, B ⊆ X. Then, the following statements
' hold:
' i) If A ⊆ B, then f (A) ⊆ f (B).
' ii) f (A ∪ B) = f (A) ∪ f (B).
' iii) f (A ∩ B) ⊆ f (A) ∩ f (B).
#macro Fact(x, y)
Declare Operator <> (Byref x As String, Byref y As String) As Integer

[Let] x = y 
[Let] x => y("A", "B")

If x = 0 Then
   Print "tell me where are you going my friend", x 
Else
 Print "Could this coconut water be sweet?"
End 
     
#endmacro