import GithubSlugger, { slug } from "github-slugger";

export function slugifyStr(str: string) {
  return slug(str);
}

export function slugifyAll(arr: string[]) {
  const slugger = new GithubSlugger();
  return arr.map((str) => slugger.slug(str));
}
