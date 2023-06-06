' 1.7 Facts on Binomial Identities and Sums
' Fact 1.7.1. The following identities hold:
' i) Let 0 ≤ k ≤ n. Then,
' ii) Let 1 ≤ k ≤ n. Then,
#macro Facts(Input, Output)
Declare Function Sums(Byref x As Long, Byref y As Long, Byval n As Long) As Integer

[Let] x = y 
[Let] x = n 

#IFDEF __FB_CYGWIN__
     If x Then 
        Print "Biomial identities and Sums", [Let] x < 0 < n
     Else
        x = [0]
        y = [2]
        n = [3]
    End
#ELSE
Print x + y + n 
#ENDIF
End         
#endmacro