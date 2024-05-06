interface Person {
    name: string;
    age: number;
}
// 接口可以继承另一个接口，关键词是 extends
interface Employee extends Person {
    salary: number;
}
let person: Employee = {
    name: "John",
    age: 30,
    salary: 50000
};
// 接口可以被类实现，注意，实现的关键字是 implements
class Developer implements Employee {
    name: string;
    age: number;
    salary: number;
}
let dev: Developer = new Developer();