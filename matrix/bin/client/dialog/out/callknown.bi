' Then, L is a total ordering on R × R. (Remark: Denoting this total ordering by
' “ ≤,” note that (1, 4) ≤ (2, 3) and (1, 4) ≤ (1, 5).) (Remark: This ordering is the
' lexicographic ordering or dictionary ordering, where ‘book’ ≤ ‘box’. Note that the
' ordering of words in a dictionary is reﬂexive, antisymmetric, and transitive, and
' that every pair of words can be ordered.) (Remark: See Fact 2.9.31.)
#macro L(x, y, r)
Declare Operator <> (Byref x As Short, Byref y As Short, Byval r As Short) As Integer

[Let] x = y ' path dialog talking 
[Let] x = r ' talking home

Print "Compile Date: " & __DATE_ISO__

If __DATE_ISO__ < "2011-12-25" Then
    Print "Compiled before discovery"
Else
    Print "Compiled after discovery"
End If  
Dim Chocolate As Short
output To Chocolate
End

#endmacro