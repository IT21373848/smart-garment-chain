function checkItem(qualityItems: IQuality[], itemName: string): IQuality | 0 {
    // Use the Array.find method to locate the item
    const item = qualityItems.find(q => q.getItemName() === itemName);
    return item ? item : 0;
}

export { checkItem };