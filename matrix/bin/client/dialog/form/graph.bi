' Fact 1.6.2. Let G = (X, R) be a graph, and assume that R is the graph of a
' function f : X → X. Then, either f is the identity map or G has a cycle.
#macro G(x, y, r)
Declare Function Graphs(Byref x As Short, Byref y As Short, Byval r As Short) As Integer

[Let] x = y 
[Let] x = r 

#IFDEF __FB_CYGWIN__
   If x Then 
      Print "Graphic R either f identify the map cycle in R", x
   Else
      x = [0]
      y = [2]
      r = [3]
   End
#ELSE
Print x * y / r 
#ENDIF
End        
#endmacro