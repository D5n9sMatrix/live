' Fact 1.6.6. Let G = (X, R) be a tournament. Then, G has a Hamiltonian
' path. Furthermore, the Hamiltonian path is a Hamiltonian cycle if and only if G is
' connected.
#macro Fact(G(x, y, r))
Declare Function CureHoneyCycle(Byref x As Long, Byref y As Long, Byval r As Long) As Integer

[Let] x = y 
[Let] y = r 

#IFDEF __FB_CYGWIN__
    If x Then 
       Print "Tournament G has Hamiltonain path cycle and only connected", x 
    Else
       x = [0]
       y = [2]
       r = [3]
#ELSE
Print x + y / r 
#ENDIF
End          
#endmacro