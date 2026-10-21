import { MemoryCache } from "../dist/index.js";
const cache = new MemoryCache<string, number>(100);
cache.set("count", 42, 5000);
console.log(cache.get("count"));
