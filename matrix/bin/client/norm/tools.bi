'  A set cannot have repeated elements. For example, {x, x} = {x}. However, a
'  multiset is a collection of elements that allows for repetition. The multiset consisting
'  of two copies of x is written as {x, x} ms . However, we do not assume that the listed
'  elements x, y of the conventional set {x, y} are distinct. The number of distinct
'  elements of the set S or not-necessarily-distinct elements of the multiset S is the
'  cardinality of S, which is denoted by card(S).

Declare Operator Let(ByRef x As Integer, ByRef y As Integer) As Integer

'  There are two basic types of mathematical statements involving quanti?ers.
'  An existential statement is of the form

[Let]  {x, x} = {x}
[Let]  {x, y} = {x}
[Let]  {y, y} = {y}
[Let]  {y, x} = {y}

End
