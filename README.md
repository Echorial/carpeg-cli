# carpeg-cli
Carpeg generator interface for node

## Installation
```
$ npm install carpeg-cli
```

## Usage
```
$ carpeg generate inputGrammar.cpeg outputFile.php --target php --name MyParserName
```
``` php
include("./outputFile.php");
$parsed = MyParserName::parse('input string');
echo $parsed->hadError; // true
```