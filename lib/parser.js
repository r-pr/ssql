const NOT_OPTOR_DEFAULT = 'NOT';
const AND_OPTOR_DEFAULT = 'AND';
const OR_OPTOR_DEFAULT = 'OR';

var NOT_OPTOR = 'NOT';
var AND_OPTOR = 'AND';
var OR_OPTOR = 'OR';

function log(){
    if (false){
        console.log.apply(null, arguments);
    }
    
}

// return length of whitespace
function whitespace(str){
    if (str.length === 0){
        return 0;
    }
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

function tryParseBinaryOperator(str){
    log('try parse binary optor: ' + str);
    if (hasPrefix(str, AND_OPTOR + ' ')){
        let result = makeBinaryOperator(AND_OPTOR_DEFAULT);
        result.length = AND_OPTOR.length;
        log('ret ' + JSON.stringify(result));
        return result;
    } else if (hasPrefix(str, OR_OPTOR + ' ')){
        let result = makeBinaryOperator(OR_OPTOR_DEFAULT);
        result.length = OR_OPTOR.length;
        log('ret ' + JSON.stringify(result));
        return result;
    } else {
        log('ret null');
        return null;
    }
}

function tryParseExpression(str){
    if (str === ''){
        return null;
    }
    let offset = whitespace(str);
    if (offset === str.length - 1 && str.length > 1){
        return null;
    }
    log('offset: ' + offset);
    log('char=' + str[offset]);
    str = str.slice(offset);
    let expression;
    if (str[0] === '('){
        offset++;
        str = str.slice(1);
        expression = tryParseExpression(str);
        if (!expression){
            log('( => ret null 1');
            return null;
        }
        log('( => got expression ' + JSON.stringify(expression));
        log('str before ' + str);
        str = str.slice( 0 + expression.length);
        log('str after ' + str);
        if (str === ''){
            log('( => ret null 2');
            return null;
        }
        let wsAfter = whitespace(str);
        log('str len ' + str.length);
        log('wsafter' + wsAfter);
        if (wsAfter === str.length && wsAfter > 0){
            log('( => ret null 3');
            return null;
        }
        if (str[wsAfter] !== ')'){
            log('( => ret null 4');
            return null;
        }
        expression.parens = true;
        expression.length = offset + expression.length + wsAfter + 1;
        log('paren expr: ' + JSON.stringify(expression));
        log('paren exp st before slice: ' + str);
        str = str.slice(1); //убираем ')'
        log('paren exp st after slice: ' + str);
    } else if (hasPrefix(str, NOT_OPTOR)){
        offset += NOT_OPTOR.length;
        str = str.slice(NOT_OPTOR.length);
        let wsAfter = whitespace(str);
        if (wsAfter === 0){
            // после NOT должен идти минимум 1 пробел
            return null;
        }
        offset += wsAfter;
        str = str.slice(wsAfter);
        let childExpression = tryParseExpression(str);
        if (!childExpression){
            return null;
        }
        expression = makeExpression(null, childExpression, notOperator());
        expression.length = offset + childExpression.length;
    } else {
        let text = tryParseText(str);
        if (text === null){
            return null;
        } 
        str = str.slice(text.length);
        expression = makeExpression(null, makeText(text), null);
        expression.length = offset + text.length;
    }

    let ws1 = whitespace(str);
    offset += ws1;
    str = str.slice(ws1);
    let binaryOperator = tryParseBinaryOperator(str);
    if (binaryOperator === null){
        log('binaryOperator is null, ret ' + JSON.stringify(expression));
        return expression;
    }
    str = str.slice(binaryOperator.length);
    log('got bin optor' + binaryOperator.kind);
    let ws2 = whitespace(str);
    offset += ws2;
    str = str.slice(ws2);
    let nextExpression = tryParseExpression(str);
    if (nextExpression === null){
        log('next expr after bin op is null. str=' + str);
        return null;
    }
    log('got next expr after bin op: ' + JSON.stringify(nextExpression));
    let resultExpression = makeExpression(
        expression, 
        nextExpression, 
        binaryOperator
    );
    log(`resultExpression.length = ${offset} + ${expression.length} + ${nextExpression.length} + ${binaryOperator.length};`);
    resultExpression.length = ws1 + ws2 + expression.length + nextExpression.length + binaryOperator.length;
    return resultExpression; 
    
}

//module.exports.parse = tryParseExpression;

module.exports.parse = function(str, options){
    str = '' + str;
    let opts = options || {};
    AND_OPTOR = opts.and || AND_OPTOR_DEFAULT;
    OR_OPTOR = opts.or || OR_OPTOR_DEFAULT;
    NOT_OPTOR = opts.not || NOT_OPTOR_DEFAULT;
    return tryParseExpression(str);
};

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

function makeBinaryOperator(kind){
    return {
        type: 'binary-operator',
        kind
    };
}

function makeExpression(left, right, operator){
    return {
        type: 'expression',
        right, left, operator
    };
}
