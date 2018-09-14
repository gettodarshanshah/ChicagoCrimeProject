const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: fs.createReadStream('./Crimes_-_2001_to_present.csv'),
});

const myWriteStream1 = fs.createWriteStream('./json/theft.json');

const outobj = {
};

for (let year = 2001; year <= 2016; year += 1) {
  outobj[year.toString()] = { Over$500: 0, $500AndUnder: 0 };
}

// const jsonFromLine = { Year: '', Over$500: '', $500AndUnder: '' };
let firstline = 0;
let Y; let T;
let D;

rl.on('line', (line) => {
  const lineSplit = line.split(',', 20);

  if (firstline === 0) {
    Y = lineSplit.indexOf('Year');
    T = lineSplit.indexOf('Primary Type');
    D = lineSplit.indexOf('Description');
    firstline += 1;
  } else if (lineSplit[T] === 'THEFT' && (lineSplit[Y] >= 2001 && lineSplit[Y] <= 2016)) {
    if (lineSplit[D] === 'OVER $500') { outobj[lineSplit[Y]].Over$500 += 1; } else if (lineSplit[D] === '$500 AND UNDER') { outobj[lineSplit[Y]].$500AndUnder += 1; }
  }
});


rl.on('close', () => {
  myWriteStream1.write(JSON.stringify(outobj, null, 2));
});
