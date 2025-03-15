export class Polyester_Fabric implements IQuality {

    PremiumThresHold = 73.33;
    HighThresHold = 56.67;

    getItemName(): string {
      return "Polyester Fabric";
    }
  
    getRequiredParameters(): ParameterDefinition[] {
      return [
        { name: 'Tensile and Abrasion Resistance', measuredIn: '', VName: 'Tensile' },
        { name: 'Pilling Resistance', measuredIn: '', VName: 'Pilling' },
        { name: 'Fabric Weight', measuredIn: '', VName: 'Weight' },
        { name: 'Moisture-Wicking Ability', measuredIn: '', VName: 'Wicking' },
        { name: 'Color Fastness', measuredIn: '', VName: 'Color' },
      ];
    }
  
    calculateQuality(params: { [key: string]: any }): {label: string } {
        const score = 0.35*params.Tensile + 0.25*(1-params.Pilling) + 0.20*params.Weight + 0.10*params.Wicking + 0.10*params.Color;
        let label = '';
        if (score >= this.PremiumThresHold) {
          label = 'Premium';
        } else if (score >= this.HighThresHold) {
          label = 'High';
        } else{
          label = 'Standard';
        }
        return {label};
    }
}