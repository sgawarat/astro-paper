import type { CollectionEntry } from "astro:content";

type GroupKey = string | number | symbol;

interface GroupFunction<T> {
  (item: T): GroupKey;
}

const getPostsByGroupCondition = (
  posts: CollectionEntry<"blog">[],
  groupFunction: GroupFunction<CollectionEntry<"blog">>
) => {
  const result: Record<GroupKey, CollectionEntry<"blog">[]> = {};
  for (const item of posts) {
    const groupKey = groupFunction(item);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
  }
  return result;
};

export default getPostsByGroupCondition;
