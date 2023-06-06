' Fact 1.5.4. The following statements are equivalent:
' i) Not [for all x, there exists y such that statement Z is satisﬁed].
' ii) There exists x such that, for all y, statement Z is not satisﬁed.
#macro Fact(x, y, z)
Declare Operator Let (Byref jump As Integer, Byref buss As Integer, Byval value AS Integer) As Integer
' Fact 1.5.5. Let A, B, and C be sets, and assume that each of these sets has
' a ﬁnite number of elements. Then,
' card(A ∪ B) = card(A) + card(B) − card(A ∩ B)
' and
' card(A ∪ B ∪ C) = card(A) + card(B) + card(C)
' − card(A ∩ B) − card(A ∩ C) − card(B ∩ C)
' + card(A ∩ B ∩ C).
' (Remark: This result is the inclusion-exclusion principle. See [177, p. 82] or [1218,
' pp. 64–67].)
[Let] x = y <> z

If x = 0 Then
   Print "Card A and B and C Step New Sector prolong of other side via", buss
Else
  jump = ["a11", "a12", "a13", "a21", "a22", "a23"]
  buss = value
End If 
       
#endmacro