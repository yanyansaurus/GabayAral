const fs = require('fs');
const path = require('path');

const mappings = [
  { regex: /bg-white(?!\s+dark:)/g, replace: 'bg-white dark:bg-[#15171C]' },
  { regex: /text-gray-900(?!\s+dark:)/g, replace: 'text-gray-900 dark:text-white' },
  { regex: /text-gray-800(?!\s+dark:)/g, replace: 'text-gray-800 dark:text-gray-100' },
  { regex: /text-gray-700(?!\s+dark:)/g, replace: 'text-gray-700 dark:text-gray-200' },
  { regex: /text-gray-600(?!\s+dark:)/g, replace: 'text-gray-600 dark:text-gray-300' },
  { regex: /text-gray-500(?!\s+dark:)/g, replace: 'text-gray-500 dark:text-gray-400' },
  { regex: /text-gray-400(?!\s+dark:)/g, replace: 'text-gray-400 dark:text-gray-500' },
  { regex: /bg-gray-50(?!\s+dark:)/g, replace: 'bg-gray-50 dark:bg-[#1E232B]' },
  { regex: /bg-gray-100(?!\s+dark:)/g, replace: 'bg-gray-100 dark:bg-gray-800' },
  { regex: /border-gray-100(?!\s+dark:)/g, replace: 'border-gray-100 dark:border-gray-800' },
  { regex: /border-gray-200(?!\s+dark:)/g, replace: 'border-gray-200 dark:border-gray-700' },
  { regex: /bg-indigo-50(?!\s+dark:)/g, replace: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { regex: /border-indigo-100(?!\s+dark:)/g, replace: 'border-indigo-100 dark:border-indigo-800/50' },
  { regex: /bg-teal-50(?!\s+dark:)/g, replace: 'bg-teal-50 dark:bg-teal-900/20' },
  { regex: /border-teal-100(?!\s+dark:)/g, replace: 'border-teal-100 dark:border-teal-800/50' },
  { regex: /bg-rose-50(?!\s+dark:)/g, replace: 'bg-rose-50 dark:bg-rose-900/20' },
  { regex: /border-rose-100(?!\s+dark:)/g, replace: 'border-rose-100 dark:border-rose-800/50' },
  { regex: /bg-amber-50(?!\s+dark:)/g, replace: 'bg-amber-50 dark:bg-amber-900/20' },
  { regex: /border-amber-100(?!\s+dark:)/g, replace: 'border-amber-100 dark:border-amber-800/50' },
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  mappings.forEach(map => {
    content = content.replace(map.regex, map.replace);
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', file);
  }
});
