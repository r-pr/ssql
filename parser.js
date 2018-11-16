const NOT_OPTOR = 'NOT';
const AND_OPTOR = 'AND';
const OR_OPTOR = 'OR';

// return length of whitespace
function whitespace(str){
    for (let i = 0; i < str.length; i++){
        if (!isSpace(str[i])){
            return i;
        }
    }
    return str.length - 1;
}



function hasPrefix(str, prefix){
    if (str.length < prefix.length){
        return false;
    }
    if (str.length === prefix.length){
        return str === prefix;
    }
    return str.slice(0, prefix.length) === prefix;
}

function tryParseText(str){
    let result = '';
    for (let i = 0; i < str.length; i++){
        if (!isSpace(str[i]) && str[i] !== '(' && str[i] !== ')'){
            result += str[i];
        } else {
            break;
        }
    }
    switch(result){
    case NOT_OPTOR:
    case AND_OPTOR:
    case OR_OPTOR:
    case '':
        return null;
    default:
        return result;
    }
}

let depth = 0;
function tryParseExpression(str){
    console.log('try parse: ' + str);
    depth++;
    if (depth > 100){
        console.log('sth went wrong');
        process.exit(1);
    }
    if (str === ''){
        return null;
    }
    let offset = whitespace(str);
    let parenthesized = false;
    if (offset === str.length - 1 && str.length > 1){
        return null;
    }
    console.log('offset: ' + offset);
    console.log('char=' + str[offset]);
    str = str.slice(offset);
    if (str[0] === '('){
        parenthesized = true;
        offset++;
        let expression = tryParseExpression(str.slice(1));
        if (!expression){
            return null;
        }
        str = str.slice(1+expression.length);
        if (str === ''){
            return null;
        }
        let wsAfter = whitespace(str);
        if (wsAfter === str.length - 1 && wsAfter > 0){
            return null;
        }
        if (str[wsAfter] !== ')'){
            return null;
        }
        expression.parens = true;
        expression.length = offset + expression.length + wsAfter + 1;
        return expression;
    } else {
        if (hasPrefix(str, NOT_OPTOR)){
            offset += NOT_OPTOR.length;
            str = str.slice(NOT_OPTOR.length);
            let wsAfter = whitespace(str);
            if (wsAfter === 0){
                // после NOT должен идти минимум 1 пробел
                return null;
            }
            offset += wsAfter;
            str = str.slice(wsAfter);
            let expression = tryParseExpression(str);
            if (!expression){
                return null;
            }
            let result = makeExpression(expression, null, notOperator());
            result.length = offset + expression.length;
            return result;
        } 
        let text = tryParseText(str);
        if (text === null){
            return null;
        }
        let expression = makeExpression(makeText(text), null, null);
        expression.length = offset + text.length;
        return expression;
    }
}

module.exports.parse = tryParseExpression;

function isSpace(char){
    switch(char){
    case ' ':
    case '\t':
    case '\n':
    case '\b':
    case '\f':
    case '\r':
    case '\v':
        return true;
    }
    return false;
}

//all tokens have length property

function makeText(val){
    return {
        type: 'text',
        val
    };
}

function notOperator(){
    return {
        type: 'not-operator'
    };
}

function binaryOperator(kind){
    return {
        type: 'binary-operator',
        kind
    }
}

function makeExpression(left, right, operator){
    return result = {
        type: 'expression',
        left, right, operator
    };
}

function parenExpression(left, right, operator){
    let result = expression(left, right, operator);
    result.parens = true;
    return result;
}
