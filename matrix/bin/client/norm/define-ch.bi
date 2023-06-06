' Definition 1.3.4. Let R be a relation on X. Then, the following terminology
' is deﬁned:
' i) The complement R ∼ of R is the relation R ∼ = (X × X)\R.
' ii) The support supp(R) of R is the smallest subset X 0 of X such that R is a
' relation on X 0 .6
' CHAPTER 1
' iii) The reversal rev(R) of R is the relation rev(R) = {(y, x) : (x, y) ∈ R}.
' iv) The shortcut shortcut(R) of R is the relation shortcut(R) =
' {(x, y) ∈ X ×
' X: x and y are distinct and there exist k ≥ 1 and x 1 , . . . , x k ∈ X such that
' (x, x 1 ), (x 1 , x 2 ), . . . , (x k , y) ∈ R}.
' v) The reﬂexive hull ref(R) of R is the smallest reﬂexive relation on X that
' contains R.
' vi) The symmetric hull sym(R) of R is the smallest symmetric relation on X
' that contains R.
' vii) The transitive hull trans(R) of R is the smallest transitive relation on X
' that contains R.
' viii) The equivalence hull equiv(R) of R is the smallest equivalence relation on
' X that contains R.

Print "program launched via: " & Command(0)

Dim As Integer i = 1
Do
    Dim As String arg = Command(i)
    If Len(arg) = 0 Then
        Exit Do
    End If

    Print "command line argument " & i & " = """ & arg & """"
    i += 1
Loop

If i = 1 Then
    Print "(no command line arguments)"
End If

Sleep