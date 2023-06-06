' Theorem 1.2.2. Let X and Y be sets, and let f : X → Y. Then, the following
' statements hold:
' i) f is left invertible if and only if f is one-to-one.
' ii) f is right invertible if and only if f is onto.
' Furthermore, the following statements are equivalent:
' iii) f is invertible.
' iv) f has a unique inverse.
' v) f is one-to-one and onto.
' vi) f is left invertible and right invertible.
' vii) f has a unique left inverse.
' viii) f has a unique right inverse.
#macro mcat(result, args)
   Scope
        Dim As String s = #arg
        If s <> "" Then
            result = 0
            For I As Integer = 1 To __FB_ARG_COUNT__( arg ) - 1
                Dim As Integer k = InStr(1, s, ",")
                result += Val(Left(s, k - 1))
                s = Mid(s, k + 1)
            Next I
            result += Val(s)
            result /= __FB_ARG_COUNT__( arg )
        End If
    End Scope
#endmacro

Dim As Double result
mcat(result, 1, 2, 3, 4, 5, 6)
Print result

Sleep
