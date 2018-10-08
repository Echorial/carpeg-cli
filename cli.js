#!/usr/bin/env node
const fs = require("fs");
const program = require('commander');

let Carpeg;

try {
	Carpeg = require('carpeg');
}catch (e) {
	Carpeg = require("./bin/carpeg.js");
}

const path = require("path");
const { exec } = require('child_process');

program
	.version('1.0.0')
	.command('generate <parser> <output>')
	.option("-t, --target [platform]", "Set the target platform(carbon, php, javascript)", "carbon")
	.option("-d, --debug", "Saves the tmp carbon file")
	.option("-n, --name [name]", "Parser class name", "CarpegParser")
	.description('Generates a parser based on the parser cpeg file.')
	.action(function (parser, output, cmd) {
		let grammar = new Carpeg.grammar(fs.readFileSync(parser, "utf8"));
		grammar.parserClass = cmd.name;
		const carbonOutput = grammar.generate();

		if (cmd.target == "carbon") {
			fs.writeFileSync(output, carbonOutput);
		}else{
			let random = Math.floor(Math.random() * 100000);
			fs.writeFileSync(`./cpegTmpFile${random}.carb`, carbonOutput);
			// Call on carbonite to finish
			exec(`carbonite compile ${cmd.target}.source.memory ./cpegTmpFile${random}.carb ${output}`, (err, stdout, stderr) => {
				if (err) {
					console.log(stdout + err + "\nMake sure you have carbonite-cli installed");
					return;
				}
				
				if (!cmd.debug)
					fs.unlinkSync(`./cpegTmpFile${random}.carb`);

				if (cmd.target == "javascript") // Hack to export the parser
					fs.writeFileSync(output, fs.readFileSync(output, "utf8") + `\nmodule.exports = ${cmd.name};`);
				console.log(stdout);
			});
		}
	});

program.parse(process.argv);