export class Silk_Fabric implements IQuality {

    PremiumThresHold = 56.67;
    HighThresHold = 43.33;

    getItemName(): string {
      return "Silk Fabric";
    }
  
    getRequiredParameters(): ParameterDefinition[] {
      return [
        { name: 'Luster & Appearance', measuredIn: '', VName: 'Luster' },
        { name: 'Tensile Strength', measuredIn: '', VName: 'Tensile' },
        { name: 'Drape Quality', measuredIn: '', VName: 'Drape' },
        { name: 'Color Fastness & Wrinkle Resistance', measuredIn: '', VName: 'Color_Wrinkle' },
      ];
    }
  
    calculateQuality(params: { [key: string]: any }): { score: number; label: string } {
        const score = 0.30*params.Luster + 0.30*params.Tensile + 0.20*params.Drape + 0.20*params.Color_Wrinkle;
        let label = '';
        if (score >= this.PremiumThresHold) {
          label = 'Premium';
        } else if (score >= this.HighThresHold) {
          label = 'High';
        } else{
          label = 'Standard';
        }
        return label;
    }
}