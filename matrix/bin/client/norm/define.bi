' Definition 1.2.3. Let I ⊂ R be a ﬁnite or inﬁnite interval, and let f : I → R.
' Then, f is convex if, for all α ∈ [0, 1] and for all x, y ∈ I, it follows that
' f [αx + (1 − α)y] ≤ αf (x) + (1 − α)f (y).
' (1.2.3)
' Furthermore, f is strictly convex if, for all α ∈ (0, 1) and for all distinct x, y ∈ I, it
' follows that
' f [αx + (1 − α)y] < αf (x) + (1 − α)f (y).
' A more general deﬁnition of convexity is given by Deﬁnition 8.6.14.

#macro count( range )
    Scope
        Dim x As Integer = __FB_ARG_LEFTOF__( range, To )
        Dim y As Integer = __FB_ARG_RIGHTOF__( range, To )
        Dim s As Integer = Sgn(y - x)
        Print "Counting " & #range
        For i As Integer = x To y Step s
            Print i
        Next i
    End Scope

#endmacro

count( 4 To 10 )
count( 7 To 2 )

Sleep
