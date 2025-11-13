# Python - Mal indentado propositalmente
def calculate_sum(numbers):
total = 0
for num in numbers:
if num > 0:
total += num
if total > 100:
print("Large sum!")
return total
class Calculator:
def __init__(self):
self.result = 0
def add(self, value):
self.result += value
if self.result < 0:
self.result = 0
return self.result
def subtract(self, value):
self.result -= value
return self.result
if __name__ == "__main__":
calc = Calculator()
result = calc.add(10)
print(f"Result: {result}")

