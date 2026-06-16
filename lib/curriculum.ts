export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type Lesson = {
  id: string;
  title: string;
  track: string;
  trackId: string;
  order: number;
  xp: number;
  duration: string;
  difficulty: Difficulty;
  theory: {
    heading: string;
    analogy: string;
    body: string;
    keyPoints: string[];
  };
  codeStarter: string;
  codeTask: string;
  language: "python" | "java" | "sql" | "typescript";
  quizTopic: string;
};

export const TRACKS = [
  { id: "python",   name: "Python",              icon: "🐍", color: "#3B82F6", desc: "The language of AI. Foundations to advanced." },
  { id: "java",     name: "Java",                icon: "☕", color: "#F97316", desc: "OOP, data structures, backend fundamentals." },
  { id: "sql",      name: "SQL & Databases",     icon: "🗄️", color: "#10B981", desc: "Query, join, aggregate — every backend uses SQL." },
  { id: "datascience", name: "Data Science",     icon: "📊", color: "#8B5CF6", desc: "Pandas, NumPy, stats, EDA, visualization." },
  { id: "ml",       name: "Machine Learning",    icon: "🧠", color: "#EC4899", desc: "Regression, classification, neural nets, sklearn." },
  { id: "dataeng",  name: "Data Engineering",    icon: "🔧", color: "#F59E0B", desc: "Pipelines, ETL, Spark, data warehousing." },
  { id: "ai",       name: "AI Engineering",      icon: "🤖", color: "#06B6D4", desc: "LLMs, RAG, embeddings, fine-tuning, deployment." },
  { id: "webai",    name: "Web & APIs for AI",   icon: "🌐", color: "#84CC16", desc: "FastAPI, REST, deploying ML models as APIs." },
];

export const CURRICULUM: Lesson[] = [

  // ══════════════════════════════════════════════
  // TRACK 1: PYTHON
  // ══════════════════════════════════════════════
  {
    id: "py-variables", title: "Variables & Data Types", track: "Python", trackId: "python",
    order: 1, xp: 50, duration: "8 min", difficulty: "Beginner",
    theory: {
      heading: "Variables: labelled boxes for your data",
      analogy: "A variable is like a labelled box in a warehouse. The label is the name, the box holds the value. Python figures out what type automatically — no need to declare it like in Java or C.",
      body: "Python has 4 core data types: int (whole numbers), float (decimals), str (text), bool (True/False). You'll use these every single day in AI, data science, and backend work. The type() function tells you what's inside any variable.",
      keyPoints: ["int: age = 21", "float: price = 99.5", "str: name = 'Ayatal'", "bool: active = True", "type(x) — check the type", "f-strings: f'Hello {name}'"],
    },
    codeStarter: `# Variables & Data Types
name = "Codevance"
age = 20
price = 499.99
is_student = True

print(f"Name: {name}")
print(f"Age: {age}")
print(f"Type of price: {type(price)}")
print(f"Is student: {is_student}")

# Type conversion
score = "95"
print(int(score) + 5)   # convert str to int`,
    codeTask: "Add a variable city = 'Prayagraj'. Print all variables using f-strings. Convert price to int and print it.",
    language: "python", quizTopic: "Python variables, int float str bool, type(), f-strings, type conversion",
  },
  {
    id: "py-lists", title: "Lists & Loops", track: "Python", trackId: "python",
    order: 2, xp: 60, duration: "10 min", difficulty: "Beginner",
    theory: {
      heading: "Lists: ordered, mutable collections",
      analogy: "A list is like a shopping cart — ordered, holds anything, add or remove items freely. In AI work you'll store datasets, predictions, and results in lists constantly.",
      body: "Lists are Python's most used data structure. Zero-indexed. Mutable. Loops iterate over them elegantly. List comprehensions let you transform lists in one line — a Python superpower used everywhere in data science.",
      keyPoints: ["items = [1, 2, 3]", "items[0] — first item", "items[-1] — last item", "items.append(x) — add", "len(items) — length", "[x*2 for x in items] — list comprehension"],
    },
    codeStarter: `# Lists & Loops
products = ["Shirt", "Jeans", "Kurta", "Saree"]
prices = [299, 899, 599, 1299]

for name, price in zip(products, prices):
    print(f"{name}: ₹{price}")

# List comprehension — filter expensive items
expensive = [p for p in prices if p > 500]
print("Expensive:", expensive)

# List comprehension — transform
discounted = [p * 0.9 for p in prices]
print("After 10% off:", discounted)`,
    codeTask: "Add 2 more products and prices. Use a list comprehension to create a list of product names that cost over ₹600.",
    language: "python", quizTopic: "Python lists, indexing, append, len, for loops, zip, list comprehensions",
  },
  {
    id: "py-functions", title: "Functions & Scope", track: "Python", trackId: "python",
    order: 3, xp: 70, duration: "12 min", difficulty: "Beginner",
    theory: {
      heading: "Functions: reusable, testable blocks of logic",
      analogy: "A function is like a vending machine — input goes in, processing happens inside, output comes out. You don't care how it works inside. That's encapsulation.",
      body: "Functions are the building blocks of all software. In AI engineering you'll write functions to preprocess data, call APIs, parse responses, and transform results. Default arguments and *args/**kwargs make Python functions extremely flexible.",
      keyPoints: ["def name(params):", "return value", "Default: def f(x=10)", "*args — variable positional args", "**kwargs — variable keyword args", "Scope: variables inside stay inside"],
    },
    codeStarter: `# Functions
def calculate_discount(price, percent=10):
    return price - (price * percent / 100)

print(calculate_discount(1000))       # 900.0
print(calculate_discount(1000, 25))   # 750.0

# *args example
def total(*prices):
    return sum(prices)

print(total(299, 899, 599))  # 1797

# **kwargs example
def describe_product(**kwargs):
    for key, val in kwargs.items():
        print(f"{key}: {val}")

describe_product(name="Shirt", price=299, stock=50)`,
    codeTask: "Write apply_gst(price, gst=18) that returns price + GST. Then write a function biggest(*nums) that returns the largest number.",
    language: "python", quizTopic: "Python functions, def, return, default args, *args, **kwargs, scope",
  },
  {
    id: "py-dicts", title: "Dictionaries & Sets", track: "Python", trackId: "python",
    order: 4, xp: 70, duration: "10 min", difficulty: "Beginner",
    theory: {
      heading: "Dicts: the hashmap — O(1) lookup",
      analogy: "A dictionary is like a filing cabinet with labelled folders. You don't search every folder — you go straight to the right label. That's why dict lookup is instant (O(1)) regardless of size.",
      body: "Dicts are everywhere in Python: JSON responses from APIs are dicts, database rows become dicts, ML model configs are dicts. Sets are like dicts with only keys — perfect for uniqueness checks and fast membership testing.",
      keyPoints: ["d = {'key': value}", "d['key'] — access", "d.get('key', default) — safe access", "d.keys(), d.values(), d.items()", "set() — unique items, O(1) lookup", "'key' in d — membership check"],
    },
    codeStarter: `# Dictionaries
user = {"name": "Ayatal", "age": 20, "role": "student"}
print(user["name"])
print(user.get("email", "no email"))  # safe get

# Update
user["city"] = "Prayagraj"

# Loop
for key, val in user.items():
    print(f"{key}: {val}")

# Frequency counter — classic pattern
words = ["ai", "python", "ai", "sql", "python", "ai"]
freq = {}
for w in words:
    freq[w] = freq.get(w, 0) + 1
print(freq)  # {'ai': 3, 'python': 2, 'sql': 1}

# Sets
skills = {"python", "sql", "python", "ai"}
print(skills)  # duplicates removed`,
    codeTask: "Write most_common(lst) that returns the most frequent item using a dict. Test it with a list of programming languages.",
    language: "python", quizTopic: "Python dicts, sets, get(), items(), keys(), values(), frequency counter pattern, O(1) lookup",
  },
  {
    id: "py-oop", title: "OOP — Classes & Objects", track: "Python", trackId: "python",
    order: 5, xp: 90, duration: "15 min", difficulty: "Intermediate",
    theory: {
      heading: "OOP: modeling the real world in code",
      analogy: "A class is a blueprint — like an architect's plan for a house. An object is the actual house built from that plan. You can build many houses from one blueprint, each with its own rooms and furniture.",
      body: "Object-Oriented Programming is fundamental to all serious Python development. In ML, every model (LinearRegression, RandomForest) is a class. In data engineering, pipelines are built from classes. Understanding __init__, self, inheritance, and methods is non-negotiable.",
      keyPoints: ["class Name:", "__init__(self, ...) — constructor", "self — reference to instance", "Methods = functions inside class", "Inheritance: class Child(Parent)", "super().__init__() — call parent"],
    },
    codeStarter: `# Classes & OOP
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age
        self.xp = 0
        self.completed = []

    def complete_lesson(self, lesson, xp):
        self.completed.append(lesson)
        self.xp += xp
        print(f"{self.name} completed '{lesson}' (+{xp} XP)")

    def progress(self):
        return f"{self.name}: {len(self.completed)} lessons, {self.xp} XP"

# Inheritance
class PremiumStudent(Student):
    def __init__(self, name, age, plan):
        super().__init__(name, age)
        self.plan = plan

    def progress(self):
        return super().progress() + f" [{self.plan}]"

s = Student("Ayatal", 20)
s.complete_lesson("Python Variables", 50)
s.complete_lesson("Lists & Loops", 60)
print(s.progress())

p = PremiumStudent("Rahul", 22, "Pro")
p.complete_lesson("ML Basics", 100)
print(p.progress())`,
    codeTask: "Add a method top_lesson() that returns the first completed lesson. Add a class attribute student_count that tracks how many students are created.",
    language: "python", quizTopic: "Python OOP, class, __init__, self, methods, inheritance, super(), class attributes vs instance attributes",
  },
  {
    id: "py-files-errors", title: "File I/O & Error Handling", track: "Python", trackId: "python",
    order: 6, xp: 80, duration: "12 min", difficulty: "Intermediate",
    theory: {
      heading: "Reading files and handling failures gracefully",
      analogy: "Error handling is like a safety net under a tightrope walker. The walker (your code) tries to do the job; the net (try/except) catches them if something goes wrong so the whole show doesn't stop.",
      body: "In real AI/data engineering work, you constantly read CSV files, JSON configs, and API responses — all of which can fail. try/except prevents crashes. with open() auto-closes files. JSON parsing is used in every API call you'll ever make.",
      keyPoints: ["try: ... except ExceptionType:", "finally: — always runs", "with open('file.csv') as f:", "f.read(), f.readlines()", "import json; json.loads(), json.dumps()", "raise Exception('message')"],
    },
    codeStarter: `import json

# Error handling
def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Cannot divide by zero"
    except TypeError as e:
        return f"Type error: {e}"
    finally:
        print("Division attempted")

print(safe_divide(10, 2))
print(safe_divide(10, 0))

# JSON — the format of every API response
data = {
    "model": "claude-sonnet-4-6",
    "temperature": 0.7,
    "tracks": ["python", "sql", "ml"]
}

# Convert to JSON string (for API calls)
json_str = json.dumps(data, indent=2)
print(json_str)

# Parse JSON string back to dict
parsed = json.loads(json_str)
print(parsed["tracks"])`,
    codeTask: "Write safe_parse_json(text) that tries to parse a JSON string and returns the dict, or returns None if it fails. Test with valid and invalid JSON.",
    language: "python", quizTopic: "Python try except finally, ZeroDivisionError, TypeError, with open, json.loads json.dumps, file reading",
  },

  // ══════════════════════════════════════════════
  // TRACK 2: JAVA
  // ══════════════════════════════════════════════
  {
    id: "java-basics", title: "Java Basics & Types", track: "Java", trackId: "java",
    order: 1, xp: 60, duration: "10 min", difficulty: "Beginner",
    theory: {
      heading: "Java: strongly typed, object-oriented, everywhere",
      analogy: "If Python is a flexible chef who improvises, Java is a precise surgeon who follows strict protocols. Java forces you to declare types upfront — more verbose, but harder to make mistakes.",
      body: "Java is used in Android, enterprise backends (Spring Boot), and big data tools (Hadoop, Spark). It's statically typed — you must declare variable types. Everything is inside a class. Java teaches you discipline that makes you a better programmer in any language.",
      keyPoints: ["int, double, boolean, String — primitive types", "String is a class, not primitive", "System.out.println() — print", "Everything lives inside a class", "public static void main(String[] args) — entry point", "Compiled language — faster than Python at runtime"],
    },
    codeStarter: `// Java Basics
public class Main {
    public static void main(String[] args) {
        // Primitive types
        int age = 20;
        double price = 499.99;
        boolean isStudent = true;
        String name = "Ayatal";

        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.printf("Price: %.2f%n", price);
        System.out.println("Student: " + isStudent);

        // Type casting
        int rounded = (int) price;
        System.out.println("Rounded price: " + rounded);

        // String methods
        System.out.println(name.toUpperCase());
        System.out.println(name.length());
    }
}`,
    codeTask: "Add variables for city (String) and gpa (double). Print all variables. Calculate and print gpa * 10 as an integer.",
    language: "java", quizTopic: "Java data types int double boolean String, System.out.println, printf, type casting, String methods, static void main",
  },
  {
    id: "java-oop", title: "Java OOP & Classes", track: "Java", trackId: "java",
    order: 2, xp: 90, duration: "15 min", difficulty: "Intermediate",
    theory: {
      heading: "OOP in Java: the foundation of enterprise software",
      analogy: "Java classes are like strict contracts. When you create a Student class, every student object MUST have the fields you declared. No improvising allowed — unlike Python's more relaxed approach.",
      body: "Java's OOP pillars: Encapsulation (private fields + getters/setters), Inheritance (extends), Polymorphism (same method, different behavior), Abstraction (interfaces/abstract classes). These are interview staples at every tech company.",
      keyPoints: ["private fields + public getters/setters", "extends — inheritance", "@Override — override parent method", "interface — contract a class must fulfill", "abstract class — partial implementation", "Constructor overloading"],
    },
    codeStarter: `// Java OOP
class Student {
    private String name;
    private int age;
    private int xp;

    // Constructor
    public Student(String name, int age) {
        this.name = name;
        this.age = age;
        this.xp = 0;
    }

    // Getters
    public String getName() { return name; }
    public int getXp() { return xp; }

    // Method
    public void earnXP(int amount) {
        this.xp += amount;
        System.out.println(name + " earned " + amount + " XP! Total: " + xp);
    }

    @Override
    public String toString() {
        return "Student{name=" + name + ", xp=" + xp + "}";
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student("Ayatal", 20);
        s.earnXP(50);
        s.earnXP(70);
        System.out.println(s);
    }
}`,
    codeTask: "Create a PremiumStudent class that extends Student, adds a plan field (String), and overrides toString() to include the plan.",
    language: "java", quizTopic: "Java classes, constructors, private public, getters setters, extends, @Override, toString, this keyword",
  },
  {
    id: "java-dsa", title: "Java Collections & DSA", track: "Java", trackId: "java",
    order: 3, xp: 100, duration: "15 min", difficulty: "Intermediate",
    theory: {
      heading: "Java Collections: Arrays, ArrayList, HashMap",
      analogy: "Java's collection framework is like a toolbox with specialised tools. ArrayList is a resizable array, HashMap is a dictionary, LinkedList is a chain. Pick the right tool for the right job.",
      body: "Java's Collections Framework is one of the most tested topics in tech interviews. ArrayList replaces arrays for most use cases. HashMap gives O(1) lookup. Understanding which collection to use — and why — is a core engineering skill.",
      keyPoints: ["ArrayList<Type> list = new ArrayList<>()", "list.add(), list.get(i), list.size()", "HashMap<K,V> map = new HashMap<>()", "map.put(k,v), map.get(k), map.containsKey(k)", "for (Type item : list) — enhanced for loop", "Collections.sort(list) — sort"],
    },
    codeStarter: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // ArrayList
        ArrayList<String> skills = new ArrayList<>();
        skills.add("Python");
        skills.add("SQL");
        skills.add("ML");
        System.out.println("Skills: " + skills);
        System.out.println("Size: " + skills.size());

        // HashMap
        HashMap<String, Integer> scores = new HashMap<>();
        scores.put("Python", 95);
        scores.put("SQL", 88);
        scores.put("ML", 72);

        for (Map.Entry<String, Integer> entry : scores.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }

        // Find highest score
        String best = Collections.max(scores.entrySet(),
            Map.Entry.comparingByValue()).getKey();
        System.out.println("Best subject: " + best);
    }
}`,
    codeTask: "Create a frequency counter: given an ArrayList of strings, use a HashMap to count how many times each appears. Print the result.",
    language: "java", quizTopic: "Java ArrayList, HashMap, Collections, Map.Entry, enhanced for loop, generics, Collections.sort max",
  },

  // ══════════════════════════════════════════════
  // TRACK 3: SQL
  // ══════════════════════════════════════════════
  {
    id: "sql-select", title: "SELECT & WHERE", track: "SQL & Databases", trackId: "sql",
    order: 1, xp: 50, duration: "8 min", difficulty: "Beginner",
    theory: {
      heading: "SQL: the language every database speaks",
      analogy: "A SQL table is a spreadsheet. SELECT picks which columns you see. WHERE filters which rows appear. Every backend, every ML pipeline, every dashboard runs SQL under the hood.",
      body: "SQL is declarative — you describe what you want, not how to get it. It's used in every data role: Data Scientist, Data Engineer, AI Engineer, Backend Developer. Even tools like Pandas have SQL-like operations inspired by SQL.",
      keyPoints: ["SELECT columns FROM table", "WHERE condition — filter rows", "SELECT * — all columns", "AND / OR — combine conditions", "LIKE '%text%' — pattern match", "ORDER BY col DESC — sort", "LIMIT n — top n rows"],
    },
    codeStarter: `-- SQL: SELECT & WHERE

-- Get everything
SELECT * FROM products;

-- Specific columns
SELECT name, price FROM products;

-- Filter
SELECT name, price FROM products
WHERE price < 500;

-- Multiple conditions
SELECT name, price FROM products
WHERE category = 'Electronics'
  AND price BETWEEN 1000 AND 50000
  AND stock > 0;

-- Pattern match
SELECT name FROM products
WHERE name LIKE '%Pro%';

-- Sort and limit
SELECT name, price FROM products
ORDER BY price DESC
LIMIT 5;`,
    codeTask: "Write a query to find the top 3 most expensive in-stock products, showing only name and price, sorted by price descending.",
    language: "sql", quizTopic: "SQL SELECT FROM WHERE AND OR LIKE BETWEEN ORDER BY LIMIT DESC ASC",
  },
  {
    id: "sql-joins", title: "JOINs & Aggregations", track: "SQL & Databases", trackId: "sql",
    order: 2, xp: 80, duration: "14 min", difficulty: "Intermediate",
    theory: {
      heading: "JOINs: connecting data across tables",
      analogy: "Imagine orders in one spreadsheet and products in another. A JOIN stitches them on a shared ID — like a super-powered VLOOKUP. GROUP BY + SUM/COUNT/AVG is how every analytics report is built.",
      body: "Normalization splits data across tables to avoid repetition. JOINs reconnect them. INNER JOIN returns only matching rows. LEFT JOIN keeps all left rows. GROUP BY + aggregates answer 'how much total' questions — the foundation of analytics.",
      keyPoints: ["INNER JOIN — only matching rows both sides", "LEFT JOIN — all left + matching right", "GROUP BY col — group then aggregate", "SUM(), COUNT(), AVG(), MAX(), MIN()", "HAVING — filter after GROUP BY", "Aliases: table AS t, column AS alias"],
    },
    codeStarter: `-- JOINs & Aggregations

-- Join orders with products
SELECT o.order_id, p.name, p.price, o.quantity,
       (p.price * o.quantity) AS line_total
FROM orders o
INNER JOIN products p ON o.product_id = p.product_id;

-- Revenue per product
SELECT p.name,
       SUM(p.price * o.quantity) AS revenue,
       COUNT(o.order_id) AS num_orders,
       AVG(o.quantity) AS avg_qty
FROM orders o
INNER JOIN products p ON o.product_id = p.product_id
GROUP BY p.name
ORDER BY revenue DESC;

-- Filter groups: products with >5 orders
SELECT p.name, COUNT(*) AS orders
FROM orders o
JOIN products p ON o.product_id = p.product_id
GROUP BY p.name
HAVING COUNT(*) > 5;`,
    codeTask: "Write a query to find the top 3 customers by total spend. Use JOIN between orders and users tables, GROUP BY, SUM, ORDER BY, LIMIT 3.",
    language: "sql", quizTopic: "SQL INNER JOIN LEFT JOIN GROUP BY SUM COUNT AVG HAVING aliases subqueries",
  },
  {
    id: "sql-advanced", title: "Subqueries, CTEs & Window Functions", track: "SQL & Databases", trackId: "sql",
    order: 3, xp: 100, duration: "18 min", difficulty: "Advanced",
    theory: {
      heading: "Advanced SQL: what separates good from great",
      analogy: "A subquery is a query inside a query — like asking your assistant to first make a list, then you work from that list. A CTE (WITH clause) is a named subquery that makes complex logic readable. Window functions let you calculate across rows without collapsing them.",
      body: "CTEs, subqueries, and window functions are what data engineers and analysts use daily for complex reporting. ROW_NUMBER(), RANK(), LAG(), LEAD() are window functions used in time-series analysis, cohort analysis, and ML feature engineering.",
      keyPoints: ["WITH cte AS (SELECT ...) SELECT * FROM cte", "Subquery: SELECT * FROM (SELECT ...) AS sub", "ROW_NUMBER() OVER (PARTITION BY col ORDER BY col)", "RANK() vs DENSE_RANK()", "LAG(col, 1) — previous row value", "LEAD(col, 1) — next row value"],
    },
    codeStarter: `-- Advanced SQL

-- CTE: readable multi-step query
WITH monthly_revenue AS (
    SELECT DATE_TRUNC('month', order_date) AS month,
           SUM(total) AS revenue
    FROM orders
    GROUP BY 1
),
ranked AS (
    SELECT month, revenue,
           RANK() OVER (ORDER BY revenue DESC) AS rank
    FROM monthly_revenue
)
SELECT * FROM ranked WHERE rank <= 3;

-- Window function: running total
SELECT order_date, total,
       SUM(total) OVER (ORDER BY order_date) AS running_total,
       AVG(total) OVER (ORDER BY order_date
           ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS rolling_7day_avg
FROM orders;

-- Row number per customer (latest order = 1)
SELECT user_id, order_date, total,
       ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY order_date DESC) AS rn
FROM orders;`,
    codeTask: "Write a CTE that finds each user's first-ever order, then joins it back to the orders table to show only those rows.",
    language: "sql", quizTopic: "SQL CTEs WITH clause, subqueries, ROW_NUMBER RANK DENSE_RANK, LAG LEAD, PARTITION BY, window functions",
  },

  // ══════════════════════════════════════════════
  // TRACK 4: DATA SCIENCE
  // ══════════════════════════════════════════════
  {
    id: "ds-numpy", title: "NumPy — Array Computing", track: "Data Science", trackId: "datascience",
    order: 1, xp: 80, duration: "12 min", difficulty: "Intermediate",
    theory: {
      heading: "NumPy: the foundation of all Python data science",
      analogy: "Python lists are like carrying items one by one. NumPy arrays are like a forklift — same concept, 100x faster because it operates on all items simultaneously using C under the hood.",
      body: "NumPy is the backbone of pandas, scikit-learn, TensorFlow, and PyTorch. Every ML model processes NumPy arrays internally. Understanding vectorized operations (no loops needed) is essential for writing efficient data science code.",
      keyPoints: ["np.array([1,2,3]) — create array", "arr.shape — dimensions", "arr.dtype — data type", "arr * 2 — vectorized (no loop!)", "np.mean(), np.std(), np.sum()", "arr[arr > 5] — boolean indexing", "np.zeros(), np.ones(), np.arange()"],
    },
    codeStarter: `import numpy as np

# Create arrays
arr = np.array([1, 2, 3, 4, 5])
matrix = np.array([[1, 2, 3], [4, 5, 6]])

print("Shape:", arr.shape)
print("Matrix shape:", matrix.shape)

# Vectorized ops (no loops needed!)
prices = np.array([299, 899, 599, 1299, 499])
print("Mean:", np.mean(prices))
print("Std:", np.std(prices))
print("Max:", np.max(prices))

# 10% discount on all — one line!
discounted = prices * 0.9
print("Discounted:", discounted)

# Boolean indexing
expensive = prices[prices > 600]
print("Expensive:", expensive)

# arange and reshape
grid = np.arange(12).reshape(3, 4)
print(grid)`,
    codeTask: "Create a numpy array of 20 random integers between 1-100 using np.random.randint(). Find the mean, median, and std. Filter values above the mean.",
    language: "python", quizTopic: "NumPy arrays, shape, dtype, vectorized operations, boolean indexing, np.mean std sum, reshape, arange, random",
  },
  {
    id: "ds-pandas", title: "Pandas — Data Manipulation", track: "Data Science", trackId: "datascience",
    order: 2, xp: 100, duration: "18 min", difficulty: "Intermediate",
    theory: {
      heading: "Pandas: Python's most important data tool",
      analogy: "Pandas is like Excel on steroids, controlled by code. A DataFrame is a table (rows and columns). You can filter, sort, group, merge, and transform millions of rows in milliseconds — all with clean, readable code.",
      body: "Pandas is used for Exploratory Data Analysis (EDA), feature engineering in ML, data cleaning in pipelines, and building reports. Every data scientist and AI engineer uses pandas daily. The DataFrame is the universal currency of data work.",
      keyPoints: ["pd.read_csv('file.csv') — load data", "df.head(), df.info(), df.describe()", "df['col'] — series", "df[df['col'] > x] — filter", "df.groupby('col').agg({'col2': 'sum'})", "df.merge(df2, on='id') — SQL JOIN", "df.fillna(0), df.dropna() — handle missing"],
    },
    codeStarter: `import pandas as pd
import numpy as np

# Create a DataFrame
data = {
    'name': ['Shirt', 'Jeans', 'Kurta', 'Saree', 'Jacket'],
    'category': ['Top', 'Bottom', 'Top', 'Ethnic', 'Top'],
    'price': [299, 899, 599, 1299, 1899],
    'stock': [50, 30, 45, 20, 15],
    'rating': [4.2, 4.5, 4.0, 4.8, 4.3]
}
df = pd.DataFrame(data)

print(df.head())
print(df.describe())

# Filter
expensive = df[df['price'] > 600]
print(expensive[['name', 'price']])

# Group by category
cat_stats = df.groupby('category').agg({
    'price': 'mean',
    'stock': 'sum',
    'rating': 'mean'
}).round(2)
print(cat_stats)

# Add computed column
df['revenue_potential'] = df['price'] * df['stock']
print(df[['name', 'revenue_potential']].sort_values('revenue_potential', ascending=False))`,
    codeTask: "Filter to products with rating > 4.3. Add a column 'is_premium' that is True if price > 800. Show value_counts() of category.",
    language: "python", quizTopic: "Pandas DataFrame, read_csv, head info describe, filtering, groupby, agg, merge, fillna dropna, value_counts, sort_values",
  },
  {
    id: "ds-eda", title: "Exploratory Data Analysis (EDA)", track: "Data Science", trackId: "datascience",
    order: 3, xp: 90, duration: "15 min", difficulty: "Intermediate",
    theory: {
      heading: "EDA: understanding your data before modeling",
      analogy: "EDA is like a doctor's checkup before surgery. You'd never operate without understanding the patient. Similarly, you should never build a model without understanding your data — its shape, distributions, missing values, and correlations.",
      body: "EDA is the first step in any real data science project. You look at distributions, check for outliers, find correlations, handle missing data. Skipping EDA is why most ML projects fail. Good EDA directly improves model performance.",
      keyPoints: ["df.isnull().sum() — count missing values", "df.corr() — correlation matrix", "df['col'].value_counts() — category distribution", "df['col'].hist() — distribution plot", "Outlier: value > mean + 3*std", "df.duplicated().sum() — find duplicates", "df.dtypes — check data types"],
    },
    codeStarter: `import pandas as pd
import numpy as np

# Simulate a real dataset with issues
np.random.seed(42)
n = 200
df = pd.DataFrame({
    'age': np.random.randint(18, 65, n),
    'salary': np.random.normal(50000, 15000, n),
    'experience': np.random.randint(0, 20, n),
    'department': np.random.choice(['Tech', 'Sales', 'HR', 'Finance'], n),
    'score': np.random.uniform(0, 100, n)
})

# Introduce missing values
df.loc[np.random.choice(n, 20), 'salary'] = np.nan
df.loc[np.random.choice(n, 10), 'score'] = np.nan

print("=== SHAPE ===")
print(df.shape)

print("\n=== MISSING VALUES ===")
print(df.isnull().sum())

print("\n=== STATISTICS ===")
print(df.describe().round(2))

print("\n=== DEPARTMENT DISTRIBUTION ===")
print(df['department'].value_counts())

print("\n=== CORRELATIONS ===")
print(df[['age', 'salary', 'experience', 'score']].corr().round(2))

# Handle missing values
df['salary'].fillna(df['salary'].median(), inplace=True)
df['score'].fillna(df['score'].mean(), inplace=True)
print("\nAfter imputation - missing:", df.isnull().sum().sum())`,
    codeTask: "Find outliers in salary (values > mean + 2*std). Count them. Then create a new column salary_band: 'Low' < 40k, 'Mid' 40k-70k, 'High' > 70k.",
    language: "python", quizTopic: "EDA, isnull, corr, value_counts, describe, missing data imputation, outliers, data distributions, fillna",
  },

  // ══════════════════════════════════════════════
  // TRACK 5: MACHINE LEARNING
  // ══════════════════════════════════════════════
  {
    id: "ml-intro", title: "ML Fundamentals", track: "Machine Learning", trackId: "ml",
    order: 1, xp: 80, duration: "12 min", difficulty: "Intermediate",
    theory: {
      heading: "Machine Learning: making computers learn from data",
      analogy: "Traditional programming: you give rules, computer follows them. ML: you give examples, computer finds the rules. It's like teaching a child — show them enough examples of cats and they learn to recognize cats without explicit rules.",
      body: "ML has 3 types: Supervised (labeled data — predict house prices), Unsupervised (no labels — find clusters), Reinforcement (learn by reward/punishment). The ML workflow: data → preprocess → split → train → evaluate → tune → deploy.",
      keyPoints: ["Supervised: input → labeled output", "Unsupervised: find patterns, no labels", "Train/Test split: 80/20 or 70/30", "Features (X) vs Labels (y)", "Overfitting: good on train, bad on test", "Underfitting: bad on both", "Cross-validation for reliable evaluation"],
    },
    codeStarter: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import numpy as np

# Load dataset
iris = load_iris()
X, y = iris.data, iris.target
print("Dataset shape:", X.shape)
print("Classes:", iris.target_names)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
print(f"Train: {X_train.shape}, Test: {X_test.shape}")

# Scale features (important for many models)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Train model
model = LogisticRegression(max_iter=200)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print(f"\nAccuracy: {accuracy_score(y_test, y_pred):.2%}")
print(classification_report(y_test, y_pred, target_names=iris.target_names))`,
    codeTask: "Change test_size to 0.3. Try without StandardScaler and compare accuracy. Print the feature importances using model.coef_.",
    language: "python", quizTopic: "ML supervised unsupervised, train test split, StandardScaler, LogisticRegression, accuracy_score, overfitting underfitting, classification report",
  },
  {
    id: "ml-regression", title: "Regression Models", track: "Machine Learning", trackId: "ml",
    order: 2, xp: 90, duration: "15 min", difficulty: "Intermediate",
    theory: {
      heading: "Regression: predicting continuous numbers",
      analogy: "Regression is like drawing the best straight line through a scatter plot of dots. Given house size (input), predict price (output). The line is your model — it summarizes the relationship between input and output.",
      body: "Linear regression is the foundation of ML. Understanding it deeply means you understand gradient descent, loss functions, and model fitting — concepts that transfer directly to neural networks. Ridge/Lasso add regularization to prevent overfitting.",
      keyPoints: ["Linear: y = mx + b (slope-intercept)", "MSE loss: mean((y_pred - y_true)²)", "R² score: how well model explains variance", "Ridge: L2 regularization (shrinks coefficients)", "Lasso: L1 regularization (can zero out features)", "Feature engineering improves regression"],
    },
    codeStarter: `from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
import numpy as np

# Simulate house price data
np.random.seed(42)
n = 300
size = np.random.uniform(500, 3000, n)           # sq ft
bedrooms = np.random.randint(1, 6, n)
age = np.random.randint(1, 50, n)
price = (size * 150 + bedrooms * 50000 - age * 1000
         + np.random.normal(0, 20000, n))

# Features matrix
X = np.column_stack([size, bedrooms, age])
y = price

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Linear Regression
lr = LinearRegression()
lr.fit(X_train, y_train)
y_pred = lr.predict(X_test)

mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f"Linear Regression:")
print(f"  MSE: {mse:,.0f}")
print(f"  RMSE: {mse**0.5:,.0f}")
print(f"  R²: {r2:.4f}")
print(f"  Coefficients: size={lr.coef_[0]:.1f}, beds={lr.coef_[1]:.0f}, age={lr.coef_[2]:.0f}")

# Ridge (regularized)
ridge = Ridge(alpha=1.0)
ridge.fit(X_train, y_train)
print(f"\nRidge R²: {r2_score(y_test, ridge.predict(X_test)):.4f}")`,
    codeTask: "Predict price of a 1500 sq ft, 3 bedroom, 10-year-old house. Add a 'location_score' feature (random 1-10) and see if R² improves.",
    language: "python", quizTopic: "Linear regression, Ridge Lasso, MSE RMSE R2 score, coefficients, regularization, overfitting, sklearn LinearRegression",
  },
  {
    id: "ml-neural", title: "Neural Networks Intro", track: "Machine Learning", trackId: "ml",
    order: 3, xp: 120, duration: "20 min", difficulty: "Advanced",
    theory: {
      heading: "Neural Networks: how deep learning actually works",
      analogy: "A neural network is like a factory assembly line. Each layer does one transformation. Raw material (input) passes through stations (layers), each refining it, until the final product (prediction) comes out. More layers = deeper factory = deep learning.",
      body: "Neural networks are universal function approximators — given enough neurons and data, they can learn any function. Every LLM (ChatGPT, Claude) is a neural network. Understanding forward pass, backpropagation, activation functions, and loss is fundamental to AI engineering.",
      keyPoints: ["Input → Hidden layers → Output", "Weights and biases are what's learned", "Activation functions: ReLU, sigmoid, softmax", "Forward pass: compute predictions", "Backprop: compute gradients, update weights", "Loss function: measures how wrong the model is", "Epoch: one full pass through training data"],
    },
    codeStarter: `from sklearn.neural_network import MLPClassifier
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
import numpy as np

# Handwritten digits (0-9)
digits = load_digits()
X, y = digits.data, digits.target
print(f"Data shape: {X.shape}")  # 1797 images, 64 pixels each
print(f"Classes: {np.unique(y)}")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Neural network: 2 hidden layers
nn = MLPClassifier(
    hidden_layer_sizes=(128, 64),   # 2 layers
    activation='relu',
    max_iter=300,
    random_state=42,
    verbose=False
)
nn.fit(X_train, y_train)
y_pred = nn.predict(X_test)

print(f"Neural Net Accuracy: {accuracy_score(y_test, y_pred):.2%}")
print(f"Layers: input(64) → 128 → 64 → output(10)")
print(f"Loss curve (last 5): {nn.loss_curve_[-5:]}")`,
    codeTask: "Try hidden_layer_sizes=(256, 128, 64) — 3 layers. Compare accuracy. Try activation='tanh' vs 'relu'. Which is better?",
    language: "python", quizTopic: "Neural networks, hidden layers, activation functions ReLU sigmoid, forward pass backpropagation, MLPClassifier, epochs, loss",
  },

  // ══════════════════════════════════════════════
  // TRACK 6: DATA ENGINEERING
  // ══════════════════════════════════════════════
  {
    id: "de-pipelines", title: "Data Pipelines & ETL", track: "Data Engineering", trackId: "dataeng",
    order: 1, xp: 90, duration: "15 min", difficulty: "Intermediate",
    theory: {
      heading: "ETL: Extract, Transform, Load",
      analogy: "ETL is like a water treatment plant. Raw water (raw data) is extracted from rivers (sources), treated and filtered (transformed), then pumped to homes (loaded into a warehouse or database). Without treatment, the water (data) is unusable.",
      body: "Data engineering is the plumbing of AI. Before any ML model can be trained, data needs to be collected, cleaned, transformed, and stored correctly. ETL pipelines automate this. In production, pipelines run on schedules (daily, hourly) using tools like Apache Airflow.",
      keyPoints: ["Extract: pull from APIs, databases, files", "Transform: clean, normalize, join, aggregate", "Load: write to data warehouse / database", "Idempotent: safe to run multiple times", "Schema validation: ensure data types are correct", "Logging & monitoring: know when pipelines fail"],
    },
    codeStarter: `import json
from datetime import datetime
import hashlib

# Simulate an ETL pipeline

# EXTRACT: raw data from API/CSV
raw_orders = [
    {"id": 1, "user": "ayatal", "amount": "299.50", "date": "2024-01-15", "status": "completed"},
    {"id": 2, "user": "RAHUL", "amount": "899", "date": "2024-01-16", "status": "PENDING"},
    {"id": 3, "user": "priya", "amount": None, "date": "2024-01-17", "status": "completed"},
    {"id": 4, "user": "rahul", "amount": "599.00", "date": "invalid-date", "status": "completed"},
]

# TRANSFORM: clean and normalize
def transform_order(order):
    errors = []

    # Normalize strings
    order["user"] = order["user"].lower().strip()
    order["status"] = order["status"].lower()

    # Convert amount
    try:
        order["amount"] = float(order["amount"]) if order["amount"] else 0.0
    except:
        order["amount"] = 0.0
        errors.append("invalid_amount")

    # Parse date
    try:
        order["date"] = datetime.strptime(order["date"], "%Y-%m-%d").date().isoformat()
    except:
        order["date"] = None
        errors.append("invalid_date")

    # Add metadata
    order["processed_at"] = datetime.now().isoformat()
    order["errors"] = errors
    return order

# LOAD: simulate writing to database
def load_to_db(orders):
    valid = [o for o in orders if not o["errors"]]
    invalid = [o for o in orders if o["errors"]]
    print(f"Loaded: {len(valid)} valid, {len(invalid)} rejected")
    return valid

# Run pipeline
transformed = [transform_order(o) for o in raw_orders]
loaded = load_to_db(transformed)
for order in loaded:
    print(f"  ✓ Order {order['id']}: {order['user']} - ₹{order['amount']}")`,
    codeTask: "Add a deduplication step that removes orders with the same (user, amount, date) combination. Add a pipeline_run_id field (use hashlib to generate one).",
    language: "python", quizTopic: "ETL pipeline, Extract Transform Load, data cleaning, normalization, schema validation, idempotent, data warehouse, Apache Airflow",
  },
  {
    id: "de-sql-warehouse", title: "Data Warehousing Concepts", track: "Data Engineering", trackId: "dataeng",
    order: 2, xp: 80, duration: "12 min", difficulty: "Intermediate",
    theory: {
      heading: "Data Warehouses: where analytics data lives",
      analogy: "A database is a live kitchen — optimized for quick reads and writes of current data. A data warehouse is a pantry — optimized for analytical queries over huge amounts of historical data. You don't cook in the pantry.",
      body: "Data warehouses (BigQuery, Snowflake, Redshift) store historical data in columnar format for fast analytics. The star schema organizes data into fact tables (transactions) and dimension tables (users, products, dates). This is what feeds every business dashboard and ML training dataset.",
      keyPoints: ["OLTP: transactional DB (fast reads/writes)", "OLAP: warehouse (fast analytical queries)", "Fact table: events/transactions (many rows)", "Dimension table: context (users, products, dates)", "Star schema: fact + surrounding dimensions", "Columnar storage: fast aggregations", "Partitioning: split huge tables by date/region"],
    },
    codeStarter: `-- Data Warehouse SQL Patterns

-- STAR SCHEMA example
-- fact_orders: one row per order line item
-- dim_users, dim_products, dim_dates: context

-- Typical analytical query: revenue by month and category
SELECT
    d.year,
    d.month,
    p.category,
    SUM(f.quantity * f.unit_price) AS revenue,
    COUNT(DISTINCT f.user_id) AS unique_buyers,
    COUNT(f.order_id) AS total_orders,
    SUM(f.quantity * f.unit_price) /
        COUNT(DISTINCT f.user_id) AS revenue_per_user
FROM fact_orders f
JOIN dim_dates d ON f.date_id = d.date_id
JOIN dim_products p ON f.product_id = p.product_id
JOIN dim_users u ON f.user_id = u.user_id
WHERE d.year = 2024
  AND u.country = 'India'
GROUP BY 1, 2, 3
ORDER BY 1, 2, revenue DESC;

-- Partitioned query (efficient on big data)
SELECT category, SUM(revenue) AS total
FROM fact_orders_partitioned
WHERE partition_date BETWEEN '2024-01-01' AND '2024-03-31'
GROUP BY category;`,
    codeTask: "Write a query for 'month-over-month revenue growth' — show each month's revenue AND the previous month's revenue using LAG() window function.",
    language: "sql", quizTopic: "Data warehouse, OLTP vs OLAP, star schema, fact table, dimension table, columnar storage, partitioning, BigQuery Snowflake Redshift",
  },

  // ══════════════════════════════════════════════
  // TRACK 7: AI ENGINEERING
  // ══════════════════════════════════════════════
  {
    id: "ai-apis", title: "LLM APIs & Prompting", track: "AI Engineering", trackId: "ai",
    order: 1, xp: 80, duration: "12 min", difficulty: "Intermediate",
    theory: {
      heading: "LLM APIs: the foundation of AI products",
      analogy: "An LLM API is like a genius consultant you can call anytime. You describe the problem (prompt), they think (inference), you get an answer (response). You're charged per word (tokens). Your job as an AI engineer is to ask the right questions efficiently.",
      body: "Every AI product today is built on top of LLM APIs. Knowing how to call them, structure prompts, parse responses, handle errors, and manage token costs is core AI engineering. Claude, OpenAI, and Gemini all use the same basic pattern: system prompt + messages array + max_tokens.",
      keyPoints: ["System prompt: sets AI's role and behavior", "Messages: [{role, content}] array", "max_tokens: limits response length", "Temperature: 0=deterministic, 1=creative", "Tokens ≈ 0.75 words (pricing unit)", "Streaming: get response word by word", "Rate limits: handle 429 errors with retry"],
    },
    codeStarter: `import json

# LLM API structure (works for Claude, OpenAI, Gemini)
request = {
    "model": "claude-sonnet-4-6",
    "max_tokens": 500,
    "system": "You are a coding instructor. Explain concepts clearly with examples.",
    "messages": [
        {"role": "user", "content": "Explain what a neural network is in simple terms"}
    ]
}

print("API Request:")
print(json.dumps(request, indent=2))

# Simulated response
response = {
    "id": "msg_01abc",
    "content": [{"type": "text", "text": "A neural network is a system of interconnected nodes inspired by the brain..."}],
    "usage": {"input_tokens": 22, "output_tokens": 87}
}

# Parse response
text = response["content"][0]["text"]
total_tokens = response["usage"]["input_tokens"] + response["usage"]["output_tokens"]
cost_usd = (response["usage"]["input_tokens"] * 3 / 1_000_000 +
            response["usage"]["output_tokens"] * 15 / 1_000_000)

print(f"\\nResponse: {text[:100]}...")
print(f"Tokens: {total_tokens} (input: {response['usage']['input_tokens']}, output: {response['usage']['output_tokens']})")
print(f"Estimated cost: \${cost_usd:.6f}")`,
    codeTask: "Write a function build_prompt(topic, difficulty) that returns a system prompt and user message for generating a quiz question. Test it with 3 different topics.",
    language: "python", quizTopic: "LLM APIs, system prompt, messages, max_tokens, temperature, tokens, rate limits, Claude OpenAI Gemini, prompt engineering",
  },
  {
    id: "ai-rag", title: "RAG — Retrieval Augmented Generation", track: "AI Engineering", trackId: "ai",
    order: 2, xp: 120, duration: "20 min", difficulty: "Advanced",
    theory: {
      heading: "RAG: giving LLMs long-term memory",
      analogy: "An LLM without RAG is like a genius with amnesia — brilliant but only knows what was in training data. RAG gives it a search engine. Before answering, it searches a knowledge base, grabs relevant chunks, and answers using that context. That's how Claude Projects and ChatGPT Plugins work.",
      body: "RAG is the most important AI engineering pattern right now. It solves the knowledge cutoff problem and lets you build AI on top of your own private data without expensive fine-tuning. Pipeline: chunk text → embed → store in vector DB → retrieve on query → augment prompt → generate.",
      keyPoints: ["Embedding: text → vector of numbers", "Cosine similarity: measure text similarity", "Vector DB: stores embeddings (Pinecone, pgvector)", "Chunking: split docs into ~500 token pieces", "Top-k retrieval: find k most similar chunks", "Context window: inject chunks into prompt", "Supabase pgvector: free vector DB built-in"],
    },
    codeStarter: `import json
import math

# RAG Pipeline — full implementation

# Step 1: Knowledge base (would be stored in vector DB)
docs = [
    {"id": 1, "text": "Python lists are ordered, mutable collections using [] syntax"},
    {"id": 2, "text": "Big O O(n^2) means nested loops — avoid for large datasets"},
    {"id": 3, "text": "SQL SELECT * returns all columns from a table"},
    {"id": 4, "text": "Neural networks have input, hidden, and output layers"},
    {"id": 5, "text": "RAG stands for Retrieval Augmented Generation"},
    {"id": 6, "text": "Pandas DataFrames are like Excel tables in Python code"},
]

# Step 2: Simple TF-IDF-like embedding (real: use text-embedding-3-small)
def simple_embed(text):
    words = set(text.lower().split())
    return words

# Step 3: Cosine similarity (simplified as Jaccard for demo)
def similarity(query_words, doc_words):
    intersection = len(query_words & doc_words)
    union = len(query_words | doc_words)
    return intersection / union if union > 0 else 0

# Step 4: Retrieve top-k most similar docs
def retrieve(query, docs, k=2):
    query_words = simple_embed(query)
    scored = [(similarity(query_words, simple_embed(d["text"])), d) for d in docs]
    scored.sort(reverse=True)
    return [d for _, d in scored[:k]]

# Step 5: Build augmented prompt
def rag_prompt(query, retrieved_docs):
    context = "\n".join([f"- {d['text']}" for d in retrieved_docs])
    return f"""Context information:
{context}

Based only on the context above, answer:
{query}"""

# Run RAG pipeline
query = "How do neural networks relate to layers and learning?"
retrieved = retrieve(query, docs)
prompt = rag_prompt(query, retrieved)

print("Query:", query)
print("\nRetrieved:")
for d in retrieved:
    print(f"  → {d['text']}")
print("\nFinal prompt sent to LLM:")
print(prompt)`,
    codeTask: "Add a chunk_text(text, chunk_size=5) function that splits a long text into overlapping chunks of chunk_size words with 2-word overlap.",
    language: "python", quizTopic: "RAG retrieval augmented generation, embeddings, vector database, cosine similarity, chunking, pgvector, Pinecone, context window",
  },
  {
    id: "ai-agents", title: "AI Agents & Tool Use", track: "AI Engineering", trackId: "ai",
    order: 3, xp: 130, duration: "20 min", difficulty: "Advanced",
    theory: {
      heading: "Agents: LLMs that take actions",
      analogy: "A basic LLM call is like asking a question and getting an answer. An agent is like hiring an assistant — they can look things up, run calculations, call APIs, write files, and make decisions over multiple steps to complete a goal.",
      body: "AI agents are the frontier of AI engineering. An agent has: a goal, tools it can use, memory of past steps, and a loop (think → act → observe → think again). Claude's tool use, OpenAI's function calling, and frameworks like LangChain implement this pattern.",
      keyPoints: ["ReAct loop: Reason → Act → Observe", "Tools: web search, code execution, DB query", "Tool definition: name, description, parameters", "Agent decides which tool to call", "Tool result fed back into context", "Multi-step planning over complex tasks", "LangChain / LlamaIndex: agent frameworks"],
    },
    codeStarter: `import json

# AI Agent with Tool Use — simulated

# Define tools the agent can use
TOOLS = [
    {
        "name": "search_web",
        "description": "Search the internet for current information",
        "parameters": {"query": "string"}
    },
    {
        "name": "run_python",
        "description": "Execute Python code and return output",
        "parameters": {"code": "string"}
    },
    {
        "name": "query_database",
        "description": "Run SQL query on the database",
        "parameters": {"sql": "string"}
    }
]

# Simulate tool execution
def execute_tool(tool_name, params):
    if tool_name == "run_python":
        # In production: actually run in sandbox
        return f"[Executed: {params['code'][:50]}...] Output: 42"
    elif tool_name == "search_web":
        return f"[Search results for '{params['query']}'] Top result: ..."
    elif tool_name == "query_database":
        return "[DB Result] 3 rows returned: [(1, 'Python', 95), ...]"

# Agent loop
def run_agent(goal, max_steps=5):
    history = []
    print(f"Agent Goal: {goal}\n")

    for step in range(max_steps):
        # LLM decides next action (simulated)
        if step == 0:
            action = {"tool": "query_database", "params": {"sql": "SELECT * FROM scores"}}
        elif step == 1:
            action = {"tool": "run_python", "params": {"code": "import statistics; statistics.mean([95, 88, 72])"}}
        else:
            action = {"done": True, "answer": "Average score is 85. Best subject: Python (95)."}

        if action.get("done"):
            print(f"✓ Final Answer: {action['answer']}")
            return action["answer"]

        print(f"Step {step+1}: Calling {action['tool']}...")
        result = execute_tool(action["tool"], action["params"])
        print(f"  Result: {result}")
        history.append({"action": action, "result": result})

run_agent("What is the average score across all subjects and which is highest?")`,
    codeTask: "Add a 'calculator' tool that evaluates a math expression string. Add it to TOOLS and handle it in execute_tool. Test the agent using it.",
    language: "python", quizTopic: "AI agents, ReAct loop, tool use, function calling, LangChain, LlamaIndex, multi-step reasoning, agent frameworks",
  },

  // ══════════════════════════════════════════════
  // TRACK 8: WEB & APIs FOR AI
  // ══════════════════════════════════════════════
  {
    id: "web-fastapi", title: "FastAPI — Building AI APIs", track: "Web & APIs for AI", trackId: "webai",
    order: 1, xp: 90, duration: "15 min", difficulty: "Intermediate",
    theory: {
      heading: "FastAPI: the Python framework for AI backends",
      analogy: "FastAPI is like a restaurant's ordering system. Customers (clients) send orders (HTTP requests) to the counter (endpoints). The kitchen (your Python logic) processes it, and the waiter (FastAPI) delivers the response. All menus (API docs) are auto-generated.",
      body: "FastAPI is the go-to Python framework for deploying ML models and AI services as APIs. It's fast (async), type-safe (Pydantic), and auto-generates OpenAPI docs. Every ML model you build needs a FastAPI wrapper to be useful in production.",
      keyPoints: ["@app.get('/path') — GET endpoint", "@app.post('/path') — POST endpoint", "Pydantic BaseModel — request/response types", "Automatic /docs — Swagger UI", "async def — non-blocking endpoints", "Depends() — dependency injection", "uvicorn app:app — run the server"],
    },
    codeStarter: `# FastAPI — AI Model API
# pip install fastapi uvicorn pydantic

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import json

app = FastAPI(title="Codevance AI API", version="1.0")

# Request/Response models
class QuizRequest(BaseModel):
    topic: str
    difficulty: str = "intermediate"
    num_questions: int = 3

class Question(BaseModel):
    question: str
    options: list[str]
    correct_index: int
    explanation: str

class QuizResponse(BaseModel):
    topic: str
    questions: list[Question]
    total_xp: int

# Simulated ML/AI logic
def generate_questions(topic: str, difficulty: str, n: int):
    # In production: call Claude API here
    return [
        Question(
            question=f"What is the time complexity of dict lookup in Python?",
            options=["O(n)", "O(log n)", "O(1)", "O(n²)"],
            correct_index=2,
            explanation="Dicts use hashing — O(1) average case."
        )
    ] * n

# Endpoints
@app.get("/")
def root():
    return {"message": "Codevance AI API", "version": "1.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/quiz/generate", response_model=QuizResponse)
async def generate_quiz(req: QuizRequest):
    if req.num_questions > 10:
        raise HTTPException(400, "Max 10 questions per request")

    questions = generate_questions(req.topic, req.difficulty, req.num_questions)
    xp = {"beginner": 30, "intermediate": 60, "advanced": 100}.get(req.difficulty, 60)

    return QuizResponse(topic=req.topic, questions=questions, total_xp=xp * req.num_questions)

# To run: uvicorn main:app --reload
# Docs at: http://localhost:8000/docs
print("FastAPI app defined. Run: uvicorn main:app --reload")
print("Endpoints: GET / | GET /health | POST /quiz/generate")`,
    codeTask: "Add a POST /predict endpoint that accepts {features: list[float]} and returns {prediction: float, confidence: float}. Use dummy logic for now.",
    language: "python", quizTopic: "FastAPI, endpoints GET POST, Pydantic BaseModel, HTTPException, async def, uvicorn, OpenAPI docs, REST API design",
  },
  {
    id: "web-deploy", title: "Deploying ML Models", track: "Web & APIs for AI", trackId: "webai",
    order: 2, xp: 100, duration: "15 min", difficulty: "Advanced",
    theory: {
      heading: "From notebook to production: deploying ML models",
      analogy: "Training a model is like baking a cake in your kitchen. Deploying it is opening a bakery — you need to serve hundreds of customers (requests) simultaneously, keep quality consistent, handle rush hours (traffic spikes), and know when something goes wrong.",
      body: "Most ML projects die in notebooks. Deployment is what makes a model valuable. The standard pattern: train model → save with joblib/pickle → load in FastAPI → containerize with Docker → deploy on Render/Railway/GCP. Monitoring ensures the model doesn't degrade silently.",
      keyPoints: ["joblib.dump(model, 'model.pkl') — save model", "joblib.load('model.pkl') — load model", "Docker: container = consistent environment", "Dockerfile: recipe to build container", "Environment variables: keep secrets safe", "Health endpoint: /health for monitoring", "Model drift: production data ≠ training data"],
    },
    codeStarter: `# ML Model Deployment Pattern
import json
from datetime import datetime

# Step 1: Train and save model (do this once)
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import numpy as np

# Simulate training
np.random.seed(42)
X_train = np.random.randn(100, 4)
y_train = (X_train[:, 0] + X_train[:, 1] > 0).astype(int)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)

model = LogisticRegression()
model.fit(X_scaled, y_train)

print("✓ Model trained")

# Step 2: Save (in real code, use joblib)
# joblib.dump({'model': model, 'scaler': scaler}, 'model.pkl')
print("✓ Model saved to model.pkl")

# Step 3: Simulate API serving (what FastAPI does)
def predict(features: list) -> dict:
    x = np.array(features).reshape(1, -1)
    x_scaled = scaler.transform(x)
    pred = model.predict(x_scaled)[0]
    prob = model.predict_proba(x_scaled)[0]
    return {
        "prediction": int(pred),
        "confidence": round(float(max(prob)), 4),
        "timestamp": datetime.now().isoformat()
    }

# Step 4: Test prediction
sample = [0.5, 1.2, -0.3, 0.8]
result = predict(sample)
print(f"\nPrediction for {sample}:")
print(json.dumps(result, indent=2))

# Dockerfile content (reference)
dockerfile = """
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
"""
print("\nDockerfile:")
print(dockerfile)`,
    codeTask: "Add input validation to predict(): check features has exactly 4 values, each is a number, none is NaN. Raise ValueError with a clear message if invalid.",
    language: "python", quizTopic: "ML deployment, joblib pickle, FastAPI serving, Docker Dockerfile, environment variables, model monitoring, model drift, Render Railway GCP",
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return CURRICULUM.find((l) => l.id === id);
}

export function getLessonsByTrack(trackId: string): Lesson[] {
  return CURRICULUM.filter((l) => l.trackId === trackId).sort((a, b) => a.order - b.order);
}

export function getTotalXP(): number {
  return CURRICULUM.reduce((s, l) => s + l.xp, 0);
}
