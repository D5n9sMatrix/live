' 1.3 Relations
' Let X, X 1 , and X 2 be sets. A relation R on X 1 × X 2 is a subset of X 1 × X 2 . A
' relation R on X is a relation on X × X. Likewise, a multirelation R on X 1 × X 2 is a
' multisubset of X 1 × X 2 , while a multirelation R on X is a multirelation on X × X.

#print __FB_ARG_EXTRACT__( 1, 7, 89.78, "Postman" )

'   In this example, the '__FB_EVAL__' is absolutely mandatory in this 'print_last' macro,
'   because the numeric expression '__FB_ARG_COUNT__( args ) - 1' must be fully evaluated
'   before being used as the index argument of '__FB_ARG_EXTRACT__'

#macro print_last( args... )
    #define last_arg_num __FB_EVAL__( __FB_ARG_COUNT__( args ) - 1 )
    #print __FB_ARG_EXTRACT__( last_arg_num, args )
#endmacro

print_last( 7, 89.78, "Postman" )
