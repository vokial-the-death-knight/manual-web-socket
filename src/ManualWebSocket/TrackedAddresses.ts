export class TrackedAddresses {
  private stringList: string[] = [];
  private regExpList: RegExp[] = [];

  add(url: string | RegExp): void {
    url.constructor == RegExp
      ? this.regExpList.push(url as RegExp)
      : this.stringList.push(url as string);
  }

  isTracked(url: string): boolean {
    return this.searchStrings(url) ? true : this.searchRegExp(url);
  }

  private searchRegExp(url: string): boolean {
    return this.regExpList.filter(regexp => {
      const r = new RegExp(regexp);
      return r.exec(url);
    }).length
      ? true
      : false;
  }

  private searchStrings(url: string): boolean {
    return this.stringList.includes(url);
  }
}

export const GlobalTrackedAddresses = new TrackedAddresses();
