' Fact 1.6.7. Let G = (X, R) be a symmetric graph, where X ⊂ R 2 , assume that
' n = card(X) ≥ 3, and assume that the edges in R can be represented by line seg-
' ments lying in a plane that are either disjoint or intersect at a node. Furthermore,
' let m denote the number of edges of G, and let f denote the number of disjoint
' regions in R 2 whose boundaries are the edges of G. Then,
' n − m + f = 2.
' Consequently, if n ≥ 3, then
' m ≤ 3(n − 2).
' (Remark: The identity is Euler’s polyhedron formula.)
#macro Fact(G(x, y, r))
Declare Function SymmetricGraphic(Byref x As Long, Byref y As Long, Byval r As Long) As Integer

[Let] x = y 
[Let] x = r 

#IFDEF __FB_CYGWIN__
     If x Then
        Print "Number R edges G in what n > 3", x 
     Else
        x = [0]
        y = [2]
        r = [3]
     End 
#ELSE
Print x + y / r > r 
#ENDIF
End
#endmacro