' Proof. To prove i), suppose that f is left invertible with left inverse g : Y → X.
' Furthermore, suppose that x 1 , x 2 ∈ X satisfy f(x 1 ) = f(x 2 ). Then, x 1 = g[f(x 1 )] =
' g[f(x 2 )] = x 2 , which shows that f is one-to-one. Conversely, suppose that f is
' one-to-one so that, for all y ∈ R(f ), there exists a unique x ∈ X such that f(x) = y.
' Hence, deﬁne the function g : Y → X by g(y) = x for all y = f(x) ∈ R(f ) and by
' g(y) arbitrary for all y ∈ Y\R(f ). Consequently, g[f(x)] = x for all x ∈ X, which
' shows that g is a left inverse of f.

#macro mcat( arg )
    Scope
        Var v = __FB_ARG_LEFTOF__( arg, versus, "Not found 'versus'" )
        Print v
    End Scope
#endmacro

mcat(1 versus 2)
mcat("left-side" versus "right-side")
mcat(3.14 verso pi) 

Sleep