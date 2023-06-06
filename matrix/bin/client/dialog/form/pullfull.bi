' Fact 1.5.15. Let f : X → Y. Then, the following statements are equivalent:
' i) f is onto.
' ii) For all A ⊆ X, it follows that f [f −1 (A)] = A.
#macro Fact(x, y, f)
Declare Operator Let (Byref x As Short, Byref y As Short Byval f As Integer) As Integer

' info latter meddog
[Let] x = y 
[Let] x = f

#IFDEF __FB_CYGWIN__
  '...instructions only for Cygwin...
#ELSE
  '...instructions not for Cygwin...
#ENDIF 

End
#endmacro