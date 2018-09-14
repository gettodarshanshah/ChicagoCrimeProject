const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: fs.createReadStream('./Crimes_-_2001_to_present.csv'),
});

const myWriteStream = fs.createWriteStream('./json/theftOutput.json');


const allYears = [];
const over500 = [];
const under500 = [];
let y = 2001;

for (let i = 0; i < 16; i += 1) {
  allYears.push(y.toString());
  over500[i] = 0;
  under500[i] = 0;
  y += 1;
}

const output = [];

let jsonFromLine = { Year: '', Over$500: '', $500AndUnder: '' };


rl.on('line', (line) => {
  const lineSplit = line.split(',', 20);

  const index = allYears.indexOf(lineSplit[17]);
  if (index > -1) {
    if (line.indexOf('OVER $500') > -1) {
      over500[index] += 1;
    } else if (line.indexOf('$500 AND UNDER') > -1) {
      under500[index] += 1;
    }
  }
});


rl.on('close', () => {
  for (let i = 0; i < 16; i += 1) {
    jsonFromLine.Year = allYears[i];
    jsonFromLine.Over$500 = over500[i];
    jsonFromLine.$500AndUnder = under500[i];
    output.push(jsonFromLine);
    jsonFromLine = { Year: '', Over$500: '', $500AndUnder: '' };
  }

  myWriteStream.write(JSON.stringify(output, null, 2));
});
