export function replaceWhitespaceWithUnderscores(str: string): string {
  const result = str.replace(/\s/g, "_");
  console.log(result); // Log the result to the console
  return result;
}
