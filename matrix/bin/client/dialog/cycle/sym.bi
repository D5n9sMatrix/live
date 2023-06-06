' Fact 1.6.5. Let G = (X, R) be a symmetric graph. Then, the following state-
' ments are equivalent:
' i) G is a forest.
' ii) G has no cycles.
' iii) No pair of nodes is connected by more than one path.
' Furthermore, the following statements are equivalent:
' iv) G is a tree.
' v) G is a connected forest.
' vi) G is connected and has no cycles.
' vii) G is connected and has card(X) − 1 edges.
' viii) G has no cycles and has card(X) − 1 edges.
' ix) Every pair of nodes is connected by exactly one path.
#macro Fact(G(x, y, r))
Declare Function Symmetric(Byref x As Long, Byref y As Long, Byval r As Long) As Integer

[Let] x = y 
[Let] x = r 

#IFDEF __FB_CYGWIN__
    If x Then
       Print "G is connected and has card(X) 1 edges Cure Honey", x 
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