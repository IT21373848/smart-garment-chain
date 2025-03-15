export class Cotton_Fabric implements IQuality {

    PremiumThresHold = 83.33;
    HighThresHold = 66.67;

    getItemName(): string {
      return "Cotton Fabric";
    }
  
    getRequiredParameters(): ParameterDefinition[] {
      return [
        { name: 'Weave Uniformity', measuredIn: '', VName: 'Uniformity' },
        { name: 'Tensile Strength', measuredIn: '', VName: 'Tensile' },
        { name: 'Shrinkage', measuredIn: '', VName: 'Shrinkage' },
        { name: 'Color Fastness', measuredIn: '', VName: 'Color' },
      ];
    }
  
    calculateQuality(params: { [key: string]: any }): {label: string } {
        const score = 0.40*params.Tensile + 0.10*params.Uniformity + 0.30*(1-params.Shrinkage) + 0.20*params.Color;
        let label = '';
        if (score >= this.PremiumThresHold) {
          label = 'Premium';
        } else if (score >= this.HighThresHold) {
          label = 'High';
        } else {
          label = 'Standard';
        } 
        return {label};
    }
}