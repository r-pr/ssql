const expect = require('chai').expect;

const { parse, match } = require('../index');

const opts = {
    and: 'и',
    or: 'или',
    not: 'не'
}

describe('match', function() {
    it ('match "hello"', function(){
        let node = parse('hello', opts);
        expect(match(node, 'hello')).to.be.true;
        expect(match(node, 'hello world')).to.be.true;
        expect(match(node, 'world hello')).to.be.true;
        expect(match(node, 'world')).to.be.false;
    });
    it ('match "не hello"', function(){
        let node = parse('не hello', opts);
        expect(match(node, 'hello')).to.be.false;
        expect(match(node, 'hello world')).to.be.false;
        expect(match(node, 'world hello')).to.be.false;
        expect(match(node, 'world')).to.be.true;
    });
    it ('match "не (hello)"', function(){
        let node = parse('не (hello)', opts);
        expect(match(node, 'hello')).to.be.false;
        expect(match(node, 'hello world')).to.be.false;
        expect(match(node, 'world hello')).to.be.false;
        expect(match(node, 'world')).to.be.true;
    });
    it ('match "не не hello"', function(){
        let node = parse('не не hello', opts);
        expect(match(node, 'hello')).to.be.true;
        expect(match(node, 'hello world')).to.be.true;
        expect(match(node, 'world hello')).to.be.true;
        expect(match(node, 'world')).to.be.false;
    });
    it ('match "hello  и  world"', function(){
        let node = parse('hello  и  world', opts);
        expect(match(node, 'world')).to.be.false;
        expect(match(node, 'hello')).to.be.false;
        expect(match(node, 'hello world')).to.be.true;
        expect(match(node, 'world hello')).to.be.true;
        expect(match(node, 'world bar hello')).to.be.true;
    });
    it ('match "hello  или  world"', function(){
        let node = parse('hello  или  world', opts);
        expect(match(node, 'world')).to.be.true;
        expect(match(node, 'hello')).to.be.true;
        expect(match(node, 'hello world')).to.be.true;
        expect(match(node, 'world hello')).to.be.true;
        expect(match(node, 'world bar hello')).to.be.true;
        expect(match(node, 'bar')).to.be.false;
    });
    it ('match "(hello  или  world) и (bar или baz)"', function(){
        let node = parse('(hello  или  world) и (bar или baz)', opts);
        expect(match(node, 'world')).to.be.false;
        expect(match(node, 'hello')).to.be.false;
        expect(match(node, 'hello world')).to.be.false;
        expect(match(node, 'world hello')).to.be.false;
        expect(match(node, 'world bar hello')).to.be.true;
        expect(match(node, 'world baz')).to.be.true;
        expect(match(node, 'hello baz')).to.be.true;
        expect(match(node, 'hello bar')).to.be.true;
    });
    it ('match "foo или bar или baz"', function(){
        let node = parse('foo или bar или baz', opts);
        expect(match(node, 'foo world')).to.be.true;
        expect(match(node, 'bar hello')).to.be.true;
        expect(match(node, 'hello world baz')).to.be.true;
        expect(match(node, 'world hello')).to.be.false;
    });
    it ('match "foo или bar и не baz"', function(){
        let node = parse('foo или bar и не baz', opts);
        expect(match(node, 'foo world')).to.be.true;
        expect(match(node, 'bar hello')).to.be.true;
        expect(match(node, 'hello world baz')).to.be.false;
    });
});