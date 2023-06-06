' Fact 1.6.4. Let G = (X, R) be a graph. Then, G has either a root or a cycle.
#macro Fact(G(x, y, r))
Declare Function Graphs(Byref x As Short, Byref y As Short, Byval r As Short) As Integer

[Let] x = y 
[Let] x = r 

#IFDEF __FB_CYGWIN__
    If x Then
       Print "Graphic G has either root or cycle", x
    Else
       x = [0]
       y = [2]
       r = [3]
    End
#ELSE
Print x + y / r 
#ENDIF
End       
#endmacro