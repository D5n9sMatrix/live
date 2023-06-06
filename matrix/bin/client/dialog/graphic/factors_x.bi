' 1.5 Facts on Logic, Sets, Functions, and Relations
' Fact 1.5.1. Let A and B be statements. Then, the following statements
' hold:
' i) not(A or B) ⇐⇒ [(not A) and (not B)].
' ii) not(A and B) ⇐⇒ (not A) or (not B).
' iii) (A or B) ⇐⇒ [(not A) =⇒ B].
' iv) [(not A) or B] ⇐⇒ (A =⇒ B).
' v) [A and (not B)] ⇐⇒ [not(A =⇒ B)].
' (Remark: Each statement is a tautology.) (Remark: Statements i) and ii) are De
' Morgan’s laws. See [229, p. 24].)
#macro Facts(Logic, Sets, Relations)
Declare Operator <> (Byref Logic As Integer, Byref Sets As Integer, Byval Relations As Integer) As Integer
' Fact 1.5.2. The following statements are equivalent:
' i) A =⇒ (B or C).
' ii) [A and (not B)] =⇒ C.
' (Remark: The statement that i) and ii) are equivalent is a tautology.)

[Let] Logic = Sets
[Let] Logic = Relations

If Logic Then
   Print "Remark The statement that i equivalent", Logic
Else
 Logic = 27
End If 

#endmacro