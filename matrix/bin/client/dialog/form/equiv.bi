' Furthermore, the following statements are equivalent:
' ii) R is the graph of a one-to-one function on X.
' iii) R is the graph of an onto function on X.
' iv) R is the graph of a one-to-one and onto function on X.
' v) Every node in X has exactly one child and not more than one parent.
' vi) Every node in X has exactly one child and at least one parent.
' vii) Every node in X has exactly one child and exactly one parent.
' (Remark: See Fact 1.5.13.)
#macro R(x, y, g)
Declare Function Graphs(Byref x As Short, Byref y As Short, Byval g As Integer) As Integer

' child equiv graphic
[Let] x = y 
[Let] x = g

#IFDEF __FB_CYGWIN__
   If x Then 
      Print "Node x Child parent exactly business(x, y, g)"
   Else
      x = [0]
      y = [2]
      g = [3]
   End
#ELSE
Print x + y / g 
#ENDIF
End        
#endmacro