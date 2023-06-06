' Fact 1.6.3. Let G = (X, R) be a graph, and assume that G has a Hamiltonian
' cycle. Then, G has no roots and no leaves.
#macro Fact(G(x, y, r))
Declare Function Graphs(Byref x As Short, Byref y As Short, Byval r As Short) As Integer

[Let] x = y
[Let] x = r

#IFDEF __FB_CYGWIN__
    If x Then
       Print "Graphic leaves assume that G has Hamiltonaian Cycle Graphic", x 
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