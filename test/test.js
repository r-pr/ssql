const expect = require('chai').expect;

const { parse } = require('../parser');

describe('parser', function() {
    it ('fails', function(){
        expect(parse('')).to.be.null;
        expect(parse('()')).to.be.null;
        expect(parse('(())')).to.be.null;
    });
    it ('parses text', function(){
        let node = parse('1');
        expect(node.right.type).to.equal('text');
        expect(node.right.val).to.equal('1');
        expect(node.length).to.equal(1);
    });
    it ('parses "NOT  1"', function(){
        let node = parse('NOT  1');
        expect(node.right.type).to.equal('expression');
        expect(node.right.right.type).to.equal('text');
        expect(node.right.right.val).to.equal('1');
        expect(node.left).to.equal(null);
        expect(node.operator).to.not.be.null;
        expect(node.operator.type).to.equal('not-operator');
        expect(node.length).to.equal(6);
    });
    it ('parses "NOT (1)"', function(){
        let node = parse('NOT (1)');
        expect(node.right.type).to.equal('expression');
        expect(node.right.parens).to.equal(true);
        expect(node.right.right.type).to.equal('text');
        expect(node.right.right.val).to.equal('1');
        expect(node.left).to.equal(null);
        expect(node.operator).to.not.be.null;
        expect(node.operator.type).to.equal('not-operator');
        expect(node.length).to.equal(7);  
    });
    it ('parses "NOT (NOT (1))"', function(){
        let node = parse('NOT (NOT (1))');
        expect(node.right.type).to.equal('expression');
        expect(node.right.parens).to.equal(true);
        expect(node.right.right.right.type).to.equal('text');
        expect(node.right.right.right.val).to.equal('1');

        expect(node.left).to.equal(null);
        expect(node.operator).to.not.be.null;
        expect(node.operator.type).to.equal('not-operator');
        expect(node.length).to.equal(13);  
    });
    it ('parses "hello"', function(){
        let node = parse('hello');
        expect(node.right.type).to.equal('text');
        expect(node.right.val).to.equal('hello');
        expect(node.length).to.equal(5);
    });
    it ('parses "NOT hello"', function(){
        let node = parse('NOT hello');
        expect(node.right.type).to.equal('expression');
        expect(node.right.right.type).to.equal('text');
        expect(node.right.right.val).to.equal('hello');
        expect(node.length).to.equal(9);
    });
    it ('parses "hello  AND  world"', function(){
        let node = parse('hello  AND  world');
        expect(node.right.type).to.equal('expression');
        expect(node.right.right.type).to.equal('text');
        expect(node.right.right.val).to.equal('world');
        expect(node.left.right.type).to.equal('text');
        expect(node.left.right.val).to.equal('hello');
        expect(node.operator.kind).to.equal('AND');
        expect(node.length).to.equal(17);
    });
    it ('parses "(hello AND world )"', function(){
        let node = parse('(hello AND world )');
        expect(node.right.type).to.equal('expression');
        expect(node.right.right.type).to.equal('text');
        expect(node.right.right.val).to.equal('world');
        expect(node.left.right.type).to.equal('text');
        expect(node.left.right.val).to.equal('hello');
        expect(node.operator.kind).to.equal('AND');
        expect(node.length).to.equal(18);
    });
    it('parses "NOT (hello AND world) OR NOT bye-bye"', function() {
        let node = parse('NOT ((hello AND world) OR NOT  bye-bye)');
        let result = {
            'type': 'expression',
            'right': {
                'type': 'expression',
                'right': {
                    'type': 'expression',
                    'right': {
                        'type': 'expression',
                        'right': {
                            'type': 'text',
                            'val': 'bye-bye'
                        },
                        'left': null,
                        'operator': null,
                        'length': 7
                    },
                    'left': null,
                    'operator': {
                        'type': 'not-operator'
                    },
                    'length': 12
                },
                'left': {
                    'type': 'expression',
                    'right': {
                        'type': 'expression',
                        'right': {
                            'type': 'text',
                            'val': 'world'
                        },
                        'left': null,
                        'operator': null,
                        'length': 5
                    },
                    'left': {
                        'type': 'expression',
                        'right': {
                            'type': 'text',
                            'val': 'hello'
                        },
                        'left': null,
                        'operator': null,
                        'length': 5
                    },
                    'operator': {
                        'type': 'binary-operator',
                        'kind': 'AND',
                        'length': 3
                    },
                    'length': 17,
                    'parens': true
                },
                'operator': {
                    'type': 'binary-operator',
                    'kind': 'OR',
                    'length': 2
                },
                'length': 35,
                'parens': true
            },
            'left': null,
            'operator': {
                'type': 'not-operator'
            },
            'length': 39
        };
        expect(node).to.deep.equal(result);
    });
});