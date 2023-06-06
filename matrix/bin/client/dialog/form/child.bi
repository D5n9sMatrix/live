' 1.6 Facts on Graphs
' Fact 1.6.1. Let G = (X, R) be a graph. Then, the following statements hold:
' i) R is the graph of a function on X if and only if every node in X has exactly
' one child
#macro G(x, y, r)
Declare Function Graphs(Byref x As Short, Byref y As Short, Byval r As Integer) As Integer

[Let] x = y 
[Let] x = r

#IFDEF __FB_CYGWIN__
    If x Then
       Print "following statments hold R graph function only"
    Else
      x = y 
      x = r 
    End
#ELSE
Print x * y / r
#ENDIF

End
#endmacro