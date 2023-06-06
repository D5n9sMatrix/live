Proposition 1.3.3. Let R 1 and R 2 be relations on X. If R 1 and R 2 are
(reﬂexive, symmetric) relations, then so are R 1 ∩ R 2 and R 1 ∪ R 2 . If R 1 and R 2 are
(transitive, equivalence) relations, then so is R 1 ∩ R 2 .

#macro Prop(R1, R2)
Declare Operator Let (ByRef R1 As Long, ByRef R2 As Long)

 Extern symmetric Alias "relations" As Long
 Dim x As Integer
 Dim y As Integer

 If R1 and R2 Then
    Print "symmetric of relations: ", symmetric
 Else
   Return x * y 
 End If 

 [Let] R1 = R2 

End

Prop(10, 1)

#endmacro