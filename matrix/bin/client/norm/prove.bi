' To prove ii), suppose that f is right invertible with right inverse g : Y →
' X. Then, for all y ∈ Y, it follows that f [g(y)] = y, which shows that f is onto.
' Conversely, suppose that f is onto so that, for all y ∈ Y, there exists at least one
' x ∈ X such that f(x) = y. Selecting one such x arbitrarily, deﬁne g : Y → X by
' g(y) = x. Consequently, f [g(y)] = y for all y ∈ Y, which shows that g is a right
' inverse of f.

#macro m(cat arg )
    Scope
        Var v = __FB_ARG_RIGHTOF__( arg, versus, "Not found 'versus'" )
        Print v
    End Scope
#endmacro

mcat(1 versus 2)
mcat("left-side" versus "right-side")
mcat(pi verso 3.14)

Sleep