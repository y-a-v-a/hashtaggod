const fs = require('fs');

function a() {
  let txt = fs.readFileSync('./bible.txt', {encoding: 'utf8'});

  let result = txt.replace(/[\s]+/g, ' ');
  fs.writeFileSync('./test3.txt', result);
}

function b() {
  let txt = fs.readFileSync('./test3.txt', {encoding: 'utf8'});

  let result = txt.replace(/((.|\s){0,140}[^\w#\.,:;\(\)\?\!\'])/g, '$1\n\n');

  fs.writeFileSync('./test.txt', result);
}

function c() {
  let txt2 = fs.readFileSync('./test.txt', {encoding: 'utf8'});

  let lines = txt2.split('\n\n');
  console.log(lines.length);

  let result = lines.map(function(el) {
    let t = el.trim();

    return t;
  });

  fs.writeFileSync('./tweets.json', JSON.stringify(result));
}

function d() {
  let txt = fs.readFileSync('./bible3.txt', { encoding:'utf8'});
  let result = txt.replace(/\S#/g, ' #');
  fs.writeFileSync('./test2.txt', result);
}

// b();

// a();
c();
