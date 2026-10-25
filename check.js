// 校验作品集站点：JS 语法、分类与作品的对应关系、字段完整性、是否有外部依赖
const fs = require("fs");
const path = require("path");

const root = __dirname;
const p = path.join(root, "index.html");
const h = fs.readFileSync(p, "utf8");
const m = h.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.log("NO SCRIPT BLOCK"); process.exit(1); }
const code = m[1];
new Function(code);                              // 语法检查

// 取出三个数据块（方括号 / 花括号配平扫描）
function grab(key, open, close) {
  const at = code.indexOf(key);
  if (at < 0) throw new Error("找不到 " + key);
  let i = code.indexOf(open, at), depth = 0;
  for (let k = i; k < code.length; k++) {
    if (code[k] === open) depth++;
    else if (code[k] === close) { depth--; if (!depth) return eval("(" + code.slice(i, k + 1) + ")"); }
  }
  throw new Error(key + " 括号不配对");
}

const PROFILE = grab("var PROFILE =", "{", "}");
const CATEGORIES = grab("var CATEGORIES =", "[", "]");
const WORKS = grab("var WORKS =", "[", "]");

const ids = new Set(CATEGORIES.map(c => c.id));
const problems = [];
const used = {};

WORKS.forEach((w, i) => {
  const who = w.title || ("第 " + (i + 1) + " 件作品");
  ["cat", "title", "year", "role", "summary"].forEach(f => {
    if (!w[f]) problems.push(who + " 缺少字段 " + f);
  });
  if (!ids.has(w.cat)) problems.push(who + " 的 cat=\"" + w.cat + "\" 不在分类列表里");
  if (!Array.isArray(w.workflow) || !w.workflow.length) problems.push(who + " 的 workflow 为空");
  if (!Array.isArray(w.tags)) problems.push(who + " 的 tags 不是数组");
  if (w.cover && !fs.existsSync(path.join(root, w.cover)))
    problems.push(who + " 的 cover 文件不存在：" + w.cover);
  used[w.cat] = (used[w.cat] || 0) + 1;
});

const empty = CATEGORIES.filter(c => !used[c.id]).map(c => c.name);
const external = /(?:src|href)\s*=\s*["']https?:/i.test(h);
const networkish = /fetch\(|XMLHttpRequest|localStorage/.test(code);
const samples = WORKS.filter(w => w.sample).length;

console.log("HTML 字符数   :", h.length);
console.log("JS 语法       : OK（脚本 " + code.length + " 字符）");
console.log("分类数量      :", CATEGORIES.length);
console.log("作品数量      :", WORKS.length, "（其中示例 " + samples + " 件）");
console.log("已用到的分类  :", Object.keys(used).length, "/", CATEGORIES.length);
if (empty.length) console.log("空分类        :", empty.join("、"));
console.log("外部链接      :", external ? "发现外链！" : "无 ✅");
console.log("联网/存储调用  :", networkish ? "发现 fetch/storage！" : "无 ✅");
console.log("");
if (problems.length) {
  console.log("数据问题：");
  problems.forEach(x => console.log("  ! " + x));
  process.exitCode = 1;
} else {
  console.log("数据校验：全部通过 ✅（分类与作品对应正确、字段齐全、无空工作流）");
}
