export class Sewing_Thread implements IQuality {

    PremiumThresHold = 30;
    HighThresHold = 20;

    getItemName(): string {
      return "Sewing Thread";
    }
  
    getRequiredParameters(): ParameterDefinition[] {
      return [
        { name: 'Tensile Strength', measuredIn: '', VName: 'Tensile' },
        { name: 'Uniformity & Diameter Consistency and Knot Security', measuredIn: '', VName: 'Uniformity' },
        { name: 'Friction and hairiness', measuredIn: '', VName: 'Friction' },
        { name: 'Elongation', measuredIn: '', VName: 'Elongation' },
      ];
    }
  
    calculateQuality(params: { [key: string]: any }): { score: number; label: string } {
        const score = 0.40*params.Tensile + 0.20*(1-params.Friction) + 0.20*params.Elongation + 0.20*params.Uniformity;
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