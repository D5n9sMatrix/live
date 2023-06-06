' Fact 1.5.16. Let f : X → Y, and let g : Y → Z. Then, the following statements
' hold:
' i) If f and g are one-to-one, then f • g is one-to-one.
' ii) If f and g are onto, then f • g is onto.
' (Remark: A matrix version of this result is given by Fact 2.10.3.)
#macro Fact(x, y, f)
Declare Operator Let (Byref x As Short, Byref y As Short, Byval f As Integer) As Integer
' meddog logic info
[Let] x = y 
[Let] x = f 

#IFDEF __FB_CYGWIN__
    If x Then
       Print "following statements one-to-one matrix"
    Else
      for x = 1 To 10
          x++
      Next
    End If 
#ELSE
print "value of x", x 
#ENDIF
End            
#endmacro