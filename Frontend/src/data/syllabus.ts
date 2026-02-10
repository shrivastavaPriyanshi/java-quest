export interface Topic {
    id: string;
    title: string;
    content: string;
}

export interface Module {
    id: string;
    title: string;
    topics: Topic[];
}

export const SYLLABUS: Module[] = [
    {
        id: "module-1",
        title: "Module 1: Java Basics",
        topics: [
            {
                id: "intro",
                title: "Introduction to Java",
                content: `
# Introduction to Java

Java is a high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.

## Key Features
- **Object-Oriented**: Everything in Java is an Object.
- **Platform Independent**: Write Once, Run Anywhere (WORA).
- **Simple**: Java is designed to be easy to learn.
- **Secure**: Java provides a secure environment for developing applications.

## Hello World
\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`
                `
            },
            {
                id: "variables",
                title: "Variables & Data Types",
                content: `
# Variables and Data Types

Variables are containers for storing data values.

## Primitive Data Types
- **int**: Stores integers (whole numbers), without decimals, such as 123 or -123.
- **double**: Stores floating point numbers, with decimals, such as 19.99 or -19.99.
- **char**: Stores single characters, such as 'a' or 'B'. Char values are surrounded by single quotes.
- **boolean**: Stores values with two states: true or false.
- **byte**: Stores whole numbers from -128 to 127.
- **short**: Stores whole numbers from -32,768 to 32,767.
- **long**: Stores whole numbers from -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807.
- **float**: Stores fractional numbers. Sufficient for storing 6 to 7 decimal digits.

## Syntax
\`\`\`java
int myNum = 5;
float myFloatNum = 5.99f;
char myLetter = 'D';
boolean myBool = true;
String myText = "Hello";
\`\`\`
                `
            }
        ]
    },
    {
        id: "module-2",
        title: "Module 2: Object Oriented Programming",
        topics: [
            {
                id: "classes-objects",
                title: "Classes and Objects",
                content: `
# Classes and Objects

Everything in Java is associated with classes and objects, along with its attributes and methods.

## Class
A class is a blueprint for creating objects (a particular data structure).

## Object
An object is an instance of a class.

## Example
\`\`\`java
public class Dog {
    String breed;
    int age;
    String color;

    void barking() {
    }

    void hungry() {
    }

    void sleeping() {
    }
}
\`\`\`
                `
            },
            {
                id: "inheritance",
                title: "Inheritance",
                content: `
# Inheritance

Inheritance can be defined as the process where one class acquires the properties components) of another.

## Key Terms
- **Super Class**: The class whose features are inherited is known as super class (or a base class or a parent class).
- **Sub Class**: The class that inherits the other class is known as sub class (or a derived class, extended class, or child class).

## Syntax
\`\`\`java
class Subclass-name extends Superclass-name
{
   //methods and fields
}
\`\`\`
                `
            }
        ]
    }
];
