module.exports = {
  roots: ["<rootDir>/__tests__/"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  testEnvironment: "node"
};
