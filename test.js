const expect = require('chai').expect;

const { parse } = require('./parser');

expect(parse('')).to.be.null;

expect(parse('()')).to.be.null;

expect(parse('(())')).to.be.null;



describe('parser', function(){
    // it ('fails', function(){
    //     expect(parse('')).to.be.null;
    //     expect(parse('()')).to.be.null;
    //     expect(parse('(())')).to.be.null;
    // });
    // it ('parses text', function(){
    //     let node = parse('1');
    //     expect(node.left.type).to.equal('text');
    //     expect(node.left.val).to.equal('1');
    //     expect(node.length).to.equal(1);
    // });
    it ('parses "NOT 1"', function(){
        let node = parse('NOT 1');
        expect(node.left.type).to.equal('expression');
        expect(node.left.left.type).to.equal('text');
        expect(node.left.left.val).to.equal('1');
        expect(node.right).to.equal(null);
        expect(node.operator).to.not.be.null;
        expect(node.operator.type).to.equal('not-operator');
        expect(node.length).to.equal(5);
    })
    it ('parses "NOT (1)"', function(){
        let node = parse('NOT (1)');
        console.log(JSON.stringify(node))
        expect(node.left.type).to.equal('expression');
        expect(node.left.parens).to.equal(true);
        expect(node.left.left.type).to.equal('text');
        expect(node.left.left.val).to.equal('1');
        expect(node.right).to.equal(null);
        expect(node.operator).to.not.be.null;
        expect(node.operator.type).to.equal('not-operator');
        expect(node.length).to.equal(7);  
    });
    it ('parses "NOT (NOT (1))"', function(){
        let node = parse('NOT (NOT (1))');
        console.log(JSON.stringify(node))
        expect(node.left.type).to.equal('expression');
        expect(node.left.parens).to.equal(true);
        expect(node.left.left.left.type).to.equal('text');
        expect(node.left.left.left.val).to.equal('1');
        expect(node.right).to.equal(null);
        expect(node.operator).to.not.be.null;
        expect(node.operator.type).to.equal('not-operator');
        expect(node.length).to.equal(13);  
    })
    it ('parses "hello"', function(){
        let node = parse('hello');
        expect(node.left.type).to.equal('text');
        expect(node.left.val).to.equal('hello');
        expect(node.length).to.equal(5);
    })
    it ('parses "NOT hello"', function(){
        let node = parse('NOT hello');
        console.log(JSON.stringify(node))
        expect(node.left.type).to.equal('expression');
        expect(node.left.val).to.equal('hello');
        expect(node.length).to.equal(9);
    })
})