export class Zippers implements IQuality {

    PremiumThresHold = 46.67;
    HighThresHold = 33.33;

    getItemName(): string {
      return "Zippers";
    }
  
    getRequiredParameters(): ParameterDefinition[] {
      return [
        { name: 'Smoothness of Operation', measuredIn: '', VName: 'Smoothness' },
        { name: 'Tensile (Pull) Strength', measuredIn: '', VName: 'Pull' },
        { name: 'Cycle Durability', measuredIn: '', VName: 'Cycle' },
        { name: 'Corrosion Resistance', measuredIn: '', VName: 'Corrosion' },
      ];
    }
  
    calculateQuality(params: { [key: string]: any }): {label: string } {
        const score = 0.40*params.Pull + 0.30*params.Cycle + 0.20*params.Smoothness + 0.10*params.Corrosion;
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