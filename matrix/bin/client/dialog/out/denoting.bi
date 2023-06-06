' Fact 1.5.8. Deﬁne the relation L on R × R by
' L = {((x 1 , y 1 ), (x 2 , y 2 )) ∈ (R × R) × (R × R) :
' x 1 ≤ x 2 and, if x 1 = x 2 , then y 1 ≤ y 2 }.
' Then, L is a total ordering on R × R. (Remark: Denoting this total ordering by
' “ ≤,” note that (1, 4) ≤ (2, 3) and (1, 4) ≤ (1, 5).) (Remark: This ordering is the
' lexicographic ordering or dictionary ordering, where ‘book’ ≤ ‘box’. Note that the
' ordering of words in a dictionary is reﬂexive, antisymmetric, and transitive, and
' that every pair of words can be ordered.) (Remark: See Fact 2.9.31.)
#macro L(x, y, r)
Declare Operator Let (Byref x As Integer, Byref y As Integer, Byval r As Integer) As Integer
' Fact 1.5.8. Deﬁne the relation L on R × R by
' L = {((x 1 , y 1 ), (x 2 , y 2 )) ∈ (R × R) × (R × R) :
' x 1 ≤ x 2 and, if x 1 = x 2 , then y 1 ≤ y 2 }
[Let] x => y = r

If x Then
   Print "Compile Date: " & __DATE__
Else
  x = y 
End 
     
#endmacro