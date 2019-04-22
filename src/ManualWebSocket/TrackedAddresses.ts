export class TrackedAddresses {
  private stringList: string[] = [];
  private regExpList: RegExp[] = [];

  add(url: string | RegExp): void {
    url.constructor == RegExp
      ? this.regExpList.push(url as RegExp)
      : this.stringList.push(url as string);
  }

  remove(url: string | RegExp): void {
    if (url.constructor == RegExp) {
      const index = this.regExpList.indexOf(url as RegExp);
      if (index > -1) {
        this.regExpList.splice(index, 1);
      }
    } else {
      const index = this.stringList.indexOf(url as string);
      if (index > -1) {
        this.stringList.splice(index, 1);
      }
    }
  }

  isTracked(url: string): boolean {
    return this.searchStrings(url) ? true : this.searchRegExps(url);
  }

  private searchRegExps(url: string): boolean {
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
