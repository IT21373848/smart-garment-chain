function checkItem(qualityItems: IQuality[], itemName: string): IQuality | 0 {
    const item = qualityItems.find(q => q.getItemName() === itemName);
    return item ? item : 0;
}

function ItemList(qualityItems: IQuality[]): string[] {
    return qualityItems.map(item => item.getItemName());
}

function getParametersList(itemName: string, qualityItems: IQuality[]): ParameterDefinition[] {
    const qualityItem = qualityItems.find(item => item.getItemName() === itemName);
    return qualityItem ? qualityItem.getRequiredParameters() : [];
}

export { checkItem,ItemList,getParametersList};