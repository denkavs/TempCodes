/// <reference path="js/jasmine.js" />
/// <reference path="js/jasmine-html.js" />

describe('Patterns ->', function () {

    afterEach(function () {
        var actual = 6;
        var expt = 6;
        expect(actual).toEqual(expt);
    });

    describe('-- Scope chain', function () {
        it('/ way 1', function () {

            var counterArray = {
                A: 3,
                B: 4
            };
            counterArray["C"] = 1;
            console.log(Object.keys(counterArray).length);

            function foo1() { };
            var one = new foo1();
            console.log(typeof (one));
            console.log(one instanceof foo1);

            function foo() {
                return foo;
            }
            var bar = new foo();
            console.log(typeof (bar));
            console.log(bar instanceof foo);

            var arrayList = [1, 3, 5, 6];
            console.log(typeof (arrayList));
            console.log(Object.prototype.toString.call(arrayList));
            var output = (function (x) {
                delete x;
                return x;
            })(0);

            console.log(output);
            console.log(typeof (output));
        });
    });

    describe('-- Inheritance', function () {
        function Parent() {
            this.name = 6;
        };

        Parent.prototype.getName = function () {
            return this.name;
        };

        function Child() {
            Parent.apply(this, arguments);
            this.secondName = 'Tom';
        };

        var inherite = (function () {

            var F = function () { };
            return function (P, C) {
                F.prototype = P.prototype;
                C.prototype = new F;
                C.uber = P.prototype;
                C.prototype.constructor = C;
            };
        }());

        inherite(Parent, Child);

        Child.prototype.getSecName = function () {
            return this.secondName;
        };

        it('/Way ', function () {
            var p = new Parent();
            console.log(p.getName())
            var c = new Child();
            console.log(c.getName() + '__' + c.getSecName());
        });

    });

    describe('-- Facade', function () {
        function createComplexObject () {
            var name = "";
            var secondName = '';
            var age = '';
            return {
                setName: function (data) { name = data; },
                getName: function () { return name; },
                setSecondName : function(data){ secondName = data;},
                getSecondName: function () { return secondName; },
                setAge : function(data){ age = data;},
                getAge: function () { return age;}
            };
        };

        function facade(data) {
            var inst;
            if (data === undefined) {
                inst = createComplexObject();
            }
            else {
                inst = data;
            }
            return {
                printFullName: function () { return inst.getName() + '_' + inst.getSecondName(); },
                putInputData: function (name, secondName, age) { inst.setName(name), inst.setSecondName(secondName), inst.setAge(age); },
                combineAllInfo: function(){ var info; info = inst.getName() + '_' + inst.getSecondName() + '====' + inst.getAge();  return info; }
            };
        };

        var complexInst = createComplexObject();
        var facade = facade(complexInst);
        facade.putInputData('Ivan', 'Sirco', 34);
        console.log(facade.combineAllInfo());
    });

    describe('-- Strategy', function () {
        it('/Way 1: ', function () {
            var data = {
                first_name: "Super",
                last_name: "Man",
                age: "unknown",
                username: "o_O"
            };
            var validator = {
                // all available checks
                types: {},
                // error messages in the current
                // validation session
                messages: [],
                // current validation config
                // name: validation type
                config: {},
                // the interface method
                // `data` is key => value pairs
                validate: function (data) {
                    var i, msg, type, checker, result_ok;
                    // reset all messages
                    this.messages = [];
                    for (i in data) {
                        if (data.hasOwnProperty(i)) {
                            type = this.config[i];
                            checker = this.types[type];
                            if (!type) {
                                continue; // no need to validate
                            }
                            if (!checker) { // uh-oh
                                throw {
                                    name: "ValidationError",
                                    message: "No handler to validate type " + type
                                };
                            }
                            result_ok = checker.validate(data[i]);
                            if (!result_ok) {
                                msg = "Invalid value for *" + i + "*, " + checker.instructions;
                                this.messages.push(msg);
                            }
                        }
                    }
                    return this.hasErrors();
                },
                // helper
                hasErrors: function () {
                    return this.messages.length !== 0;
                }
            };

            // checks for non-empty values
            validator.types.isNonEmpty = {
                validate: function (value) {
                    return value !== "";
                },
                instructions: "the value cannot be empty"
            };
            // checks if a value is a number
            validator.types.isNumber = {
                validate: function (value) {
                    return !isNaN(value);
                },
                instructions: "the value can only be a valid number, e.g. 1, 3.14 or 2010"
            };
            // checks if the value contains only letters and numbers
            validator.types.isAlphaNum = {
                validate: function (value) {
                    return !/[^a-z0-9]/i.test(value);
                },
                instructions: "the value can only contain characters and numbers, no special symbols"
            };

            validator.config = {
                first_name: 'isNonEmpty',
                age: 'isNumber',
                username: 'isAlphaNum'
            };

            validator.validate(data);
            if (validator.hasErrors()) {
                console.log(validator.messages.join("\n"));
            }
        });
    });

    describe('-- Decorator', function () {
        it('/Way 2: Implementation via list.', function () {

            function Sale(price) {
                this.price = (price > 0) ? price: 100;
                this.decorators_list = [];
            };

            Sale.prototype.decorate = function (decorator) {
                this.decorators_list.push(decorator);
            };

            Sale.decorators = {};
            Sale.decorators.fedtax = {
                getPrice: function (price) {
                    return price + price * 5 / 100;
                }
            };
            Sale.decorators.quebec = {
                getPrice: function (price) {
                    return price + price * 7.5 / 100;
                }
            };
            Sale.decorators.money = {
                getPrice: function (price) {
                    return "$" + price.toFixed(2);
                }
            };

            Sale.prototype.getPrice = function () {
                var price = this.price,
                i,
                max = this.decorators_list.length,
                name;
                for (i = 0; i < max; i += 1) {
                    name = this.decorators_list[i];
                    price = Sale.decorators[name].getPrice(price);
                }
                return price;
            };

            var sale = new Sale(120); // the price is 100 dollars
            sale.decorate('fedtax'); // add federal tax
            sale.decorate('quebec'); // add provincial tax
            sale.decorate('money'); // format like money
            var price = sale.getPrice(); // "$112.88"
        });

        it('/Way 1: Implementation via prototype inheritance.', function () {

            function Sale(price) {
                this.price = price || 100;
            }

            Sale.prototype.getPrice = function () {
                return this.price;
            };

            Sale.decorators = {};

            Sale.decorators.fedtax = {
                getPrice: function () {
                    var price = this.uber.getPrice();
                    price += price * 5 / 100;
                    return price;
                }
            };

            Sale.decorators.money = {
                getPrice: function () {
                    return "$" + this.uber.getPrice().toFixed(2);
                }
            };

            Sale.decorators.cdn = {
                getPrice: function () {
                    return "CDN$ " + this.uber.getPrice().toFixed(2);
                }
            };

            Sale.prototype.decorate = function (decorator) {
                var F = function () {},
                overrides = this.constructor.decorators[decorator],
                i, newobj;

                F.prototype = this;
                newobj = new F();
                newobj.uber = F.prototype;
                for (i in overrides) {
                    if (overrides.hasOwnProperty(i)) {
                        newobj[i] = overrides[i];
                    }
                }

                return newobj;
            };

            var sale = new Sale(110); // the price is 100 dollars
            sale = sale.decorate('fedtax'); // add federal tax
            sale = sale.decorate('quebec'); // add provincial tax
            sale = sale.decorate('money'); // format like money
            var price = sale.getPrice(); // "$112.88"
            console.log(price);
        });
    });

    describe('-- Iterator', function () {
        it('/Way 1:', function () {

            var agg = (function () {
                var index = 0,
                data = [1, 2, 3, 4, 5],
                length = data.length;
                return {
                    next: function () {
                        var element;
                        if (!this.hasNext()) {
                            return null;
                        }
                        element = data[index];
                        index = index + 2;
                        return element;
                    },
                    hasNext: function () {
                        return index < length;
                    }
                }
            })();

            var element;
            while (element = agg.next()) {
                // do something with the element ...
                console.log(element);
            }
        });
    });

    describe('-- Factory', function () {
        it('/ Way 1:', function () {

            function CarMaker() { }
            CarMaker.prototype.drive = function () {
                return "Vroom, I have " + this.doors + " doors";
            };

            // the static factory method
            CarMaker.factory = function (type) {
                var constr = type, newcar;

                // error if the constructor doesn't exist
                if (typeof CarMaker[constr] !== "function") {
                    throw {
                        name: "Error",
                        message: constr + " doesn't exist"
                    };
                }
                // at this point the constructor is known to exist
                // let's have it inherit the parent but only once
                if (typeof CarMaker[constr].prototype.drive !== "function") {
                    CarMaker[constr].prototype = new CarMaker();
                }

                // create a new instance
                newcar = new CarMaker[constr]();
                // optionally call some methods and then return...
                return newcar;
            };

            // define specific car makers
            CarMaker.Compact = function () {
                this.doors = 4;
            };
            CarMaker.Convertible = function () {
                this.doors = 2;
            };
            CarMaker.SUV = function () {
                this.doors = 24;
            };

            var corolla = CarMaker.factory('Compact');
            var solstice = CarMaker.factory('Convertible');
            var cherokee = CarMaker.factory('SUV');
            corolla.drive(); // "Vroom, I have 4 doors"
            solstice.drive(); // "Vroom, I have 2 doors"
            cherokee.drive(); // "Vroom, I have 17 doors"

        });
    });

    describe('-- Singleton pattern', function () {
        it('/ Way 1: Static property', function () {

            function Universe() {
                // do we have an existing instance?
                if (typeof Universe.instance === "object") {
                    return Universe.instance;
                }
                // proceed as normal
                this.start_time = 0;
                this.bang = "Big";
                // cache
                Universe.instance = this;
                // implicit return:
                // return this;
            }

            var uni1 = new Universe();
            var uni2 = new Universe();

            expect(true).toEqual(uni1 === uni2);
        });

        it('/ Way 2: Instance in a closure', function () {

            function Universe() {
                // the cached instance
                var instance = this;
                // proceed as normal
                this.start_time = 0;
                this.bang = "Big";
                // rewrite the constructor
                Universe = function () {
                    return instance;
                };
            }

            var uni1 = new Universe();
            var uni2 = new Universe();
            

            expect(uni1).toEqual(uni2);
            expect(true).toEqual(uni1 === uni2);
        });

        it('/ Way 3: Instance with right prototype.', function () {

            function Universe() {
                // the cached instance
                var instance;
                // rewrite the constructor
                Universe = function () {
                    return instance;
                };
                // carry over the prototype properties
                Universe.prototype = this;
                // the instance
                instance = new Universe();
                // reset the constructor pointer
                instance.constructor = Universe;
                // all the functionality
                instance.start_time = 0;
                instance.bang = "Big";
                return instance;
            }

            var uni1 = new Universe();
            var uni2 = new Universe();


            expect(uni1).toEqual(uni2);
            expect(true).toEqual(uni1 === uni2);
        });

        it('/ Way 4: Immadiate function is used', function () {
            var Universe;
            (function () {
                var instance;
                Universe = function Universe() {
                    if (instance) {
                        return instance;
                    }
                    instance = this;
                    // all the functionality
                    this.start_time = 0;
                    this.bang = "Big";
                };
            }());

            var uni1 = new Universe();
            var uni2 = new Universe();

            expect(true).toEqual(uni1 === uni2);
        });
    });
});
