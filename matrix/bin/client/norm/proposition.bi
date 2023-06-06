' Proposition 1.3.1. Let X 1 and X 2 be sets, and let R be a relation X 1 × X 2 .
' Then, there exists a function f : X 1 → X 2 such that R = Graph(f ) if and only
' if, for all x ∈ X 1 , there exists a unique y ∈ X 2 such that (x, y) ∈ R. In this case,
' f (x) = y.

Declare Function main _
  ( _
    ByVal argc As Integer, _
    ByVal argv As ZString Ptr Ptr _
  ) As Integer

  End main( __FB_ARGC__, __FB_ARGV__ )

Private Function main _
  ( _
    ByVal argc As Integer, _
    ByVal argv As ZString Ptr Ptr _
  ) As Integer

  Dim i As Integer
  For i = 0 To argc - 1
        Print "arg "; i; " = '"; *argv[i]; "'"
  Next i

  Return 0

End Function

