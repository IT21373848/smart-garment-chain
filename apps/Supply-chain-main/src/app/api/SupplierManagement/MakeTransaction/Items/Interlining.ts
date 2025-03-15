export class Interlining implements IQuality {

    PremiumThresHold = 66.67;
    HighThresHold = 55.33;

    getItemName(): string {
      return "Interlining";
    }
  
    getRequiredParameters(): ParameterDefinition[] {
      return [
        { name: 'Weight', measuredIn: 'g/m²', VName: 'Weight' },
        { name: 'Adhesion', measuredIn: '', VName: 'Adhesion' },
        { name: 'Stability', measuredIn: '', VName: 'Stability' },
      ];
    }
  
    calculateQuality(params: { [key: string]: any }): {label: string } {
        const weight = Number(params.Weight);
        const adhesion = Number(params.Adhesion);
        const stability = Number(params.Stability);

        const a = 0.35 * weight;
        const b = 0.40 * adhesion;
        const c = 0.25 * stability;
        const score = a + b + c;
    
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