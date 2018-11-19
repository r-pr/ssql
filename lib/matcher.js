function match(node, string){
    string = string.toLowerCase();
    if (node.type === 'text'){
        return string.indexOf(node.val.toLowerCase()) !== -1;
    }
    if (node.operator === null){
        return match(node.right, string);
    }
    if (node.operator.type === 'not-operator'){
        return !match(node.right, string);
    }
    if (node.operator.kind === 'AND'){
        return match(node.left, string) && match(node.right, string);
    } else if (node.operator.kind === 'OR'){
        return match(node.right, string) || match(node.left, string);
    }
    throw new Error('cannot match ' + JSON.stringify(node));
}

module.exports.match = match;