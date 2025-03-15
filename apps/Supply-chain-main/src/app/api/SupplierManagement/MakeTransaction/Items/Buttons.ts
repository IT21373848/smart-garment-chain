export class Buttons implements IQuality {

    PremiumThresHold = 58.33;
    HighThresHold = 41.67;

    getItemName(): string {
      return "Buttons";
    }
  
    getRequiredParameters(): ParameterDefinition[] {
      return [
        { name: ' Breaking Strength', measuredIn: 'N', VName: 'Strength' },
        { name: 'Dimensional Accuracy', measuredIn: '', VName: 'Dimensional' },
        { name: 'Number of Connection Points', measuredIn: '', VName: 'Connection' },
        { name: 'Surface Finish & Material Consistency', measuredIn: '', VName: 'Finish' },
      ];
    }
  
    calculateQuality(params: { [key: string]: any }): { label: string } {
        const score = 0.50*params.Strength + 0.20*params.Dimensional + 0.20*params.Connection + 0.10*params.Finish;
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