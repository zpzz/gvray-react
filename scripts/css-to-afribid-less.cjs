const fs = require('fs');
const path = require('path');

const cssPath = path.join(
  __dirname,
  '../src/layouts/AfribidLayout/afribid.css',
);
const lessPath = path.join(
  __dirname,
  '../src/layouts/AfribidLayout/afribid.less',
);

let css = fs.readFileSync(cssPath, 'utf8');

css = css.replace(
  /@import '\.\/fonts\.css';/,
  "@import (css) './fonts.css';",
);

// Less 会运算 calc 里的减法，需要整段转义
css = css.replace(/calc\(([^)]+)\)/g, (_m, inner) => {
  return `~'calc(${String(inner).replace(/'/g, "\\'")})'`;
});

// 带逗号的 CSS 变量值（字体栈）需要转义，否则 Less 当成分隔参数
css = css.replace(
  /(--[a-zA-Z0-9_-]+)\s*:\s*([^;{}]+);/g,
  (m, prop, val) => {
    const trimmed = String(val).trim();
    if (trimmed.includes(',') && !trimmed.startsWith('~')) {
      return `${prop}: ~'${trimmed.replace(/'/g, "\\'")}';`;
    }
    return m;
  },
);

fs.writeFileSync(lessPath, css);
console.log('wrote', lessPath, css.length);
