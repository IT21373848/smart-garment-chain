interface ParameterDefinition {
  name: string;
  measuredIn: string;
  VName: string;
}

interface IQuality {
  // Returns the name of the item
  getItemName(): string;
  // Returns the parameters that this item requires
  getRequiredParameters(): ParameterDefinition[];
  // Given a set of parameters, calculates and returns the quality score and label
  calculateQuality(params: { [key: string]: any }): { label: string };
}