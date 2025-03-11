export class Elastic_Bands implements IQuality {

    PremiumThresHold = 11.67;
    HighThresHold = 8.33;

    getItemName(): string {
      return "Elastic Bands";
    }
  
    getRequiredParameters(): ParameterDefinition[] {
      return [
        { name: 'Stretch Percentage', measuredIn: '', VName: 'Stretch' },
        { name: 'Recovery Ratio', measuredIn: '', VName: 'Recovery' },
        { name: 'Fatigue Resistance', measuredIn: '', VName: 'Fatigue' }
      ];
    }
  
    calculateQuality(params: { [key: string]: any }): { score: number; label: string } {
        const score = 0.30*params.Stretch + 0.30*params.Recovery + 0.40*params.Fatigue;
        let label = '';
        if (score >= this.PremiumThresHold) {
          label = 'Premium';
        } else if (score >= this.HighThresHold) {
          label = 'High';
        } else {
          label = 'Standard';
        } 
        return label;
    }
}