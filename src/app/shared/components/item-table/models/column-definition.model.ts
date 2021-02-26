export class ColumnDefinition {
  constructor(init: Partial<ColumnDefinition> = {}) {
    this.name = init.name;
    this.header = init.header;
  }

  public name: string;
  public header: string;
}
