import should from 'should'
import thee from '../thee'


describe("When using thee on a function", () => {
	const concatenate = thee( (a, b) => "" + a + b )
	it("`this` is rebound to the first parameter", () => 
		concatenate.call(3, 5).should.equal("35")
	)
})

describe("When using thee on an object", () => {
	const obj = thee({
		name: "Fred",
		sayHi: function(me, to) { return me.name + " says hi to " + to }
	});

	it("`this` on a method is rebound to the first parameter", () =>
		obj.sayHi("Barney").should.equal("Fred says hi to Barney")
	)
	it("does not affect properties", () =>
		obj.name.should.equal("Fred")
	)
})

describe("When using thee on a string", () => {
	it("leaves it alone", () =>
		thee("hi").should.equal("hi")	
	)
})

describe("This checking: When using thee on a function that references `this`", () => {
	const funcUsingThis = function(a) { return this + a; };
	beforeEach(() => thee.noThisCheck = false )

	it("throws an error", () =>
		should.throws(() => thee(funcUsingThis))
	)
	it("doesn't throw an error, when this checking disabled", () =>
		should.doesNotThrow(() => thee(funcUsingThis, { noThisCheck: true }) )
	)
	it("doesn't throw an error, when this checking disabled globally", () => {
		thee.noThisCheck = true;
		should.doesNotThrow(() => thee(funcUsingThis) );
	})
	it("does throw an error when this checking disabled globally but enabled locally", () => {
		thee.noThisCheck = true;
		should.throws(() => thee(funcUsingThis, { noThisCheck: false }) )
	})
})
