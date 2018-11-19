const expect = require('chai').expect;

const { parse, match } = require('../index');

describe('match', function() {
    it ('match "hello"', function(){
        let node = parse('hello');
        expect(match(node, 'hello')).to.be.true;
        expect(match(node, 'hello world')).to.be.true;
        expect(match(node, 'world hello')).to.be.true;
        expect(match(node, 'world')).to.be.false;
    });
    it ('match "NOT hello"', function(){
        let node = parse('NOT hello');
        expect(match(node, 'hello')).to.be.false;
        expect(match(node, 'hello world')).to.be.false;
        expect(match(node, 'world hello')).to.be.false;
        expect(match(node, 'world')).to.be.true;
    });
    it ('match "NOT (hello)"', function(){
        let node = parse('NOT (hello)');
        expect(match(node, 'hello')).to.be.false;
        expect(match(node, 'hello world')).to.be.false;
        expect(match(node, 'world hello')).to.be.false;
        expect(match(node, 'world')).to.be.true;
    });
    it ('match "NOT NOT hello"', function(){
        let node = parse('NOT NOT hello');
        expect(match(node, 'hello')).to.be.true;
        expect(match(node, 'hello world')).to.be.true;
        expect(match(node, 'world hello')).to.be.true;
        expect(match(node, 'world')).to.be.false;
    });
    it ('match "hello  AND  world"', function(){
        let node = parse('hello  AND  world');
        expect(match(node, 'world')).to.be.false;
        expect(match(node, 'hello')).to.be.false;
        expect(match(node, 'hello world')).to.be.true;
        expect(match(node, 'world hello')).to.be.true;
        expect(match(node, 'world bar hello')).to.be.true;
    });
    it ('match "hello  OR  world"', function(){
        let node = parse('hello  OR  world');
        expect(match(node, 'world')).to.be.true;
        expect(match(node, 'hello')).to.be.true;
        expect(match(node, 'hello world')).to.be.true;
        expect(match(node, 'world hello')).to.be.true;
        expect(match(node, 'world bar hello')).to.be.true;
        expect(match(node, 'bar')).to.be.false;
    });
    it ('match "(hello  OR  world) AND (bar OR baz)"', function(){
        let node = parse('(hello  OR  world) AND (bar OR baz)');
        expect(match(node, 'world')).to.be.false;
        expect(match(node, 'hello')).to.be.false;
        expect(match(node, 'hello world')).to.be.false;
        expect(match(node, 'world hello')).to.be.false;
        expect(match(node, 'world bar hello')).to.be.true;
        expect(match(node, 'world baz')).to.be.true;
        expect(match(node, 'hello baz')).to.be.true;
        expect(match(node, 'hello bar')).to.be.true;
    });
    it ('match "foo OR bar OR baz"', function(){
        let node = parse('foo OR bar OR baz');
        expect(match(node, 'foo world')).to.be.true;
        expect(match(node, 'bar hello')).to.be.true;
        expect(match(node, 'hello world baz')).to.be.true;
        expect(match(node, 'world hello')).to.be.false;
    });
    it ('match "foo OR bar AND NOT baz"', function(){
        let node = parse('foo OR bar AND NOT baz');
        expect(match(node, 'foo world')).to.be.true;
        expect(match(node, 'bar hello')).to.be.true;
        expect(match(node, 'hello world baz')).to.be.false;
    });
});