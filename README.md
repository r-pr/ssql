Super simple query language for matching strings.

# Grammar

not-operator
binary-operator
	AND
	OR

expression
	(expression)
	NOT expression
	text
	text binary-operator expression

	
	
	
	

text: any non-empty string which is neither not-operator nor binary-operator and doesnt contain parens

# tokens:

{
	type: 'text',
	val: 'x'
}

{
	type: 'not-operator'
}

{
	type: 'binary-operator',
	kind: 'and' // 'or'
}

{
	type: 'expression',
	left: // text || expression
	right: // text || expression
	op: // not-operator, binary-operator, null
}
