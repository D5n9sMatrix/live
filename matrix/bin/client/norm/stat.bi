' Preliminaries
' In this chapter we review some basic terminology and results concerning logic,
' sets, functions, and related concepts. This material is used throughout the book.
Declare Operator Let (ByRef  lhs,  As  T1, ByRef rhs, As T2)

' 1.1 Logic and Sets
' Let A and B be statements. The negation of A is the statement (not A),
' the both of A and B is the statement (A and B), and the either of A and B is the
' statement (A or B). The statement (A or B) does not contradict (A and B), that
' is, the word “or” is inclusive. Every statement is assumed to be either true or false;
' likewise, no statement can be both true and false.

lhs = rhs

' The statements “A and B or C” and “A or B and C” are ambiguous. We
' therefore write “A and either B or C” and “either A or both B and C.

[Let] lhs = rhs

' Let A and B be statements. The implication statement “if A is satis?ed, then
' B is satis?ed” or, equivalently, “A implies B” is written as A =? B, while A ?? B
' is equivalent to [(A =? B) and (A ?= B)]. Of course, A ?= B means B =? A. A
' tautology is a statement that is true regardless of whether the component statements
' are true or false. For example, the statement “(A and B) implies A” is a tautology.
' A contradiction is a statement that is false regardless of whether the component
' statements are true or false.

[Let] T1 = T2

End 