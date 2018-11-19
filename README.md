Super simple query language for matching strings.

# Grammar

_not-operator_: NOT

_binary-operator_:
	AND
	OR

_text_: any non-empty string which is neither not-operator nor binary-operator and doesnt contain parens

_expression_:
	(_expression_)
	_not-operator_ _expression_
	_text_
	_expression binary-operator expression_

# Usage

```
const ssql = require('ssql');

let query = ssql.parse('(hello  OR  world) AND (bar OR baz)');
ssql.match(query, 'world'));			//false;
ssql.match(query, 'hello'));			//false;
ssql.match(query, 'hello world'));		//false;
ssql.match(query, 'world hello'));		//false;
ssql.match(query, 'world bar hello'));	//true;
ssql.match(query, 'world baz'));		//true;
ssql.match(query, 'hello baz'));		//true;
ssql.match(query, 'hello bar'));		//true;
```