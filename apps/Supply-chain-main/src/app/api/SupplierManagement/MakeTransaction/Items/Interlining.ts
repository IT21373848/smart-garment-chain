export class Interlining implements IQuality {

    PremiumThresHold = 1;
    HighThresHold = 1;
    StandardThresHold = 1;

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
  
    calculateQuality(params: { [key: string]: any }): { score: number; label: string } {
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
        } else if (score >= this.StandardThresHold) {
          label = 'Standard';
        } else {
          label = 'Low';
        }
    
        return label;
    }
    
}