/** Strip the closing lecture: "we checked" / "why this is dumb". The piece should end on the fact. */

const LECTURE =
  /^\s*yes it['’]s real\b|n[’']invente pas de citations|we do not invent quotes|sources are under the piece|les sources sont sous le papier|readers looking for a hoax|neither is satire|the (joke is the minute|minute is real)|if the originating desk corrects|si le journal d[’']origine corrige|checked at publication against|recoupé à la publication|fact-checked all the same|tout a pourtant été fact-check|pourquoi c[’']est bête|why this is dumb|ça s[’']est vraiment passé\.?$|^it happened\.?$|^it really happened\.?$|the originating report/i;

export function isClosingLecture(para: string): boolean {
  const text = para.replace(/\s+/g, " ").trim();
  if (!text) return true;
  return LECTURE.test(text);
}

export function stripClosingLecture(body: string[]): string[] {
  const next = body.map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);
  while (next.length > 1 && isClosingLecture(next[next.length - 1] || "")) {
    next.pop();
  }
  return next;
}
