Super simple query language for matching strings.

# Grammar

_not-operator_: NOT

_binary-operator_: <br>
&nbsp;&nbsp;AND<br>
&nbsp;&nbsp;OR

_text_: any non-empty string which is neither not-operator nor binary-operator and doesnt contain parens

_expression_:<br>
&nbsp;&nbsp;(_expression_)<br>
&nbsp;&nbsp;_not-operator_ _expression_<br>
&nbsp;&nbsp;_text_<br>
&nbsp;&nbsp;_expression binary-operator expression_

# Usage

```
const ssql = require('real-ssql');

let query = ssql.parse('(hello  OR  world) AND (bar OR baz)');
ssql.match(query, 'world'));            //false;
ssql.match(query, 'hello'));            //false;
ssql.match(query, 'hello world'));      //false;
ssql.match(query, 'world hello'));      //false;
ssql.match(query, 'world bar hello'));  //true;
ssql.match(query, 'world baz'));        //true;
ssql.match(query, 'hello baz'));        //true;
ssql.match(query, 'hello bar'));        //true;
```
