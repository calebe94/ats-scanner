function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
}

function renderTable(lines: string[]): string {
  const rows = lines
    .filter((l) => !/^\s*\|[\s\-:|]+\|\s*$/.test(l))
    .map((l) =>
      l
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim()),
    );

  if (!rows.length) return "";

  const [header, ...body] = rows;
  return (
    `<table class="info-table"><thead><tr>` +
    header.map((h) => `<th>${inline(h)}</th>`).join("") +
    `</tr></thead><tbody>` +
    body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("") +
    `</tbody></table>`
  );
}

export function md(raw: string): string {
  const lines = raw.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    if (line.trim().startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      out.push(renderTable(tableLines));
      continue;
    }

    if (/^\s*- /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*- /.test(lines[i])) {
        items.push(lines[i].replace(/^\s*- /, ""));
        i++;
      }
      out.push(
        "<ul>" +
          items.map((item) => `<li>${inline(item)}</li>`).join("") +
          "</ul>",
      );
      continue;
    }

    if (/^\s*\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s/, ""));
        i++;
      }
      out.push(
        "<ol>" +
          items.map((item) => `<li>${inline(item)}</li>`).join("") +
          "</ol>",
      );
      continue;
    }

    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("|") &&
      !/^\s*- /.test(lines[i]) &&
      !/^\s*\d+\.\s/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    out.push(`<p>${inline(para.join(" "))}</p>`);
  }

  return out.join("");
}
