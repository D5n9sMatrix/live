' iv) Let 0 = k < n. Then,
#macro mouse2(x, y, n)
Declare Operator Let (Byref x As Long, Byref y As Long, Byval n As Integer) As Integer

[Let] x = y
[Let] x = n

#Ifdef __FB_CYGWIN__
      iF x Then
          Print "Let 0 = k < n Then", x
      Else
          x = [0]
          y = [2]
          n = [3]
      End If
#Else
Print x + y + n
#Endif
End
#endmacro