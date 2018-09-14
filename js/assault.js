const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: fs.createReadStream('./Crimes_-_2001_to_present.csv'),
});
const writeStream = fs.createWriteStream('./json/outputassault.json');

const allYears = [];
const assaultCases = [];
const arrested = [];
const notArrested = [];
let y = 2001;

for (let i = 0; i < 16; i += 1) {
  allYears.push(y.toString());
  assaultCases[i] = 0;
  arrested[i] = 0;
  notArrested[i] = 0;
  y += 1;
}

const outputobj = [];

let firstline = 0;
let Y; let A; let
  P;

let jsonFromLine = {
  Year: '', AssaultCases: '', Arrested: '', NotArrested: '',
};

rl.on('line', (line) => {
  const lineSplit = line.split(',', 20);

  if (firstline === 0) {
    Y = lineSplit.indexOf('Year');
    P = lineSplit.indexOf('Primary Type');
    A = lineSplit.indexOf('Arrest');
    firstline += 1;
  } else if (lineSplit[P] === 'ASSAULT' && (lineSplit[Y] >= 2001 && lineSplit[Y] <= 2016)) {
    const index = allYears.indexOf(lineSplit[Y]);
    assaultCases[index] += 1;
    if (lineSplit[A] === 'true') { arrested[index] += 1; } else { notArrested[index] += 1; }
  }
});

rl.on('close', () => {
  for (let i = 0; i < 16; i += 1) {
    jsonFromLine.Year = allYears[i];
    jsonFromLine.Arrested = arrested[i];
    jsonFromLine.NotArrested = notArrested[i];
    jsonFromLine.AssaultCases = assaultCases[i];
    outputobj.push(jsonFromLine);
    jsonFromLine = {
      Year: '', AssaultCases: '', Arrested: '', NotArrested: '',
    };
  }

  writeStream.write(JSON.stringify(outputobj, null, 2));
});
