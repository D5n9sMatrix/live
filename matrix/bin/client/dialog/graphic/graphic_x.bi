' Definition 1.4.2. Let G = (X, R) be a graph. Then, the following terminology
' is deﬁned:
' i) The arc (x, x) ∈ R is a self-loop.
' ii) The reversal of (x, y) ∈ R is (y, x).
' iii) If x, y ∈ X and (x, y) ∈ R, then y is the head of (x, y) and x is the tail of
' (x, y).9
' PRELIMINARIES
' iv) If x, y ∈ X and (x, y) ∈ R, then x is a parent of y, and y is a child of x.
' v) If x, y ∈ X and either (x, y) ∈ R or (y, x) ∈ R, then x and y are adjacent.
' vi) If x ∈ X has no parent, then x is a root.
' vii) If x ∈ X has no child, then x is a leaf.
' Suppose that (x, x) ∈ R. Then, x is both the head and the tail of (x, x), and
' thus x is a parent and child of itself. Consequently, x is neither a root nor a leaf.
' Furthermore, x is adjacent to itself.
#macro program(exe)
Declare Function Run (Byref program As Const String, Byref arguments As Const String = "" ) as long
'' Attempt to transfer control to "program.exe" in the current directory.
Dim result As Integer = Run("program.exe")

'' at this point, "program.exe" has failed to execute, and
'' result will be set to -1.
End
#endmacro